# frozen_string_literal: true

class SubmissionValidator < ActiveModel::Validator
  def validate(record)
    numerator = record.submission_value_numerator
    denominator = record.submission_value_denominator
    if numerator.nil? || denominator.nil?
      record.errors[:base] << 'numerator and denominator cannot be absent'
      return
    end
    record.errors[:base] << 'Fraction needs to be the simplest form' unless numerator.gcd(denominator) == 1
  end
end

class Submission < ApplicationRecord
  belongs_to :attempt
  validates :submission_value_numerator, :submission_value_denominator, presence: true
  validates_with SubmissionValidator
  enum status: { fail: 0, pass: 1 }
  before_save :check_status

  private

  def check_status
    attempt = self.attempt
    raise LogicalError, 'Submission does not have an attempt' if attempt.nil?

    problem = attempt.problem
    raise LogicalError, 'Attempt does not have an problem' if problem.nil?

    answer = problem.answer
    raise LogicalError, 'problem does not have an answer' if answer.nil?

    numerator = submission_value_numerator
    denominator = submission_value_denominator
    answer_numerator = answer.answer_value_numerator
    answer_denominator = answer.answer_value_denominator
    status = 0
    status = 1 if numerator == answer_numerator && denominator == answer_denominator
    self.status = status
    true
  end
end
