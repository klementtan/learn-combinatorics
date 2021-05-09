# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Answers API', type: :request do
  describe 'GET /answers' do
    it 'return all numerator' do
      create_list(:answer, 10)
      stub_firebase_verify_success
      get '/api/v1/answers', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['answers']).not_to be_empty
      expect(json['answers'].size).to eq(10)
    end
  end

  describe 'POST /answers' do
    it 'return create answer with simple fraction' do
      stub_firebase_verify_success
      problem = create(:problem)
      payload = {
        problem_id: problem.id,
        answer: {
          "explanation_body": 'explanation body',
          "answer_value_numerator": 7,
          "answer_value_denominator": 3
        }
      }
      post '/api/v1/answers', headers: { 'Authorization' => 'Bearer MoCkToken' },
                              params: payload
      expect(json['answer']['explanation_body']).to eq('explanation body')
      expect(json['answer']['answer_value_numerator']).to eq(7)
      expect(json['answer']['answer_value_denominator']).to eq(3)
    end

    it 'return create answer with not simplified fraction' do
      stub_firebase_verify_success
      problem = create(:problem)
      payload = {
        problem_id: problem.id,
        answer: {
          "explanation_body": 'explanation body',
          "answer_value_numerator": 7,
          "answer_value_denominator": 14
        }
      }
      post '/api/v1/answers', headers: { 'Authorization' => 'Bearer MoCkToken' },
                              params: payload
      expect(json['answer']['explanation_body']).to eq('explanation body')
      expect(json['answer']['answer_value_numerator']).to eq(1)
      expect(json['answer']['answer_value_denominator']).to eq(2)
    end
  end

  describe 'PUT /answers/:answer_id' do
    it 'return update answer simple fraction' do
      stub_firebase_verify_success
      problem = create(:problem)
      answer = create(:answer)
      payload = {
        problem_id: problem.id,
        answer: {
          "explanation_body": 'explanation body',
          "answer_value_numerator": 7,
          "answer_value_denominator": 8
        }
      }
      put "/api/v1/answers/#{answer.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                          params: payload
      expect(json['answer']['explanation_body']).to eq('explanation body')
      expect(json['answer']['answer_value_numerator']).to eq(7)
      expect(json['answer']['problem']['id']).to eq(problem.id)
      expect(json['answer']['answer_value_denominator']).to eq(8)
    end
  end

  describe 'GET /answers/:answer_id' do
    it 'get problem' do
      stub_firebase_verify_success
      answer = create(:answer)
      get "/api/v1/answers/#{answer.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['answer']['explanation_body']).to eq(answer.explanation_body)
      expect(json['answer']['answer_value_numerator']).to eq(answer.answer_value_numerator)
      expect(json['answer']['answer_value_denominator']).to eq(answer.answer_value_denominator)
    end
  end

  describe 'DELETE /answers/:answer_id' do
    it 'delete answer' do
      stub_firebase_verify_success
      answer = create(:answer)
      delete "/api/v1/answers/#{answer.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['answer']['explanation_body']).to eq(answer.explanation_body)
      expect(json['answer']['answer_value_numerator']).to eq(answer.answer_value_numerator)
      expect(json['answer']['answer_value_denominator']).to eq(answer.answer_value_denominator)
      expect { Answer.find(answer.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                       "Couldn't find Answer with 'id'=#{answer.id}")
    end
  end

  # TODO: find a way to test active storage
end
