# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.3.8
FROM ruby:$RUBY_VERSION-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    curl libjemalloc2 libvips42 postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Environment variables
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test

# Build stage
FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential git libpq-dev libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install Ruby gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache

# Copy application code
COPY . .

# Precompile assets (optional: if you use asset pipeline)
RUN bundle exec bootsnap precompile --gemfile && \
    bundle exec bootsnap precompile app/ lib/ && \
    bundle exec rake assets:precompile

# Final stage
FROM base
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /app /app

# Create non-root user
RUN groupadd --system --gid 1000 rails && \
    useradd --system --uid 1000 --gid 1000 --create-home --shell /bin/bash rails && \
    chown -R rails:rails /app

USER rails
WORKDIR /app

EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
