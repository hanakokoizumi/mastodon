# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TranslationService::OpenAiCompatible do
  subject(:service) { described_class.new('https://llm.example.com', 'token', 'gpt-test', 'Custom LLM', nil) }

  describe '#translate' do
    it 'returns translations with configured display name as provider' do
      stub_request(:post, 'https://llm.example.com/v1/chat/completions')
        .with(headers: { 'Content-Type' => 'application/json', :Authorization => 'Bearer token' })
        .to_return(
          body: Oj.dump(
            'choices' => [
              {
                'message' => {
                  'content' => '{"detected_source_language":"es","translations":["See you"]}',
                },
              },
            ]
          )
        )

      translations = service.translate(['Hasta la vista'], 'es', 'en')
      expect(translations.size).to eq 1

      translation = translations.first
      expect(translation.detected_source_language).to eq 'es'
      expect(translation.provider).to eq 'Custom LLM'
      expect(translation.text).to eq 'See you'
    end

    it 'strips markdown code fences from model output' do
      stub_request(:post, 'https://llm.example.com/v1/chat/completions')
        .to_return(
          body: Oj.dump(
            'choices' => [
              {
                'message' => {
                  'content' => "```json\n{\"detected_source_language\":\"de\",\"translations\":[\"Hi\"]}\n```",
                },
              },
            ]
          )
        )

      translations = service.translate(['Hallo'], 'de', 'en')
      expect(translations.first.text).to eq 'Hi'
      expect(translations.first.provider).to eq 'Custom LLM'
    end

    it 'translates multiple fragments in one request' do
      stub_request(:post, 'https://llm.example.com/v1/chat/completions')
        .with(body: /"fragments":\[\\"A\\",\\"B\\"\]/)
        .to_return(
          body: Oj.dump(
            'choices' => [
              {
                'message' => {
                  'content' => '{"detected_source_language":"de","translations":["One","Two"]}',
                },
              },
            ]
          )
        )

      translations = service.translate(%w(A B), 'de', 'en')
      expect(translations.map(&:text)).to eq %w(One Two)
    end

    context 'when display_name is blank' do
      subject(:service) { described_class.new('https://llm.example.com', 'token', 'gpt-mini', '', nil) }

      it 'uses the model id as provider label' do
        stub_request(:post, 'https://llm.example.com/v1/chat/completions')
          .to_return(
            body: Oj.dump(
              'choices' => [
                {
                  'message' => {
                    'content' => '{"detected_source_language":"en","translations":["X"]}',
                  },
                },
              ]
            )
          )

        expect(service.translate(['Y'], 'en', 'de').first.provider).to eq 'gpt-mini'
      end
    end

    context 'without an API key' do
      subject(:service) { described_class.new('https://ollama.example.com', '', 'llama', 'Local', nil) }

      it 'does not send an Authorization header' do
        stub_request(:post, 'https://ollama.example.com/v1/chat/completions')
          .with { |req| !req.headers.key?('Authorization') }
          .to_return(
            body: Oj.dump(
              'choices' => [
                {
                  'message' => {
                    'content' => '{"detected_source_language":"en","translations":["Z"]}',
                  },
                },
              ]
            )
          )

        service.translate(['Q'], 'en', 'fr')
        expect(a_request(:post, 'https://ollama.example.com/v1/chat/completions')).to have_been_made.once
      end
    end
  end

  describe '#languages' do
    context 'with supported_languages configured' do
      subject(:service) { described_class.new('https://llm.example.com', '', 'm', '', 'en, ja ,de') }

      it 'returns only configured targets and excludes same-language pairs' do
        langs = service.languages
        expect(langs[nil]).to eq %w(de en ja)
        expect(langs['en']).to eq %w(de ja)
        expect(langs['ja']).to eq %w(de en)
      end
    end
  end

  describe 'endpoint URL normalization' do
    subject(:service) { described_class.new('https://api.openai.com/v1', 'k', 'm', 'OpenAI', nil) }

    it 'does not duplicate /v1 in the path' do
      stub_request(:post, 'https://api.openai.com/v1/chat/completions')
        .to_return(
          body: Oj.dump(
            'choices' => [
              { 'message' => { 'content' => '{"detected_source_language":"en","translations":["ok"]}' } },
            ]
          )
        )

      service.translate(['x'], 'en', 'de')
      expect(a_request(:post, 'https://api.openai.com/v1/chat/completions')).to have_been_made.once
    end
  end
end
