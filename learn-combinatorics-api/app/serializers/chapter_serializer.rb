# frozen_string_literal: true

class ChapterSerializer < ActiveModel::Serializer
  attributes :id, :title, :position, :updated_at, :created_at
  has_many :lectures
end
