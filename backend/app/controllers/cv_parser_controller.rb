class CvParserController < ApplicationController
  before_action :authenticate_user!
  require 'net/http'
  require 'json'
  require 'pdf-reader'
  require 'fileutils'

  def show
    profile = current_user.profile

    if profile
      render json: { profile: profile }, status: :ok
    else
      render json: { error: 'Profile not found' }, status: :not_found
    end
  end

  def update
    profile = current_user.profile

    unless profile
      return render json: { error: 'Profile not found' }, status: :not_found
    end

    begin
      # Update attributes from params
      profile.assign_attributes(
        name: params[:name],
        email: params[:email],
        phone: params[:phone],
        skills: params[:skills].to_json,
        experience: params[:experience].to_json,
        education: params[:education].to_json
      )

      if profile.save
        render json: { message: 'Profile updated successfully', profile: profile }, status: :ok
      else
        render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: "Failed to update profile: #{e.message}" }, status: :internal_server_error
    end
  end

  def upload
    file = params[:file]

    unless file
      Rails.logger.error "🚫 No file uploaded"
      return render json: { error: 'No file uploaded' }, status: :bad_request
    end

    Rails.logger.info "📄 File received: #{file.original_filename}"

    # Step 1: Extract text from PDF
    text = extract_text_from_pdf(file)
    Rails.logger.info "📜 Extracted text size: #{text.length} characters"

    # Step 2: Ask Mistral to parse it
    parsed_data = ask_mistral_to_parse(text)

    if parsed_data.nil?
      Rails.logger.error "🚫 Parsed data is nil (LLM parsing failed)"
      return render json: { error: 'Failed to parse CV' }, status: :unprocessable_entity
    end

    if parsed_data.is_a?(Hash) && parsed_data['error'] == 'rate_limit'
      return render json: { error: parsed_data['message'] }, status: :too_many_requests
    end

    # Flatten skills to a single array
    flat_skills = flatten_skills(parsed_data['skills'])

    # Step 3: Save file to disk
    filename = save_cv_to_disk(file)
    Rails.logger.info "💾 File saved to: #{filename}"

    # Step 4: Update or create profile
    profile = current_user.profile || current_user.build_profile

    profile.assign_attributes(
      name: parsed_data['name'],
      email: parsed_data['email'],
      phone: parsed_data['phone'],
      skills: flat_skills.to_json,        # Store flat skills array as JSON string
      experience: parsed_data['experience'].to_json,
      education: parsed_data['education'].to_json,
      cv_file: filename
    )

    if profile.save
      Rails.logger.info "✅ Profile created/updated successfully"
      render json: { message: 'Profile created/updated successfully', profile: profile }, status: :created
    else
      Rails.logger.error "🚫 Profile save failed: #{profile.errors.full_messages}"
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def extract_text_from_pdf(file)
    text = ''
    reader = PDF::Reader.new(file.tempfile)
    reader.pages.each { |page| text << page.text }
    text
  rescue => e
    Rails.logger.error "❌ Failed to extract PDF text: #{e.message}"
    ''
  end

  def ask_mistral_to_parse(text)
    uri = URI(ENV['MISTRAL_API_URL'])
    api_key = ENV['MISTRAL_API_KEY_CV_PARSING']

    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{api_key}"
    request['Content-Type'] = 'application/json'

    prompt = <<~PROMPT
      Extract the following information from this resume and return only valid JSON (no markdown formatting or explanations):

      Keys: name, email, phone, skills, experience, education.

      Resume:
      #{text}
    PROMPT

    request.body = {
      model: 'mistralai/mistral-small-3.1-24b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }

    Rails.logger.info "📥 Mistral response status: #{response.code}"

    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      content = data.dig('choices', 0, 'message', 'content')
      Rails.logger.info "📤 LLM Response content: #{content}"

      # Clean and extract JSON content
      cleaned_json = content.to_s[/\{.*\}/m]  # Regex to match {...} block
      JSON.parse(cleaned_json)
    elsif response.code.to_i == 429
      # Rate limit error - handle gracefully by returning an error hash
      error_data = JSON.parse(response.body) rescue nil
      error_message = error_data&.dig('error', 'message') || 'Rate limit exceeded. Please wait and try again.'
      Rails.logger.error "⏱️ Rate limit hit: #{error_message}"
      { 'error' => 'rate_limit', 'message' => error_message }
    else
      Rails.logger.error "❌ Mistral API error: #{response.code} - #{response.body}"
      nil
    end
  rescue JSON::ParserError => e
    Rails.logger.error "❌ Failed to parse LLM JSON: #{e.class} - #{e.message}"
    nil
  rescue => e
    Rails.logger.error "❌ Unexpected error in ask_mistral_to_parse: #{e.class} - #{e.message}"
    nil
  end

  def save_cv_to_disk(file)
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    sanitized_name = current_user.name.to_s.gsub(/\s+/, '_').gsub(/[^0-9A-Za-z_]/, '')
    extension = File.extname(file.original_filename)
    filename = "CV_#{sanitized_name}_#{current_user.id}_#{timestamp}#{extension}"

    upload_dir = Rails.root.join('public', 'uploads', 'profile_cv')
    FileUtils.mkdir_p(upload_dir) unless Dir.exist?(upload_dir)

    full_path = upload_dir.join(filename)

    # ✅ Rewind the tempfile before reading
    file.tempfile.rewind
    File.open(full_path, 'wb') { |f| f.write(file.tempfile.read) }

    Rails.logger.info "📁 CV stored at: #{full_path}"
    filename
  end

  # Flatten the skills hash or array into a simple array of unique skills
  def flatten_skills(skills)
    return [] unless skills.is_a?(Hash) || skills.is_a?(Array)

    if skills.is_a?(Hash)
      skills.values.flatten.uniq
    elsif skills.is_a?(Array)
      skills
    else
      []
    end
  end
end
