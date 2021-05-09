# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Lecture, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to belong_to(:section) }
  it { is_expected.to have_many(:problems) }

  describe 'act as list' do
    it 'auto increment' do
      parent_section = create(:section)
      lecture1 = parent_section.lectures.create!(title: 'lecture2 title')
      lecture2 = parent_section.lectures.create!(title: 'lecture2 title')
      expect(lecture1.position).to eq(1)
      expect(lecture2.position).to eq(2)
    end

    it 'handle different parent scope' do
      parent_section1 = create(:section)
      parent_section2 = create(:section)
      lecture1 = parent_section1.lectures.create!(title: 'lecture1 title')
      lecture2 = parent_section2.lectures.create!(title: 'lecture2 title')
      expect(lecture1.position).to eq(1)
      expect(lecture2.position).to eq(1)
    end

    it 'handle change in parent scope' do
      parent_section1 = create(:section)
      parent_section2 = create(:section)
      parent_section1.lectures.create!(title: 'lecture1 title')
      lecture2 = parent_section1.lectures.create!(title: 'section2 title')
      expect(lecture2.position).to eq(2)
      lecture2.section = parent_section2
      lecture2.save!
      expect(lecture2.position).to eq(1)
    end
  end
end
