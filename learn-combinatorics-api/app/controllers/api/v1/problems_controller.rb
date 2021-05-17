# frozen_string_literal: true

class Api::V1::ProblemsController < Api::V1::BaseController
  def index
    google_authenticate(Roles::PUBLIC_USER)
    user_roles = Set[]
    @user.roles.each do |role|
      user_roles.add(role.name)
    end

    all_problems = {
      problems: []
    }
    user_attempts = @user.attempts

    problem_id_attempt_map = {}

    user_attempts.each do |attempt|
      problem_id_attempt_map[attempt.problem.id] = attempt
    end

    Problem.all.each do |problem|
      attempt = nil
      problem_hash = ProblemSerializer.new(problem).serializable_hash
      problem.attempts.each do |curr_attempt|
        if curr_attempt.user.id == @user.id
          attempt = curr_attempt
        end
      end
      unless attempt.nil?
        # only show user's attempt
        problem_hash['attempt'] = AttemptSerializer.new(attempt) .serializable_hash
      end

      problem_hash['has_access'] = false
      user_roles.each do |role|
        problem_hash['has_access'] = true if Roles::PRIVILEGE_LEVEL[role.to_sym] >=  Roles::PRIVILEGE_LEVEL[problem.privilege_level.to_sym]
      end
      user_roles.include?(problem.privilege_level)

      unless problem_hash['has_access']
        problem_hash.delete("title")
        problem_hash.delete("body")
      end

      if attempt.nil?
        problem_hash['status'] = ""
      else
        problem_hash['status'] = attempt.status
      end

      all_problems[:problems].append(problem_hash)
    end
    render json: all_problems
  end

  def create
    google_authenticate(Roles::ADMIN)
    lecture = Lecture.find(params.require('lecture_id'))
    raise InvalidParamsError, 'Invalid lecture id' if lecture.nil?

    problem = lecture.problems.create!(permitted_problem_params)
    render json: problem, serializer: ProblemSerializer, adapter: :json
  end

  def show
    google_authenticate(Roles::PUBLIC_USER)
    authorize_resource
    problem_id = params['problem_id']
    raise InvalidParamsError, 'problem_id missing' if problem_id.nil?

    problem = Problem.find(problem_id)
    render json: problem, serializer: ProblemSerializer, adapter: :json
  end

  def update
    google_authenticate(Roles::ADMIN)
    problem_id = params['problem_id']
    raise InvalidParamsError, 'problem_id missing' if problem_id.nil?

    problem = Problem.find(problem_id)
    lecture = Lecture.find(params.require('lecture_id'))
    problem.update!(permitted_problem_params)
    problem.save!
    if lecture != problem.lecture
      problem.lecture = lecture
      problem.save!
    end
    problem.reload

    render json: problem, serializer: ProblemSerializer, adapter: :json
  end

  def update_problem_pdf
    google_authenticate(Roles::ADMIN)
    problem = Problem.find(params.require('problem_id'))
    raise InvalidParamsError, 'Invalid problem id' if problem.nil?

    problem.problem_pdf.attach(params.require('pdf'))
    render json: problem, serializer: ProblemSerializer, adapter: :json
  end

  def delete
    google_authenticate(Roles::ADMIN)
    problem_id = params['problem_id']
    raise InvalidParamsError, 'problem_id missing' if problem_id.nil?
    problem = Problem.find(problem_id)
    problem.remove_from_list
    problem.destroy!
    render json: problem, serializer: ProblemSerializer, adapter: :json
  end

  private

  def permitted_problem_params
    params.require(:problem).permit(:title, :body, :privilege_level, :difficulty)
  end

  def authorize_resource
    problem = Problem.find(params['problem_id'])
    has_access = false
    @user.roles.each do |role|
      has_access = true if Roles::PRIVILEGE_LEVEL[role.name.to_sym] >=  Roles::PRIVILEGE_LEVEL[problem.privilege_level.to_sym]
    end
    unless has_access
      raise AuthorizationError, "User not authorized to access problem #{problem.id}: #{problem.title}"
    end
    # rubocop:enable Style/GuardClause
  end
end
