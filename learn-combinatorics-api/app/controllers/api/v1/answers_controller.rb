# frozen_string_literal: true

class Api::V1::AnswersController < Api::V1::BaseController
  def index
    google_authenticate(Roles::ADMIN)
    render json: Answer.all, each_serializer: AnswerSerializer, adapter: :json, root: 'answers'
  end

  def create
    google_authenticate(Roles::ADMIN)
    problem = Problem.find(params.require('problem_id'))
    raise InvalidParamsError, 'Invalid problem id' if problem.nil?
    raise InvalidRequestError, 'Answer already exist' unless problem.answer.nil?

    answer = problem.create_answer!(permitted_answer_params)

    render json: answer, serializer: AnswerSerializer, adapter: :json
  end

  def update_explanation_video
    google_authenticate(Roles::ADMIN)
    answer = Answer.find(params.require('answer_id'))
    raise InvalidParamsError, 'Invalid answer id' if answer.nil?

    answer.explanation_video.attach(params.require('video'))

    render json: answer, serializer: AnswerSerializer, adapter: :json
  end


  def update_explanation_body_pdf
    google_authenticate(Roles::ADMIN)
    answer = Answer.find(params.require('answer_id'))
    raise InvalidParamsError, 'Invalid answer id' if answer.nil?

    answer.explanation_body_pdf.attach(params.require('explanation_body_pdf'))

    render json: answer, serializer: AnswerSerializer, adapter: :json
  end

  def show
    google_authenticate(Roles::PUBLIC_USER)

    answer = Answer.find(params.require('answer_id'))
    render json: answer, serializer: AnswerSerializer, adapter: :json
  end

  def update
    google_authenticate(Roles::ADMIN)
    answer_id = params['answer_id']
    raise InvalidParamsError, 'answer_id missing' if answer_id.nil?

    answer = Answer.find(answer_id)
    answer.update!(permitted_answer_params)
    answer.save!

    if params['problem_id'].present?
      problem = Problem.find(params['problem_id'])

      if problem != answer.problem
        answer.problem = problem
        answer.save!
      end
      answer.reload
    end

    render json: answer, serializer: AnswerSerializer, adapter: :json
  end

  def delete
    google_authenticate(Roles::ADMIN)

    answer = Answer.find(params.require('answer_id'))
    answer.destroy!
    render json: answer, serializer: AnswerSerializer, adapter: :json
  end

  private

  def permitted_answer_params
    if params['answer']['answer_value_numerator'] || params['answer']['answer_value_denominator']
      fraction = helpers.simplify_fraction(params['answer']['answer_value_numerator'],
                                           params['answer']['answer_value_denominator'])
      params['answer']['answer_value_numerator'] = fraction.numerator
      params['answer']['answer_value_denominator'] = fraction.denominator
    end
    params.require(:answer).permit(:explanation_body, :answer_value_numerator, :answer_value_denominator)
  end
end
