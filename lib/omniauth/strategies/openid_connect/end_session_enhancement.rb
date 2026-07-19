# frozen_string_literal: true

module OmniAuth
  module Strategies
    # omniauth_openid_connect only appends +post_logout_redirect_uri+ to the end-session URL.
    # Many OPs (e.g. oidc-provider as used by Logto) also require +client_id+ and/or +id_token_hint+
    # or they ignore +post_logout_redirect_uri+.
    module OpenidConnectEndSessionEnhancement
      ID_TOKEN_HINT_SESSION_KEY = 'omniauth.openid_connect.id_token_hint'

      def end_session_uri
        return unless send(:end_session_endpoint_is_valid?)

        uri = URI(client_options.end_session_endpoint)
        pairs = Rack::Utils.parse_query(uri.query.to_s)

        pairs['post_logout_redirect_uri'] = options.post_logout_redirect_uri if options.post_logout_redirect_uri.present?

        pairs['client_id'] = client_options.identifier if client_options.identifier.present?

        id_hint = session.delete(ID_TOKEN_HINT_SESSION_KEY)
        pairs['id_token_hint'] = id_hint if id_hint.present?

        uri.query = pairs.any? ? Rack::Utils.build_query(pairs) : nil
        uri.to_s
      end
    end
  end
end
