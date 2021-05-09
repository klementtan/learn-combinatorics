# frozen_string_literal: true

class AnswerValidator < ActiveModel::Validator
  def validate(record)
    numerator = record.answer_value_numerator
    denominator = record.answer_value_denominator
    if numerator.nil? || denominator.nil?
      record.errors[:base] << 'numerator and denominator cannot be absent'
      return
    end
    record.errors[:base] << 'Fraction needs to be the simplest form' unless numerator.gcd(denominator) == 1
  end
end

class Answer < ApplicationRecord
  include Rails.application.routes.url_helpers

  has_many :attempts, dependent: :nullify, inverse_of: :answer
  belongs_to :problem
  has_one_attached :explanation_video
  has_one_attached :explanation_body_pdf
  validates :answer_value_denominator, :answer_value_numerator, presence: true
  validates_with AnswerValidator

  def explanation_video_url
    url = nil
    if explanation_video.attached?
      url = rails_blob_url(explanation_video, Rails.application.config.action_mailer.default_url_options)
    end
    url
  end

  def explanation_body_pdf_url
    url = nil
    if explanation_body_pdf.attached?
      url = rails_blob_url(explanation_body_pdf, Rails.application.config.action_mailer.default_url_options)
    end
    url
  end

end
