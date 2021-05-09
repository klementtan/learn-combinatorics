# frozen_string_literal: true

class DoubtThreadSerializer < ActiveModel::Serializer
  attributes :id, :user_uid, :title, :body, :status, :updated_at, :created_at, :doubt_replies, :attempt

  def attempt
    return object.attempt
  end

  def doubt_replies
    payload = []

    object.doubt_replies.order(created_at: :desc).each do |reply|
      payload.append(DoubtReplySerializer.new(reply).serializable_hash)
    end
    payload
  end
end
