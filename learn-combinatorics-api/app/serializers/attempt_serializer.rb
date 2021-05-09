# frozen_string_literal: true

class AttemptSerializer < ActiveModel::Serializer
  attributes :id, :user_uid, :status, :hints, :submissions, :answer, :doubt_thread, :attempt_time, :user, :problem, :chapter, :lecture
  delegate :status, to: :object

  def chapter
    object.problem.lecture.chapter
  end
  def lecture
    object.problem.lecture
  end

  def user
    UserSerializer.new(object.user).serializable_hash
  end

  def problem
    ProblemSerializer.new(object.problem).serializable_hash
  end

  def user_mask(target)
    object.user
  end
  def doubt_thread
    return DoubtThreadSerializer.new(object.doubt_thread).serializable_hash if object.doubt_thread
  end

  def answer
    if %w[pass skipped].include?(object.status)
      AnswerSerializer.new(object.answer).serializable_hash
    else
      'locked'
    end
  end

  def submissions
    object.submissions.order(created_at: :desc)
  end

  def hints
    payload = {}
    unlocked = []
    locked = []
    last_hint = HintSerializer.new(object.last_hint).serializable_hash if object.last_hint
    unlocked_all_hints = false
    unless object.last_hint.nil?
      last_hint = object.last_hint
      last_hint.higher_items.order(position: :asc).each do |unlocked_hint|
        unlocked.append(HintSerializer.new(unlocked_hint).serializable_hash)
      end
      unlocked.append(HintSerializer.new(last_hint).serializable_hash)

      last_hint.lower_items.order(position: :asc).each do |locked_hint|
        hint_hash = HintSerializer.new(locked_hint).serializable_hash
        hint_hash.delete(:body)
        hint_hash.delete(:hint_video_url)
        hint_hash.delete(:problem)
        locked.append(hint_hash)
      end
      unlocked_all_hints = unlocked.length == object.problem.hints.length
    end

    if object.last_hint.nil? && !object.problem.hints.empty?
      object.problem.hints.each do |locked_hint|
        hint_hash = HintSerializer.new(locked_hint).serializable_hash
        hint_hash.delete(:body)
        hint_hash.delete(:hint_video_url)
        hint_hash.delete(:problem)
        locked.append(hint_hash)
      end
    end

    payload['unlocked'] = unlocked
    payload['locked'] = locked
    payload['unlocked_all'] = unlocked_all_hints
    payload['last_hint'] = last_hint
    payload
  end
end
