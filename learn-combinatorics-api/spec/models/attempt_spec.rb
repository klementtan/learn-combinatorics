# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Attempt, type: :model do
  it { is_expected.to validate_presence_of(:user_uid) }
  it { is_expected.to belong_to(:problem) }
  it { is_expected.to belong_to(:last_hint) }
  it { is_expected.to belong_to(:answer) }

  it 'unique user_uid and problem_id for attempt' do
    attempt = create(:attempt)
    expect { described_class.create!(problem: attempt.problem, user_uid: attempt.user_uid) }.to raise_error(ActiveRecord::RecordInvalid, 'Validation failed: User uid has already been taken')
  end

  describe 'last hint' do
    it 'create with default no last hint' do
      problem = create(:problem)
      attempt = problem.attempts.create!({ user_uid: 'ABadsfDHJKc' })
      expect(attempt).not_to be_nil
      expect(attempt.last_hint).to be_nil
    end

    it 'create with default with last hint' do
      problem = create(:problem)
      hint = create(:hint)
      attempt = problem.attempts.create!({ user_uid: 'ABadsfDHJKc', last_hint: hint })
      expect(attempt).not_to be_nil
      expect(attempt.last_hint).to be(hint)
    end
  end

  describe 'status' do
    it 'all failure attempt' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator - 1,
        submission_value_denominator: 1
      )
      expect(attempt.status).to eq('in_progress')
    end

    it 'single pass attempt' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator - 1,
        submission_value_denominator: 1
      )
      attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator - 2,
        submission_value_denominator: 1
      )
      attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator - 3,
        submission_value_denominator: 1
      )
      attempt.submissions.create!(
        submission_value_numerator: answer.answer_value_numerator,
        submission_value_denominator: answer.answer_value_denominator
      )
      expect(attempt.status).to eq('pass')
    end
  end
end
