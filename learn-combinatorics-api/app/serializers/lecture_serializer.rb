# frozen_string_literal: true

class LectureSerializer < ActiveModel::Serializer
  attributes :id, :title, :position, :updated_at, :created_at
  belongs_to :chapter
  has_many :problems
end
