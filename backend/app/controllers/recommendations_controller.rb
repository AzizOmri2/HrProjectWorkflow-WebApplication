require 'httparty'

class RecommendationsController < ApplicationController
  include ActionController::MimeResponds
  before_action :authenticate_user!

  # ===================================================
  # GET /recommendations/:id
  # ===================================================
  # Returns personalized job recommendations for the authenticated user
  # Uses caching and a call to Mistral AI for skill-based matching
  def index
    user_id = params[:id].to_i

    # 🔒 Ensure the authenticated user is accessing their own recommendations
    if current_user.id != user_id
      Rails.logger.warn "🔒 Forbidden access attempt by user #{current_user.id} to recommendations of user #{user_id}"
      return render json: { error: 'Forbidden' }, status: :forbidden
    end

    # 📄 Fetch user profile
    profile = current_user.profile
    unless profile
      return render json: {
        error: 'Profile not found'
      }, status: :not_found
    end

    # 💾 Check cache before making expensive AI calls
    cache_key = "recommended_offers_user_#{user_id}"
    if (cached = Rails.cache.read(cache_key)).present?
      Rails.logger.info "✅ Returning cached recommendations for user #{user_id}"
      return render json: cached
    end

    # 🔍 Extract skills and prepare data
    candidate_skills = extract_skills(profile.skills)
    offers_data = Offer.all.map do |offer|
      {
        id: offer.id,
        title: offer.title,
        skills: offer.skills_required.to_s.split(',').map(&:strip),
        location: offer.location,
        experience_level: offer.experience_level
      }
    end

    # 🧠 Build prompt and query the AI
    prompt = build_prompt(candidate_skills, offers_data)
    response = query_mistral(prompt)

    # 🧾 Handle API response
    case response&.code
    when 200
      parsed = parse_mistral_response(response)
      Rails.cache.write(cache_key, parsed, expires_in: 1.hour) if parsed
      render json: parsed || []
    when 401
      render json: { error: "Unauthorized: Check your API key." }, status: :unauthorized
    when 429
      error_data = JSON.parse(response.body) rescue nil
      error_message = error_data&.dig('error', 'message') || 'Rate limit exceeded.'
      render json: { error: error_message }, status: :too_many_requests
    else
      Rails.logger.error "❌ Mistral API failed: #{response&.body}"
      render json: { error: "AI API failed", details: response&.body }, status: :internal_server_error
    end
  rescue => e
    Rails.logger.error "💥 Exception in RecommendationsController#index: #{e.class} - #{e.message}"
    render json: { error: "Internal server error" }, status: :internal_server_error
  end

  private

  # ===================================================
  # 🔌 query_mistral(prompt)
  # ===================================================
  # Sends a prompt to Mistral AI for recommendations
  # Returns the full HTTP response object
  def query_mistral(prompt)
    api_url = ENV["MISTRAL_API_URL"]
    api_key = ENV["MISTRAL_API_KEY"]

    headers = {
      'Authorization' => "Bearer #{api_key}",
      'Content-Type' => 'application/json'
    }

    body = {
      model: "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        { role: "system", content: "You are an expert AI assistant helping match candidates to job offers based on their skills." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    }.to_json

    Rails.logger.info "📡 Sending request to Mistral API"
    HTTParty.post(api_url, headers: headers, body: body)
  rescue => e
    Rails.logger.error "🚫 Failed to contact Mistral: #{e.class} - #{e.message}"
    nil
  end

  # ===================================================
  # 🧾 parse_mistral_response(response)
  # ===================================================
  # Parses the JSON content inside a markdown-style code block returned by Mistral
  # Expects format: ```json ... ```
  def parse_mistral_response(response)
    # Extract content from API response
    json_string = JSON.parse(response.body).dig("choices", 0, "message", "content")

    # Try to extract JSON from ```json ... ``` block
    json_match = json_string.match(/```json(.+?)```/m)
    raw_json = json_match ? json_match[1].strip : json_string.strip

    # Parse JSON (works for both code block and plain JSON)
    JSON.parse(raw_json)
  rescue JSON::ParserError => e
    Rails.logger.error "❌ Failed to parse recommendations JSON: #{e.message}"
    []
  end

  # ===================================================
  # 🧠 extract_skills(skills_json)
  # ===================================================
  # Converts stored JSON or array of skills into a clean lowercase array
  def extract_skills(skills_json)
    return [] if skills_json.blank?

    parsed = skills_json.is_a?(Array) ? skills_json : JSON.parse(skills_json)
    parsed.map(&:downcase)
  rescue JSON::ParserError => e
    Rails.logger.error "⚠️ Failed to parse skills JSON: #{e.message}"
    []
  end

  # ===================================================
  # ✍️ build_prompt(candidate_skills, offers)
  # ===================================================
  # Constructs a formatted string prompt to send to the AI
  # Contains a list of candidate skills and job offers
  def build_prompt(candidate_skills, offers)
    <<~PROMPT
      A candidate has the following skills:
      #{candidate_skills.join(', ')}

      Here are job offers:
      #{offers.map { |o| "- Offer ##{o[:id]}: #{o[:title]} (#{o[:experience_level]}, Skills: #{o[:skills].join(', ')})" }.join("\n")}

      Based on the similarity between candidate skills and offer requirements, rank the top 3 best job offers (return as JSON: id, title, match_reason).
    PROMPT
  end
end
