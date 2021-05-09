# frozen_string_literal: true

class AnswerSerializer < ActiveModel::Serializer
  attributes :id, :explanation_body, :answer_value_denominator, :answer_value_numerator, :explanation_video_url,
             :explanation_body_pdf_url
  belongs_to :problem
  delegate :explanation_video_url, to: :object
  delegate :explanation_body_pdf_url, to: :object
end
