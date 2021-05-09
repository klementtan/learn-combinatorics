# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Hint, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to validate_presence_of(:body) }
  it { is_expected.to belong_to(:problem) }

  describe 'act as list' do
    it 'auto increment' do
      parent_problem = create(:problem)
      hint1 = parent_problem.hints.create!(title: 'hint1 title', body: 'hint 1 body')
      hint2 = parent_problem.hints.create!(title: 'hint2 title', body: 'hint 2 body')
      expect(hint1.position).to eq(1)
      expect(hint2.position).to eq(2)
    end

    it 'handle different parent scope' do
      parent_problem1 = create(:problem)
      parent_problem2 = create(:problem)
      hint1 = parent_problem1.hints.create!(title: 'hint1 title', body: 'hint 1 body')
      hint2 = parent_problem2.hints.create!(title: 'hint2 title', body: 'hint 2 body')
      expect(hint1.position).to eq(1)
      expect(hint2.position).to eq(1)
    end

    it 'handle change in parent scope' do
      parent_problem1 = create(:problem)
      parent_problem2 = create(:problem)
      parent_problem1.hints.create!(title: 'hint1 title', body: 'hint 1 body')
      hint2 = parent_problem1.hints.create!(title: 'hint2 title', body: 'hint 2 body')
      expect(hint2.position).to eq(2)
      hint2.problem = parent_problem2
      hint2.save!
      expect(hint2.position).to eq(1)
    end
  end
end
