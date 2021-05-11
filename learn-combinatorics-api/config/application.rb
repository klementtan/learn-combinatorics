# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_mailbox/engine'
require 'action_text/engine'
require 'action_view/railtie'
require 'action_cable/engine'
require "ostruct"
require 'set'


Bundler.require(*Rails.groups)

module LearningCombinatoricsApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.autoload_paths += Dir["#{config.root}/app/errors/**/"]
    config.autoload_paths += Dir["#{config.root}/app/enums/**/"]
    config.action_mailer.default_url_options = { host: ENV['HOST']}
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource(
          '*',
          headers: :any, methods: %i[get patch put delete post options]
        )
      end
    end
    config.api_only = true
  end
end
