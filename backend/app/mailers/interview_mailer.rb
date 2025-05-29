class InterviewMailer < ApplicationMailer
    def interview_accepted(candidate, interview, application)
        @candidate = candidate
        @interview = interview
        @application = application
        mail(to: @candidate.email, subject: "HRProject Workflow | Your interview has been accepted !")
    end

    def interview_rejected(candidate, interview, application)
        @candidate = candidate
        @interview = interview
        @application = application
        mail(to: @candidate.email, subject: "HRProject Workflow | Your interview has been rejected !")
    end
end
