# frozen_string_literal: true

class Attempt < ApplicationRecord
  belongs_to :problem
  belongs_to :last_hint, class_name: 'Hint', optional: true
  belongs_to :answer, optional: true
  belongs_to :user, optional: true
  has_many :submissions, dependent: :destroy, inverse_of: :attempt
  has_one :doubt_thread, dependent: :destroy, inverse_of: :attempt

  def status
    pass = false
    submissions.each do |submission|
      if submission.status == 'pass'
        pass = true
        break
      end
    end
    if pass
      'pass'
    elsif answer.nil?
      if submissions.empty?
        'no_submissions'
      else
        'in_progress'
      end
    else
      'skipped'
    end
  end
end
