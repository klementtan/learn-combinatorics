# frozen_string_literal: true

class SubmissionSerializer < ActiveModel::Serializer
  attributes :id, :submission_value_numerator, :submission_value_denominator, :status, :created_at, :updated_at
  belongs_to :attempt
end
