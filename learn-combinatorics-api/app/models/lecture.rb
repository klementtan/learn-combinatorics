# frozen_string_literal: true

class Lecture < ApplicationRecord
  belongs_to :chapter
  validates :title, presence: true
  acts_as_list scope: :chapter
  has_many :problems, -> { order(position: :asc) }, dependent: :nullify, inverse_of: :lecture

  def <=>(b)
    a_chapter = chapter
    b_chapter = b.chapter

    if a_chapter.position < b_chapter.position
      return -1
    elsif a_chapter.position > b_chapter.position
      return 1
    end

    if position < b.position
      return -1
    elsif position > b.position
      return 1
    end
  end

  def self.ordered_all
    lectures = Lecture.all.sort
    lectures
  end
end
