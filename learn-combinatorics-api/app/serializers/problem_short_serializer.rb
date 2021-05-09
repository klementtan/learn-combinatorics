# frozen_string_literal: true

class ProblemShortSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :position, :difficulty, :privilege_level, :updated_at, :created_at, :hints
  belongs_to :lecture

end
