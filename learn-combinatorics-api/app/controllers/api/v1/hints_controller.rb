# frozen_string_literal: true

class Api::V1::HintsController < Api::V1::BaseController
  def index
    google_authenticate(Roles::ADMIN)
    render json: Hint.ordered_all, each_serializer: HintSerializer, adapter: :json, root: 'hints'
  end

  def create
    google_authenticate(Roles::ADMIN)
    problem = Problem.find(params.require('problem_id'))
    raise InvalidParamsError, 'Invalid problem id' if problem.nil?

    hint = problem.hints.create!(permitted_hint_params)
    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def update_hint_video
    google_authenticate(Roles::ADMIN)
    hint = Hint.find(params.require('hint_id'))
    raise InvalidParamsError, 'Invalid hint id' if hint.nil?

    hint.hint_video.attach(params.require('video'))

    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def update_hint_body_pdf
    google_authenticate(Roles::ADMIN)
    hint = Hint.find(params.require('hint_id'))
    raise InvalidParamsError, 'Invalid hint id' if hint.nil?

    hint.hint_body_pdf.attach(params.require('hint_body_pdf'))

    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def show
    google_authenticate(Roles::PUBLIC_USER)
    hint = Hint.find(params.require(:hint_id))
    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def update
    google_authenticate(Roles::ADMIN)

    hint = Hint.find(params.require('hint_id'))
    hint.update!(permitted_hint_params)
    hint.save!

    if params['problem_id'].present?
      problem = Problem.find(params['problem_id'])
      if problem != hint.problem
        hint.problem = problem
        hint.save!
      end
      hint.reload
    end

    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def delete
    google_authenticate(Roles::ADMIN)

    hint = Hint.find(params.require('hint_id'))
    hint.remove_from_list
    hint.destroy!
    render json: hint, serializer: HintSerializer, adapter: :json
  end

  def change_position
    google_authenticate(Roles::ADMIN)
    hint = Hint.find(params['hint_id'])
    delta = params.require(:delta)
    if delta > 0
      hint.move_higher
    elsif delta < 0
      hint.move_lower
    end
    hint.save
    render json: Hint.all, each_serializer: HintSerializer, adapter: :json, root: 'hints'
  end

  private

  def permitted_hint_params
    params.require(:hint).permit(:title, :body)
  end
end
