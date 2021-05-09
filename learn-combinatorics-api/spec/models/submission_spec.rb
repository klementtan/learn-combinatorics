# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Submission, type: :model do
  it { is_expected.to validate_presence_of(:submission_value_denominator) }
  it { is_expected.to validate_presence_of(:submission_value_numerator) }

  describe 'submission value' do
    it 'validate simplest form fraction' do
      attempt = create(:attempt)
      submission = attempt.submissions.create!(
        submission_value_numerator: 7,
        submission_value_denominator: 3
      )
      expect(submission).not_to be_nil
    end

    it 'reject fraction not simplest form' do
      attempt = create(:attempt)
      expect do
        attempt.submissions.create!(
          submission_value_numerator: 14,
          submission_value_denominator: 7
        )
      end.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe 'status value' do
    it 'invalid answer' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      submission = attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator - 1,
        submission_value_denominator: 1
      )
      expect(submission.status).to eq('fail')
    end

    it 'valid answer' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      submission = attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator,
        submission_value_denominator: answer.answer_value_denominator
      )
      expect(submission.status).to eq('pass')
    end
  end
end
