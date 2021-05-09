# frozen_string_literal: true

class ChapterShortSerializer < ActiveModel::Serializer
  attributes :id, :title, :position, :updated_at, :created_at, :sections
  def sections
    return object.sections
  end

end
