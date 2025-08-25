require 'prometheus_exporter/middleware'
Rails.application.middleware.use PrometheusExporter::Middleware

# Optional: standalone metrics server on 9394
if Rails.env.production?
  require 'prometheus_exporter/server'
  Thread.new do
    PrometheusExporter::Server::WebServer.new(port: 9394).start
  end
end