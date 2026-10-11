# frozen_string_literal: true

InlineSvg.configure do |config|
  config.add_custom_transformation(
    attribute: :style_nonce,
    transform: Class.new(InlineSvg::CustomTransformation) do
      def transform(doc)
        doc.css('style').each { |style| style['nonce'] = value }
        doc
      end
    end
  )
end
