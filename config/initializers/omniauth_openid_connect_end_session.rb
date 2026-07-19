# frozen_string_literal: true

require_relative '../../lib/omniauth/strategies/openid_connect/end_session_enhancement'

Rails.application.config.to_prepare do
  next unless Rails.configuration.x.omniauth.oidc_enabled?

  require 'omniauth/strategies/openid_connect'

  strategy = OmniAuth::Strategies::OpenIDConnect
  mod = OmniAuth::Strategies::OpenidConnectEndSessionEnhancement

  next if strategy.ancestors.include?(mod)

  strategy.prepend(mod)
end
