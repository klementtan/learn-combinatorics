# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Attempts API', type: :request do
  describe 'GET /problem/:problem_id/attempts' do
    it 'create attempt if it does not exists' do
      stub_firebase_verify_success
      problem = create(:problem_with_answer_and_hints, hints_count: 6)
      get "/api/v1/problems/#{problem.id}/attempts", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['problem']['id']).to eq(problem.id)
    end

    it 'return attempt if it does exists' do
      attempt = create(:attempt)
      stub_firebase_verify_success_user({ "user_uid": attempt.user_uid })
      get "/api/v1/problems/#{attempt.problem.id}/attempts", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['id']).to eq(attempt.id)
    end

    describe 'test serializer' do
      it 'no hint unlocked' do
        problem = create(:problem_with_answer_and_hints)
        user_uid = 'mock-uid'
        problem.attempts.create!(user_uid: user_uid)
        stub_firebase_verify_success_user({ "user_uid": user_uid })
        get "/api/v1/problems/#{problem.id}/attempts", headers: { 'Authorization' => 'Bearer MoCkToken' }

        hints = json['attempt']['hints']
        expect(hints['last_hint']).to be_nil
        expect(hints['unlocked']).to eq([])
        expect(hints['unlocked_all']).to eq(false)
        locked_hints = hints['locked']
        expect(locked_hints.length).to eq(problem.hints.length)

        locked_hints.each do |locked_hint|
          expect(locked_hint['title']).not_to be_nil
          expect(locked_hint['body']).to be_nil
          expect(locked_hint['hint_video_url']).to be_nil
        end
      end

      it '3/10 hint unlocked' do
        problem = create(:problem_with_answer_and_hints)
        user_uid = 'mock-uid'
        last_hint = problem.hints.first.lower_item.lower_item.lower_item
        problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
        stub_firebase_verify_success_user({ "user_uid": user_uid })
        get "/api/v1/problems/#{problem.id}/attempts", headers: { 'Authorization' => 'Bearer MoCkToken' }

        hints = json['attempt']['hints']
        expect(hints['last_hint']['id']).to be(last_hint.id)
        expect(hints['unlocked'].length).to eq(4)
        hints['unlocked'].each do |unlocked_hint|
          expect(unlocked_hint['title']).not_to be_nil
          expect(unlocked_hint['body']).not_to be_nil
        end
        expect(hints['unlocked_all']).to eq(false)
        locked_hints = hints['locked']
        expect(locked_hints.length).to eq(problem.hints.length - 4)
        locked_hints.each do |locked_hint|
          expect(locked_hint['title']).not_to be_nil
          expect(locked_hint['body']).to be_nil
          expect(locked_hint['hint_video_url']).to be_nil
        end
      end

      it '10/10 hint unlocked' do
        problem = create(:problem_with_answer_and_hints)
        user_uid = 'mock-uid'
        last_hint = problem.hints.last
        problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
        stub_firebase_verify_success_user({ "user_uid": user_uid })
        get "/api/v1/problems/#{problem.id}/attempts", headers: { 'Authorization' => 'Bearer MoCkToken' }

        hints = json['attempt']['hints']
        expect(hints['last_hint']['id']).to be(last_hint.id)
        expect(hints['unlocked'].length).to eq(5)
        hints['unlocked'].each do |unlocked_hint|
          expect(unlocked_hint['title']).not_to be_nil
          expect(unlocked_hint['body']).not_to be_nil
        end
        expect(hints['unlocked_all']).to eq(true)
        locked_hints = hints['locked']
        expect(locked_hints.length).to eq(0)
      end
    end
  end

  describe 'POST /attempts/:attempt_id/unlock_hint' do
    it 'unlock first hint' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      attempt = problem.attempts.create!(user_uid: user_uid)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_hint", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['hints']['last_hint']['position']).to eq(1)
      expect(json['attempt']['hints']['last_hint']['id']).to eq(problem.hints.first.id)
    end

    it 'unlock next hint of last hint' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      last_hint = problem.hints.first
      attempt = problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_hint", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['hints']['last_hint']['position']).to eq(2)
      expect(json['attempt']['hints']['last_hint']['id']).to eq(problem.hints[1].id)
    end

    it 'no more hints to unlock' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      last_hint = problem.hints.last
      attempt = problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_hint", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['hints']['last_hint']['position']).to eq(5)
      expect(json['attempt']['hints']['last_hint']['id']).to eq(last_hint.id)
    end

    it 'problem has no hints to unlock' do
      problem = create(:problem)
      user_uid = 'mock-uid'
      attempt = problem.attempts.create!(user_uid: user_uid)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_hint", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['hints']['locked'].length).to eq(0)
      expect(json['attempt']['hints']['unlocked'].length).to eq(0)
    end
  end

  describe 'POST /attempts/:attempt_id/unlock_answer' do
    it 'unlock answer' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      last_hint = problem.hints.last
      attempt = problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_answer", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['answer']['id']).to eq(problem.answer.id)
      expect(json['attempt']['status']).to eq('skipped')
    end

    it 'no hints unlocked should not unlock answer' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      attempt = problem.attempts.create!(user_uid: user_uid)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_answer", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['error']).to eq('Unlock all the hints first')
    end

    it 'some hints unlocked should not unlock answer' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      last_hint = problem.hints.first
      attempt = problem.attempts.create!(user_uid: user_uid, last_hint: last_hint)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_answer", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['error']).to eq('Unlock all the hints first')
    end

    it 'answer already unlocked' do
      problem = create(:problem_with_answer_and_hints)
      user_uid = 'mock-uid'
      attempt = problem.attempts.create!(user_uid: user_uid, answer: problem.answer)
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/unlock_answer", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['error']).to eq('Answer already unlocked')
    end
  end

  describe 'POST /attempts/:attempt_id/submissions' do
    it 'correct answer simple fraction' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      user_uid = attempt.user_uid
      payload = {
        "submission": {
          "submission_value_numerator": answer.answer_value_numerator,
          "submission_value_denominator": answer.answer_value_denominator
        }
      }
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/submissions", params: payload,
                                                         headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['submission']['status']).to eq('pass')
      expect(Submission.find(json['submission']['id']).attempt.answer.id).to eq(answer.id)
    end

    it 'correct answer not simple fraction' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      user_uid = attempt.user_uid
      payload = {
        "submission": {
          "submission_value_numerator": answer.answer_value_numerator * 2,
          "submission_value_denominator": answer.answer_value_denominator * 2
        }
      }
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/submissions", params: payload,
                                                         headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['submission']['status']).to eq('pass')
      expect(Submission.find(json['submission']['id']).attempt.answer.id).to eq(answer.id)
    end

    it 'correct wrong answer' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      user_uid = attempt.user_uid
      payload = {
        "submission": {
          "submission_value_numerator": answer.answer_value_numerator * answer.answer_value_numerator,
          "submission_value_denominator": answer.answer_value_denominator * answer.answer_value_denominator
        }
      }
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      post "/api/v1/attempts/#{attempt.id}/submissions", params: payload,
                                                         headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['submission']['status']).to eq('fail')
      expect(Submission.find(json['submission']['id']).attempt.answer).to be_nil
    end
  end

  describe 'PUT /attempts/:attempt_id/attempt_time' do
    it 'update time happy' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      user_uid = attempt.user_uid
      payload = {
          "attempt_time":  1234
      }
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      put "/api/v1/attempts/#{attempt.id}/attempt_time", params: payload,
           headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['attempt']['attempt_time']).to eq(1234)
    end
    it 'update time sad flow - invalid time' do
      attempt = create(:attempt)
      answer = attempt.problem.answer
      user_uid = attempt.user_uid
      payload = {
          "attempt_time": -1
      }
      stub_firebase_verify_success_user({ "user_uid": user_uid })
      put "/api/v1/attempts/#{attempt.id}/attempt_time", params: payload,
          headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(response.status).to eq(400)
      expect(json['error']).to eq("Invalid Time -1")
    end
  end

end
