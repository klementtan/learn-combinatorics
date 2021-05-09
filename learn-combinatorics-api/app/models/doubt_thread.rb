# frozen_string_literal: true

class DoubtThread < ApplicationRecord
  belongs_to :attempt
  belongs_to :user, optional: true
  has_many :doubt_replies
  validates :title, :body, presence: true
  enum status: { unread: 0, pending: 1, resolved: 2 }
end
