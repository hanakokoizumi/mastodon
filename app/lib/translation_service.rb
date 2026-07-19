# frozen_string_literal: true

class TranslationService
  class Error < StandardError; end
  class NotConfiguredError < Error; end
  class TooManyRequestsError < Error; end
  class QuotaExceededError < Error; end
  class UnexpectedResponseError < Error; end

  def self.configured
    if configuration.deepl[:api_key].present?
      TranslationService::DeepL.new(
        configuration.deepl[:plan],
        configuration.deepl[:api_key]
      )
    elsif openai_compatible_configured?
      c = configuration.openai_compatible || {}
      TranslationService::OpenAiCompatible.new(
        c[:endpoint],
        c[:api_key],
        c[:model],
        c[:display_name],
        c[:supported_languages]
      )
    elsif configuration.libre_translate[:endpoint].present?
      TranslationService::LibreTranslate.new(
        configuration.libre_translate[:endpoint],
        configuration.libre_translate[:api_key]
      )
    else
      raise NotConfiguredError
    end
  end

  def self.configured?
    configuration.deepl[:api_key].present? || openai_compatible_configured? || configuration.libre_translate[:endpoint].present?
  end

  def self.openai_compatible_configured?
    c = configuration.openai_compatible || {}
    c[:endpoint].present? && c[:model].present?
  end

  def self.configuration
    Rails.configuration.x.translation
  end

  def languages
    {}
  end

  def translate(_text, _source_language, _target_language)
    raise NotImplementedError
  end
end
