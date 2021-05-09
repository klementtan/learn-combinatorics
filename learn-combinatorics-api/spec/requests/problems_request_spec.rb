# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Problems API', type: :request do
  describe 'GET /problems' do
    it 'return all problems' do
      create_list(:problem, 10)
      stub_firebase_verify_success
      get '/api/v1/problems', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['problems']).not_to be_empty
      expect(json['problems'].size).to eq(10)
    end

    it 'only return problems that have access to' do
      lecture = create(:lecture)
      (0..5).each do |i|
        lecture.problems.create!(title: "public lecture #{i}", body: 'public lecture body', privilege_level: 0)
      end
      (0..7).each do |i|
        lecture.problems.create!(title: "private lecture #{i}", body: 'private lecture body', privilege_level: 1)
      end
      stub_firebase_verify_success_custom_role(Roles::PUBLIC_USER_PRIVILEGE_LEVEL)
      get '/api/v1/problems', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['problems']).not_to be_empty
      expect(json['problems'].size).to eq(14)
      json['problems'].each do |problem_json|
        title = problem_json['title']
        if title.include? 'public'
          expect(problem_json['has_access']).to eq(true)
        else
          expect(problem_json['has_access']).to eq(false)
          expect(problem_json['body']).to be_nil
        end
      end
    end
  end

  describe 'POST /problems' do
    it 'return create problems without privilege level' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      payload = {
        lecture_id: lecture.id,
        problem: {
          title: 'problem title',
          body: 'problem body'
        }
      }
      post '/api/v1/problems', headers: { 'Authorization' => 'Bearer MoCkToken' },
                               params: payload
      expect(json['problem']['title']).to eq('problem title')
      expect(json['problem']['position']).to eq(1)
      expect(json['problem']['body']).to eq('problem body')
      expect(json['problem']['privilege_level']).to eq(Roles::PUBLIC_USER)
    end

    it 'return create problems with privilege level' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      payload = {
        lecture_id: lecture.id,
        problem: {
          title: 'problem title',
          body: 'problem body',
          privilege_level: Roles::ADMIN
        }
      }
      post '/api/v1/problems', headers: { 'Authorization' => 'Bearer MoCkToken' },
                               params: payload
      expect(json['problem']['title']).to eq('problem title')
      expect(json['problem']['position']).to eq(1)
      expect(json['problem']['body']).to eq('problem body')
      expect(json['problem']['privilege_level']).to eq(Roles::ADMIN)
    end
  end

  describe 'PUT /problems/:problem_id' do
    it 'return update problem' do
      stub_firebase_verify_success
      problem = create(:problem)
      lecture = create(:lecture)
      payload = {
        lecture_id: lecture.id,
        problem: {
          title: 'problem title',
          body: 'problem body',
          privilege_level: Roles::ADMIN
        }
      }
      put "/api/v1/problems/#{problem.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                            params: payload
      expect(json['problem']['title']).to eq('problem title')
      expect(json['problem']['position']).to eq(1)
      expect(json['problem']['body']).to eq('problem body')
      expect(json['problem']['privilege_level']).to eq(Roles::ADMIN)
    end
  end

  describe 'GET /problems/:problem_id' do
    it 'get problem' do
      stub_firebase_verify_success
      problem = create(:problem)
      get "/api/v1/problems/#{problem.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['problem']['title']).to eq(problem.title)
      expect(json['problem']['body']).to eq(problem.body)
      expect(json['problem']['id']).to eq(problem.id)
    end

    it 'get problem invalid access' do
      stub_firebase_verify_success_custom_role(Roles::PUBLIC_USER_PRIVILEGE_LEVEL)
      problem = create(:problem)
      problem.privilege_level = Roles::NUS_USER
      problem.save!
      get "/api/v1/problems/#{problem.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['error']).to eq("User not authorized to access problem #{problem.id}: #{problem.title}")
    end
  end

  describe 'DELETE /problems/:problem_id' do
    it 'delete problem' do
      stub_firebase_verify_success
      problem = create(:problem)
      delete "/api/v1/problems/#{problem.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['problem']['title']).to eq(problem.title)
      expect(json['problem']['body']).to eq(problem.body)
      expect(json['problem']['id']).to eq(problem.id)
      expect { Problem.find(problem.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                         "Couldn't find Problem with 'id'=#{problem.id}")
    end
  end

  describe 'POST /problems/positions' do
    it 'update positions for all problems' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      (0..9).each do |i|
        lecture.problems.create!(title: "problem #{i}", body: 'body')
      end
      lecture.reload
      all_problems = lecture.problems
      payload = {
        lecture_id: lecture.id,
        problems: []
      }
      updated_id_position_map = {}
      all_problems.each do |problem|
        payload[:problems].append({
                                    problem_id: problem.id,
                                    problem_position: all_problems.length - problem.position + 1
                                  })
        updated_id_position_map[problem.id] = all_problems.length - problem.position + 1
      end
      post '/api/v1/problems/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      problems_response = json['problems']
      problems_response.each do |problem_response|
        problem_id = problem_response['id']
        expect(problem_response['position']).to eq(updated_id_position_map[problem_id])
        expect(problem_response['position']).to eq(Problem.find(problem_id).position)
      end
    end

    it 'missing problem sad path' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      (0..1).each do |i|
        lecture.problems.create!(title: "title #{i}", body: "body #{i}")
      end
      payload = {
        lecture_id: lecture.id,
        problems: [{
          problem_id: 1,
          problem_position: 1
        }]
      }
      post '/api/v1/problems/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Enter all problems to set positions for lecture #{lecture.id}")
    end

    it 'duplicate lecture id sad path' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      problem1 = lecture.problems.create!(title: 'problem 1', body: 'problem 1 body')
      lecture.problems.create!(title: 'problem 2', body: 'problem 2 body')
      payload = {
        lecture_id: lecture.id,
        problems: [{
          problem_id: problem1.id,
          problem_position: 1
        },
                   {
                     problem_id: problem1.id,
                     problem_position: 2
                   }]
      }
      post '/api/v1/problems/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Duplicate problem_id: #{problem1.id}")
    end

    it 'duplicate lecture position sad path' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      problem1 = lecture.problems.create!(title: 'problem 1', body: 'problem 1 body')
      problem2 = lecture.problems.create!(title: 'problem 2', body: 'problem 2 body')
      payload = {
        lecture_id: lecture.id,
        problems: [{
          problem_id: problem1.id,
          problem_position: 1
        },
                   {
                     problem_id: problem2.id,
                     problem_position: 1
                   }]
      }
      post '/api/v1/problems/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate problem_position: 1')
    end

    it 'invalid lecture relation id sad path' do
      stub_firebase_verify_success
      problem = create(:problem)
      random_problem = create(:problem)
      payload = {
        lecture_id: random_problem.lecture.id,
        problems: [{
          problem_id: problem.id,
          problem_position: 1
        }]
      }
      post '/api/v1/problems/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Problem #{problem.id} does not belong to #{random_problem.lecture.id}")
    end
  end
end
