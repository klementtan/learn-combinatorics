# frozen_string_literal: true

class Api::V1::DoubtsController < Api::V1::BaseController
  def create_doubt_thread
    google_authenticate(Roles::PUBLIC_USER)
    doubt_thread_payload = permitted_doubt_thread_params
    attempt = authorized_attempt(params["attempt_id"])

    raise InvalidRequestError, 'Doubt thread already exists' unless attempt.doubt_thread.nil?

    doubt_thread = attempt.create_doubt_thread!(doubt_thread_payload)
    render json: doubt_thread, serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_thread'
  end

  def update_doubt_thread
    google_authenticate(Roles::PUBLIC_USER)
    doubt_thread = authorized_doubt_thread

    doubt_thread.update!(permitted_doubt_thread_params)
    doubt_thread.save!
    doubt_thread.reload
    render json: doubt_thread, serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_thread'
  end

  def delete_doubt_thread
    google_authenticate(Roles::PUBLIC_USER)
    doubt_thread = authorized_doubt_thread

    doubt_thread.destroy!
    render json: doubt_thread, serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_thread'
  end

  def admin_get_doubt_threads
    google_authenticate(Roles::ADMIN)
    doubts = DoubtThread.all
    unread = []
    pending = []
    resolved = []
    doubts.each do |doubt|
      if doubt.unread?
        unread.append(doubt)
      elsif doubt.pending?
        pending.append(doubt)
      elsif doubt.resolved?
        resolved.append(doubt)
      end
    end
    render json: unread + pending + resolved, each_serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_threads'
  end

  def show_doubt_thread
    google_authenticate(Roles::PUBLIC_USER)
    doubt_thread = DoubtThread.find(params['doubt_thread_id'])

    is_admin = @user_json['role']['privilege_level'] == Roles::ADMIN_PRIVILEGE_LEVEL
    if !is_admin && (@user_json['uid'] != doubt_thread.user_uid)
      raise AuthorizationError, "Doubt thread #{doubt_thread.id} does not belong to #{@user_json['uid']}"
    end

    # Side effect of changing all replies to read by admin

    doubt_thread.doubt_replies.each do |doubt_reply|
      doubt_reply.read_by_admin = true if is_admin && !doubt_reply.read_by_admin
      doubt_reply.read_by_user = true if !is_admin && !doubt_reply.read_by_user
    end
    render json: doubt_thread, each_serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_thread'
  end

  def create_doubt_reply
    google_authenticate(Roles::PUBLIC_USER)
    doubt_thread = DoubtThread.find(params['doubt_thread_id'])
    is_admin = @user.has_role? Roles::ADMIN
    if !is_admin && (@user != doubt_thread.attempt.user)
      raise AuthorizationError, "Doubt thread #{doubt_thread.id} does not belong to #{@user}"
    end
    payload = params.require("doubt_reply").permit("body")


    doubt_reply = doubt_thread.doubt_replies.create!(payload)
    doubt_reply.user = @user
    doubt_reply.save


    doubt_thread.save
    doubt_thread.reload
    render json: doubt_thread, serializer: DoubtThreadSerializer, adapter: :json, root: 'doubt_thread'
  end


  def permitted_doubt_reply_params
    params.require(:doubt_reply).permit(:body)
  end

  def permitted_doubt_thread_params
    params.require(:doubt_thread).permit(:title, :body, :status)
  end

  def authorized_attempt(attempt_id)
    attempt = Attempt.find(attempt_id)
    if attempt.user != @user
      raise AuthorizationError, "Attempt #{attempt.id} does not belong to user #{@user}"
    end

    attempt
  end
  def authorized_doubt_thread
    doubt_thread = DoubtThread.find(params.require("doubt_thread_id"))
    if doubt_thread.attempt.user != @user && !@user.has_role?(Roles::ADMIN)
      raise AuthorizationError, "Doubt #{doubt_thread.id} does not belong to user #{@user}"
    end
    doubt_thread
  end
end
