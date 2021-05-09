# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Hints API', type: :request do
  describe 'GET /hints' do
    it 'return all hints' do
      create_list(:hint, 10)
      stub_firebase_verify_success
      get '/api/v1/hints', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['hints']).not_to be_empty
      expect(json['hints'].size).to eq(10)
    end
  end

  describe 'POST /hints' do
    it 'return create problems without privilege level' do
      stub_firebase_verify_success
      problem = create(:problem)
      payload = {
        problem_id: problem.id,
        hint: {
          title: 'problem title',
          body: 'problem body'
        }
      }
      post '/api/v1/hints', headers: { 'Authorization' => 'Bearer MoCkToken' },
                            params: payload
      expect(json['hint']['title']).to eq('problem title')
      expect(json['hint']['position']).to eq(1)
      expect(json['hint']['body']).to eq('problem body')
    end
  end

  describe 'PUT /hints/:hint_id' do
    it 'return update hint' do
      stub_firebase_verify_success
      hint = create(:hint)
      problem = create(:problem)
      payload = {
        problem_id: problem.id,
        hint: {
          title: 'hint title',
          body: 'hint body'
        }
      }
      put "/api/v1/hints/#{hint.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                      params: payload
      expect(json['hint']['title']).to eq('hint title')
      expect(json['hint']['body']).to eq('hint body')
      expect(json['hint']['problem']['id']).to eq(problem.id)
    end
  end

  describe 'GET /hint/:hint_id' do
    it 'get hint' do
      stub_firebase_verify_success
      hint = create(:hint)
      get "/api/v1/hints/#{hint.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['hint']['title']).to eq(hint.title)
      expect(json['hint']['body']).to eq(hint.body)
      expect(json['hint']['id']).to eq(hint.id)
    end
  end

  describe 'DELETE /hint/:hint_id' do
    it 'delete hint' do
      stub_firebase_verify_success
      hint = create(:hint)
      delete "/api/v1/hints/#{hint.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['hint']['title']).to eq(hint.title)
      expect(json['hint']['body']).to eq(hint.body)
      expect(json['hint']['id']).to eq(hint.id)
      expect { Hint.find(hint.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                   "Couldn't find Hint with 'id'=#{hint.id}")
    end
  end

  describe 'POST /hints/positions' do
    it 'update positions for all hints' do
      stub_firebase_verify_success
      problem = create(:problem)
      (0..9).each do |i|
        problem.hints.create!(title: "problem #{i}", body: 'body')
      end
      problem.reload
      all_hints = problem.hints
      payload = {
        problem_id: problem.id,
        hints: []
      }
      updated_id_position_map = {}
      all_hints.each do |hint|
        payload[:hints].append({
                                 hint_id: hint.id,
                                 hint_position: all_hints.length - hint.position + 1
                               })
        updated_id_position_map[hint.id] = all_hints.length - hint.position + 1
      end
      post '/api/v1/hints/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      hints_response = json['hints']
      hints_response.each do |hint_response|
        hint_id = hint_response['id']
        expect(hint_response['position']).to eq(updated_id_position_map[hint_id])
        expect(hint_response['position']).to eq(Hint.find(hint_id).position)
      end
    end

    it 'missing problem sad path' do
      stub_firebase_verify_success
      problem = create(:problem)
      (0..9).each do |i|
        problem.hints.create!(title: "problem #{i}", body: 'body')
      end
      payload = {
        problem_id: problem.id,
        hints: [{
          hint_id: 1,
          hint_position: 1
        }]
      }
      post '/api/v1/hints/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Enter all hints to set positions for problem #{problem.id}")
    end

    it 'duplicate lecture id sad path' do
      stub_firebase_verify_success
      problem = create(:problem)
      hint1 = problem.hints.create!(title: 'problem 1', body: 'problem 1 body')
      problem.hints.create!(title: 'problem 2', body: 'problem 2 body')
      payload = {
        problem_id: problem.id,
        hints: [{
          hint_id: hint1.id,
          hint_position: 1
        },
                {
                  hint_id: hint1.id,
                  hint_position: 2
                }]
      }
      post '/api/v1/hints/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Duplicate hint_id: #{hint1.id}")
    end

    it 'duplicate lecture position sad path' do
      stub_firebase_verify_success
      problem = create(:problem)
      hint1 = problem.hints.create!(title: 'problem 1', body: 'problem 1 body')
      hint2 = problem.hints.create!(title: 'problem 2', body: 'problem 2 body')
      payload = {
        problem_id: problem.id,
        hints: [{
          hint_id: hint1.id,
          hint_position: 1
        },
                {
                  hint_id: hint2.id,
                  hint_position: 1
                }]
      }
      post '/api/v1/hints/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate hint_position: 1')
    end

    it 'invalid lecture relation id sad path' do
      stub_firebase_verify_success
      hint = create(:hint)
      random_hint = create(:hint)
      payload = {
        problem_id: random_hint.problem.id,
        hints: [{
          hint_id: hint.id,
          problem_position: 1
        }]
      }
      post '/api/v1/hints/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Hint #{hint.id} does not belong to #{random_hint.problem.id}")
    end
  end
end
