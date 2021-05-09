# frozen_string_literal: true

class Hint < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :problem
  has_many :attempts, foreign_key: 'last_hint_id', dependent: :nullify, inverse_of: :last_hint

  validates :title, presence: true
  has_one_attached :hint_video
  has_one_attached :hint_body_pdf
  acts_as_list scope: :problem

  def hint_video_url
    url = nil
    url = rails_blob_url(hint_video, Rails.application.config.action_mailer.default_url_options) if hint_video.attached?
    url
  end

  def hint_body_pdf_url
    url = nil
    url = rails_blob_url(hint_body_pdf, Rails.application.config.action_mailer.default_url_options) if hint_body_pdf.attached?
    url
  end

  def <=>(b)
    a_chapter = problem.lecture.chapter
    b_chapter = b.problem.lecture.chapter

    a_lecture = problem.lecture
    b_lecture = b.problem.lecture

    a_problem = problem
    b_problem = b.problem

    if a_chapter.position < b_chapter.position
      return -1
    elsif a_chapter.position > b_chapter.position
      return 1
    end

    if a_lecture.position < b_lecture.position
      return -1
    elsif a_lecture.position > b_lecture.position
      return 1
    end

    if a_problem.position < b_problem.position
      return -1
    elsif a_problem.position > b_problem.position
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
    Hint.all.sort
  end
end
