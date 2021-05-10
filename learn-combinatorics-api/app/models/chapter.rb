# frozen_string_literal: true

class Chapter < ApplicationRecord
  validates :title, presence: true
  default_scope { order(position: :asc) }
  has_many :lectures, -> { order(position: :asc) }, dependent: :nullify, inverse_of: :chapter
  acts_as_list

end
