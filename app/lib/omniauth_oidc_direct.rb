# frozen_string_literal: true

# Helpers for instances that use OpenID Connect as their sole OmniAuth strategy:
# the web UI can link directly to the OmniAuth authorize endpoint instead of
# Mastodon's HTML sign-in / sign-up pages.
#
# NOTE: These methods may run during Rails boot (e.g. CSP initializer) before
# Devise has loaded mappings — always guard Devise access.
module OmniauthOidcDirect
  module_function

  def devise_user_mapping
    return unless defined?(Devise) && Devise.respond_to?(:mappings)

    Devise.mappings[:user]
  end

  def user_omniauthable?
    devise_user_mapping&.omniauthable? == true
  rescue
    false
  end

  # True when this instance is configured for SSO-only web sign-in/up via OIDC.
  def single_oidc_provider?
    return false unless user_omniauthable?
    return false unless Devise.respond_to?(:omniauth_providers)

    providers = Devise.omniauth_providers
    return false unless providers&.length == 1

    ENV['OMNIAUTH_ONLY'] == 'true' &&
      Rails.configuration.x.omniauth.oidc_enabled? &&
      providers.first.to_sym == :openid_connect
  rescue
    false
  end

  def omniauth_authorize_href
    "/auth/auth/#{Devise.omniauth_providers.first}" if single_oidc_provider?
  end

  def form_action_csp_required?
    return false unless user_omniauthable?
    return false unless Devise.respond_to?(:omniauth_providers)

    providers = Devise.omniauth_providers
    return false unless providers&.length == 1

    (ENV['ONE_CLICK_SSO_LOGIN'] == 'true' && ENV['OMNIAUTH_ONLY'] == 'true') ||
      single_oidc_provider?
  rescue
    false
  end
end
