# frozen_string_literal: true

class DoubtReplyValidator < ActiveModel::Validator
  def validate(record)
    unless record.read_by_admin || record.read_by_user
      record.errors[:base] << 'Both read_by_admin and read_by_user cannot be false'
    end
  end
end
class DoubtReply < ApplicationRecord
  belongs_to :doubt_thread
  belongs_to :user, optional: true
  validates :body, presence: true
end
