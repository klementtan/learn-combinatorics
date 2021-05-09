# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Answer, type: :model do
  it { is_expected.to validate_presence_of(:explanation_body) }
  it { is_expected.to validate_presence_of(:answer_value_denominator) }
  it { is_expected.to validate_presence_of(:answer_value_numerator) }

  describe 'answer value' do
    it 'validate simplest form fraction' do
      problem = create(:problem)
      answer = described_class.create!(
        problem: problem,
        explanation_body: 'body',
        answer_value_numerator: 7,
        answer_value_denominator: 3
      )
      expect(answer).not_to be_nil
    end

    it 'reject fraction not simplest form' do
      problem = create(:problem)
      expect do
        described_class.create!(
          problem: problem,
          explanation_body: 'body',
          answer_value_numerator: 20,
          answer_value_denominator: 4
        )
      end.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
