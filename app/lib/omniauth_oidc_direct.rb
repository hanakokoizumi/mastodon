# frozen_string_literal: true

# Helpers for instances that use OpenID Connect as their sole OmniAuth strategy:
# the web UI can link directly to the OmniAuth authorize endpoint instead of
# Mastodon's HTML sign-in / sign-up pages.
module OmniauthOidcDirect
  module_function

  # True when this instance is configured for SSO-only web sign-in/up via OIDC.
  def single_oidc_provider?
    ENV['OMNIAUTH_ONLY'] == 'true' &&
      Rails.configuration.x.omniauth.oidc_enabled? &&
      Devise.mappings[:user].omniauthable? &&
      Devise.omniauth_providers.length == 1 &&
      Devise.omniauth_providers.first.to_sym == :openid_connect
  end

  def omniauth_authorize_href
    "/auth/auth/#{Devise.omniauth_providers.first}" if single_oidc_provider?
  end

  def form_action_csp_required?
    (ENV['ONE_CLICK_SSO_LOGIN'] == 'true' && ENV['OMNIAUTH_ONLY'] == 'true' && Devise.omniauth_providers.length == 1) ||
      single_oidc_provider?
  end
end
