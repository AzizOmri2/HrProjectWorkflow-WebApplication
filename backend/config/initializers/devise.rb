Devise.setup do |config|
  config.secret_key = Rails.application.credentials.secret_key_base
  config.mailer_sender = 'azizomriomri@gmail.com'
  require 'devise/orm/active_record'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.navigational_formats = []
  config.sign_out_via = :delete
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other

  config.router_name = :main

  config.jwt do |jwt|    
    jwt.secret = Rails.application.credentials.secret_key_base
    jwt.dispatch_requests = [
      ['POST', %r{^/users$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/users$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
end