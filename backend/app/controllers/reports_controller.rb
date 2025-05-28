class ReportsController < ApplicationController
    def funnel
        offers = Offer.count
        applications = Application.count
        interviews = Interview.count
        selected = Application.where(status: 'Accepted').count

        render json: {
            total_offers: offers,
            total_applications: applications,
            total_interviews: interviews,
            selected_candidates: selected
        }
    end

    def time_to_hire
        durations = Application.joins(:interview)
            .where.not(applied_at: nil)
            .pluck('interviews.interview_date', 'applications.applied_at')
            .map { |interview_date, applied_at| (interview_date.to_date - applied_at.to_date).to_i }

        avg_duration = durations.sum / durations.size.to_f rescue 0

        render json: { average_days_to_interview: avg_duration }
    end

    def diversity
        gender_counts = User.group(:gender).count
        age_buckets = {
            "18-25" => 0, "26-35" => 0, "36-50" => 0, "51+" => 0
        }

        User.where.not(birth_date: nil).find_each do |user|
            age = ((Date.today - user.birth_date) / 365).to_i
            case age
            when 18..25 then age_buckets["18-25"] += 1
            when 26..35 then age_buckets["26-35"] += 1
            when 36..50 then age_buckets["36-50"] += 1
            else age_buckets["51+"] += 1
            end
        end

        nationalities = User.group(:nationality).count

        render json: {
            gender_distribution: gender_counts,
            age_distribution: age_buckets,
            nationality_distribution: nationalities
        }
    end
end
