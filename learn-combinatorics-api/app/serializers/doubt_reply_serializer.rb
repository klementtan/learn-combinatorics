# frozen_string_literal: true

class DoubtReplySerializer < ActiveModel::Serializer
  attributes :id, :body, :read_by_user, :read_by_admin, :updated_at, :created_at, :user

  def user
    user_obj = object.user
    UserSerializer.new(user_obj).serializable_hash
  end
end
