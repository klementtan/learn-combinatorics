# frozen_string_literal: true

class Problem < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :lecture
  has_one :answer, dependent: :destroy, inverse_of: :problem
  has_many :hints, -> { order(position: :asc) }, dependent: :destroy, inverse_of: :problem
  has_many :attempts, dependent: :destroy, inverse_of: :problem
  validates :title, :body, :difficulty, presence: true
  has_one_attached :problem_pdf
  enum privilege_level: { PUBLIC_USER: 0, NUS_USER: 1, MOD_USER: 2, ADMIN: 3 }
  acts_as_list scope: :lecture

  before_create do
    self.privilege_level = :PUBLIC_USER if privilege_level.nil?
  end

  def problem_pdf_url
    url = nil
    if problem_pdf.attached?
      url = rails_blob_url(problem_pdf, Rails.application.config.action_mailer.default_url_options)
    end
    url
  end

  def user_attempt(user_uid)
    attempts = Attempt.where(user_uid: user_uid, problem: self)
    attempts.first
  end

  def next_problem
    current_chapter = lecture.section.chapter
    current_section = lecture.section
    current_lecture = lecture
    return self.lower_item unless last?
    unless current_lecture.last?
      next_lecture = current_lecture.lower_item
      return next_lecture.problems.first
    end

    unless current_section.last?
      next_section = current_section.lower_item
      next_lecture = next_section.lectures.first
      next_problem = next_lecture.problems.first
      return next_problem
    end

    unless current_chapter.last?
      next_chapter = current_chapter.lower_item
      next_section = next_chapter.sections.first
      next_lecture = next_section.lectures.first
      next_problem = next_lecture.problems.first
      return next_problem
    end
    self
  end

  def <=>(b)
    a_chapter = lecture.section.chapter
    b_chapter = b.lecture.section.chapter

    a_section = lecture.section
    b_section = b.lecture.section

    a_lecture = lecture
    b_lecture = b.lecture

    if a_chapter.position < b_chapter.position
      return -1
    elsif a_chapter.position > b_chapter.position
      return 1
    end

    if a_section.position < b_section.position
      return -1
    elsif a_section.position > b_section.position
      return 1
    end

    if a_lecture.position < b_lecture.position
      return -1
    elsif a_lecture.position > b_lecture.position
      return 1
    end

    if position < b.position
      return -1
    elsif position > b.position
      return 1
    end

    0
  end

  def self.ordered_all
    Problem.all.sort
  end
end
