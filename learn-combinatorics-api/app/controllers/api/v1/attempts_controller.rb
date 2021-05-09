# frozen_string_literal: true

class Api::V1::AttemptsController < Api::V1::BaseController
  def get_all_attempts
    google_authenticate(Roles::ADMIN)
    render json: Attempt.all, each_serializer: AttemptSerializer, adapter: :json, root: 'attempts'
  end

  def get_attempt
    google_authenticate(Roles::PUBLIC_USER)
    attempt = Attempt.find(params['attempt_id'])
    unless @user.id == attempt.user.id || @user.has_role?(Roles::ADMIN)
      raise AuthorizationError "User does not have access"
    end
    render json: attempt, serializer: AttemptSerializer, adapter: :json
  end

  def get_or_create
    google_authenticate(Roles::PUBLIC_USER)
    problem = Problem.find(params.require('problem_id'))
    has_access = false
    @user.roles.each do |role|
      has_access = true if Roles::PRIVILEGE_LEVEL[role.name.to_sym] >=  Roles::PRIVILEGE_LEVEL[problem.privilege_level.to_sym]
    end
    unless has_access
      raise AuthorizationError, "User not authorized to access problem #{problem.id}: #{problem.title}"
    end
    attempt =  @user.attempts.find_by(problem: problem)
    attempt = problem.attempts.create!(user: @user) if attempt.nil?

    render json: attempt, serializer: AttemptSerializer, adapter: :json
  end

  def get_all_user_attempt
    google_authenticate(Roles::PUBLIC_USER)
    attempts = @user.attempts
    render json: attempts, each_serializer: AttemptSerializer, adapter: :json, root: 'attempts'
  end

  # Level one for attempt hint is consider the highest hint in act as list
  def update_time
    google_authenticate(Roles::PUBLIC_USER)
    attempt = authorized_attempt
    additional_time = params['attempt_time'].to_i
    raise InvalidParamsError, "Invalid Time #{additional_time}" if additional_time< 0
    attempt.attempt_time = 0 if attempt.attempt_time.nil?
    new_time = attempt.attempt_time + additional_time
    attempt.update({attempt_time: new_time})
    attempt.save!
    render json: attempt, serializer: AttemptSerializer, adapter: :json

  end
  def unlock_hint
    google_authenticate(Roles::PUBLIC_USER)
    attempt = authorized_attempt
    problem_hints = attempt.problem.hints
    # raise InvalidRequestError, 'No hints to unlock' if problem_hints.empty?
    hint = attempt.last_hint
    unless problem_hints.empty?
      if hint.nil?
        hint = problem_hints.first
        raise LogicalError, 'No first hint' unless hint.first?
      else
        hint = hint.lower_item unless hint.last?
      end

      attempt.last_hint = hint
      attempt.save!
      attempt.reload
    end
    render json: attempt, serializer: AttemptSerializer, adapter: :json
  end

  def unlock_answer
    google_authenticate(Roles::PUBLIC_USER)
    attempt = authorized_attempt
    raise InvalidRequestError, 'Answer already unlocked' unless attempt.answer.nil?

    problem_hints = attempt.problem.hints
    hint = attempt.last_hint
    raise InvalidRequestError, 'Unlock all the hints first' if hint.nil? && !problem_hints.empty?
    raise InvalidRequestError, 'Unlock all the hints first' if !problem_hints.empty? && !hint.last?

    attempt.answer = attempt.problem.answer
    attempt.save
    attempt.reload
    render json: attempt, serializer: AttemptSerializer, adapter: :json
  end

  def create_submission
    google_authenticate(Roles::PUBLIC_USER)
    attempt = authorized_attempt

    fraction = helpers.simplify_fraction(params.require('submission')['submission_value_numerator'],
                                         params.require('submission')['submission_value_denominator'])
    submission = attempt.submissions.create!(submission_value_numerator: fraction.numerator,
                                             submission_value_denominator: fraction.denominator)
    if submission.pass?
      attempt.answer = attempt.problem.answer
      attempt.save!
      attempt.reload
      attempt.last_hint = attempt.problem.hints.order(position: :asc).last
      raise LogicalError, 'Last Hint should be last' unless attempt.last_hint.last?

      attempt.save!
      attempt.reload
    end
    render json: submission, serializer: SubmissionSerializer, adapter: :json
  end

  private

  def authorized_attempt
    attempt = Attempt.find(params.require('attempt_id'))
    if attempt.user != @user
      raise AuthorizationError, "Attempt #{attempt.id} does not belong to user #{user_uid}"
    end

    attempt
  end
end
