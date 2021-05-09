# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Problem, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to validate_presence_of(:body) }
  it { is_expected.to belong_to(:lecture) }
  it { is_expected.to have_one(:answer) }

  describe 'privilege level' do
    it 'before create set default privilege level' do
      parent_lecture = create(:lecture)
      problem = described_class.create!(title: 'foo title', body: 'foo body', lecture: parent_lecture)
      expect(problem.privilege_level).to eq(Roles::PUBLIC_USER)
    end

    it 'explicit privilege level override default privilege level' do
      parent_lecture = create(:lecture)
      problem = described_class.create!(title: 'foo title', body: 'foo body', lecture: parent_lecture,
                                        privilege_level: Roles::NUS_USER)
      expect(problem.privilege_level).to eq(Roles::NUS_USER)
    end
  end

  describe 'act as list' do
    it 'auto increment' do
      parent_lecture = create(:lecture)
      problem1 = parent_lecture.problems.create!(title: 'problem 1 title', body: 'problem 1 body')
      problem2 = parent_lecture.problems.create!(title: 'problem 2 title', body: 'problem 2 body')
      expect(problem1.position).to eq(1)
      expect(problem2.position).to eq(2)
    end

    it 'handle different parent scope' do
      parent_lecture1 = create(:lecture)
      parent_lecture2 = create(:lecture)
      problem1 = parent_lecture1.problems.create!(title: 'problem 1 title', body: 'problem 1 body')
      problem2 = parent_lecture2.problems.create!(title: 'problem 2 title', body: 'problem 2 body')
      expect(problem1.position).to eq(1)
      expect(problem2.position).to eq(1)
    end

    it 'handle change in parent scope' do
      parent_lecture1 = create(:lecture)
      parent_lecture2 = create(:lecture)
      parent_lecture1.problems.create!(title: 'problem 1 title', body: 'problem 1 body')
      problem2 = parent_lecture1.problems.create!(title: 'problem 2 title', body: 'problem 2 body')
      expect(problem2.position).to eq(2)
      problem2.lecture = parent_lecture2
      problem2.save!
      expect(problem2.position).to eq(1)
    end
  end

  describe 'next problem' do
    before do
      chapters = []
      (0..2).each do |i|
        chapter = Chapter.create!(title: "Chapter #{i}")
        chapters.append(chapter)
      end

      sections = []
      chapters.each do |chapter|
        (0..2).each do |i|
          section = chapter.sections.create!(title: "#{chapter.title} section #{i}")
          sections.append(section)
        end
      end

      lectures = []
      sections.each do |section|
        (0..2).each do |i|
          lecture = section.lectures.create!(title: "#{section.title} lecture #{i}")
          lectures.append(lecture)
        end
      end

      problems = []
      lectures.each do |lecture|
        (0..2).each do |i|
          problem = lecture.problems.create!(title: "#{lecture.title} problem #{i}", body: 'foo')
          problems.append(problem)
        end
      end
    end

    it 'has next problem' do
      first_problem = Chapter.all.first.sections.first.lectures.first.problems.first
      next_problem = first_problem.next_problem
      expect(next_problem).to eq(first_problem.lower_item)
    end

    it 'has next lecture but not next problem' do
      first_problem = Chapter.all.first.sections.first.lectures.first.problems.last
      next_problem = first_problem.next_problem
      expect(next_problem.lecture).to eq(first_problem.lecture.lower_item)
      expect(next_problem.first?).to eq(true)
    end

    it 'has next section but not next problem and lecture' do
      first_problem = Chapter.all.first.sections.first.lectures.last.problems.last
      next_problem = first_problem.next_problem
      expect(next_problem.lecture.section).to eq(first_problem.lecture.section.lower_item)
      expect(next_problem.lecture.first?).to eq(true)
      expect(next_problem.first?).to eq(true)
    end

    it 'has next chapter but not next problem and lecture section' do
      first_problem = Chapter.all.first.sections.last.lectures.last.problems.last
      next_problem = first_problem.next_problem
      expect(next_problem.lecture.section.chapter).to eq(first_problem.lecture.section.chapter.lower_item)
      expect(next_problem.lecture.section.first?).to eq(true)
      expect(next_problem.lecture.first?).to eq(true)
      expect(next_problem.first?).to eq(true)
    end

    it 'last problem should return itself' do
      first_problem = Chapter.all.last.sections.last.lectures.last.problems.last
      next_problem = first_problem.next_problem
      expect(next_problem).to eq(first_problem)
    end
  end
end
