# frozen_string_literal: true

class ProblemSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :position, :difficulty, :privilege_level, :updated_at, :created_at, :problem_pdf_url, :chapter
  has_one :answer
  has_many :hints
  delegate :problem_pdf_url, to: :object
  belongs_to :lecture

  def chapter
    object.lecture.chapter
  end

end
