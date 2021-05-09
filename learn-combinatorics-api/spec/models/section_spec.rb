# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Section, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to belong_to(:chapter) }
  it { is_expected.to have_many(:lectures) }

  describe 'act as list' do
    it 'auto increment' do
      parent_chapter = create(:chapter)
      section1 = parent_chapter.sections.create!(title: 'section1 title')
      section2 = parent_chapter.sections.create!(title: 'section2 title')
      expect(section1.position).to eq(1)
      expect(section2.position).to eq(2)
    end

    it 'handle different parent scope' do
      parent_chapter1 = create(:chapter)
      parent_chapter2 = create(:chapter)
      section1 = parent_chapter1.sections.create!(title: 'section1 title')
      section2 = parent_chapter2.sections.create!(title: 'section2 title')
      expect(section1.position).to eq(1)
      expect(section2.position).to eq(1)
    end

    it 'handle change in parent scope' do
      parent_chapter1 = create(:chapter)
      parent_chapter2 = create(:chapter)
      parent_chapter1.sections.create!(title: 'section1 title')
      section2 = parent_chapter1.sections.create!(title: 'section2 title')
      expect(section2.position).to eq(2)
      section2.chapter = parent_chapter2
      section2.save!
      expect(section2.position).to eq(1)
    end
  end
end
