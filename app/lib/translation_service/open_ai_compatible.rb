# frozen_string_literal: true

class TranslationService::OpenAiCompatible < TranslationService
  # rubocop:disable I18n/RailsI18n/DecorateString -- LLM system prompt, not user-facing i18n
  SYSTEM_PROMPT = <<~PROMPT.squish.freeze
    You translate social network status fragments for Mastodon.
    You will receive a JSON object with keys: source_language (ISO 639-1 code or null), target_language (ISO 639-1 code), and fragments (array of strings, often HTML).
    Translate each fragment into target_language. Preserve HTML tags, mentions, hashtags, and :emoji_shortcodes: exactly.
    Respond with a single JSON object only (no markdown fences) containing:
    detected_source_language (ISO 639-1 code of the source text; use source_language when it is not null),
    and translations (array of translated strings, same length and order as fragments).
  PROMPT
  # rubocop:enable I18n/RailsI18n/DecorateString

  def initialize(endpoint, api_key, model, display_name, supported_languages)
    super()

    @endpoint                        = endpoint
    @api_key                         = api_key
    @model                           = model
    @display_name                    = display_name
    @configured_supported_languages  = supported_languages
  end

  def translate(texts, source_language, target_language)
    body = Oj.dump(
      model: @model,
      temperature: 0.2,
      max_tokens: 16_384,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: Oj.dump(
            source_language: source_language,
            target_language: target_language,
            fragments: texts
          ),
        },
      ]
    )

    request(:post, chat_completions_path, body: body) do |res|
      transform_response(res.body_with_limit, source_language, texts.length)
    end
  end

  def languages
    targets = supported_targets
    sources = [nil] + targets

    sources.index_with do |source|
      next targets if source.nil?

      src_primary = primary_language_tag(source)
      targets.reject { |t| primary_language_tag(t) == src_primary }
    end
  end

  private

  def provider_label
    @display_name.presence || @model.presence || 'OpenAI-compatible API'
  end

  def chat_completions_path
    base = @endpoint.to_s.chomp('/')
    base = "#{base}/v1" unless base.end_with?('/v1')
    "#{base}/chat/completions"
  end

  def supported_targets
    @supported_targets ||= begin
      raw = @configured_supported_languages.presence || TranslationService.configuration.openai_compatible&.[](:supported_languages)
      if raw.present?
        raw.split(',').map { |code| primary_language_tag(code) }.uniq.sort
      else
        LanguagesHelper::ISO_639_1.keys.map(&:to_s).uniq.sort
      end
    end
  end

  def primary_language_tag(code)
    code.to_s.split(/[_-]/).first.downcase
  end

  def request(verb, url, **)
    req = Request.new(verb, url, allow_local: true, **)
    req.add_headers('Content-Type' => 'application/json')
    req.add_headers(Authorization: "Bearer #{@api_key}") if @api_key.present?
    req.perform do |res|
      case res.code
      when 429
        raise TooManyRequestsError
      when 402
        raise QuotaExceededError
      when 200...300
        yield res
      else
        raise UnexpectedResponseError
      end
    end
  end

  def transform_response(json, source_language, fragment_count)
    data = Oj.load(json, mode: :strict)
    raise UnexpectedResponseError unless data.is_a?(Hash)

    content = data.dig('choices', 0, 'message', 'content')
    raise UnexpectedResponseError if content.blank?

    parsed = parse_model_json(content)
    raise UnexpectedResponseError unless parsed.is_a?(Hash)

    translations = parsed['translations']
    raise UnexpectedResponseError unless translations.is_a?(Array) && translations.length == fragment_count

    detected = primary_language_tag(parsed['detected_source_language'].presence || source_language)
    detected = 'und' if detected.blank?

    translations.map do |text|
      Translation.new(
        text: text.to_s,
        detected_source_language: detected,
        provider: provider_label
      )
    end
  rescue Oj::ParseError
    raise UnexpectedResponseError
  end

  def parse_model_json(content)
    stripped = content.to_s.strip
    stripped = stripped.sub(/\A```(?:json)?\s*/i, '')
    stripped = stripped.sub(/\s*```\z/, '')
    Oj.load(stripped, mode: :strict)
  end
end
