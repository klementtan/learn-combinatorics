# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Lectures API', type: :request do
  describe 'GET /lectures' do
    it 'return all lectures' do
      create_list(:lecture, 10)
      stub_firebase_verify_success
      get '/api/v1/lectures', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['lectures']).not_to be_empty
      expect(json['lectures'].size).to eq(10)
    end
  end

  describe 'POST /lectures' do
    it 'return create lectures' do
      stub_firebase_verify_success
      section = create(:section)
      post '/api/v1/lectures', headers: { 'Authorization' => 'Bearer MoCkToken' },
                               params: { lecture: { title: 'Lecture test' }, section_id: section.id }
      expect(json['lecture']['title']).to eq('Lecture test')
      expect(json['lecture']['position']).to eq(1)
    end
  end

  describe 'PUT /lectures/:lecture_id' do
    it 'return update lecture' do
      stub_firebase_verify_success
      section = create(:section)
      lecture = create(:lecture)
      put "/api/v1/lectures/#{lecture.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                            params: { lecture: { title: 'Lecture update' }, section_id: section.id }
      expect(json['lecture']['title']).to eq('Lecture update')
      expect(json['lecture']['section']['id']).to eq(section.id)
    end
  end

  describe 'GET /lectures/:lecture_id' do
    it 'get chapter' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      get "/api/v1/lectures/#{lecture.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['lecture']['title']).to eq(lecture.title)
      expect(json['lecture']['id']).to eq(lecture.id)
    end
  end

  describe 'DELETE /chapters/:chapter_id' do
    it 'delete chapter' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      delete "/api/v1/lectures/#{lecture.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['lecture']['title']).to eq(lecture.title)
      expect(json['lecture']['id']).to eq(lecture.id)
      expect { Lecture.find(lecture.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                         "Couldn't find Lecture with 'id'=#{lecture.id}")
    end
  end

  describe 'POST /lectures/positions' do
    it 'update positions for all lectures' do
      stub_firebase_verify_success
      section = create(:section)
      (0..9).each do |i|
        section.lectures.create!(title: "lecture #{i}")
      end
      section.reload
      all_lectures = section.lectures
      payload = {
        section_id: section.id,
        lectures: []
      }
      updated_id_position_map = {}
      all_lectures.each do |lecture|
        payload[:lectures].append({
                                    lecture_id: lecture.id,
                                    lecture_position: all_lectures.length - lecture.position + 1
                                  })
        updated_id_position_map[lecture.id] = all_lectures.length - lecture.position + 1
      end
      post '/api/v1/lectures/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      lectures_response = json['lectures']
      lectures_response.each do |lecture_response|
        lecture_id = lecture_response['id']
        expect(lecture_response['position']).to eq(updated_id_position_map[lecture_id])
        expect(lecture_response['position']).to eq(Lecture.find(lecture_id).position)
      end
    end

    it 'missing lecture sad path' do
      stub_firebase_verify_success
      section = create(:section)
      (0..1).each do |i|
        section.lectures.create!(title: "lecture #{i}")
      end
      payload = {
        section_id: section.id,
        lectures: [{
          lecture_id: 1,
          lecture_position: 1
        }]
      }
      post '/api/v1/lectures/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Enter all lectures to set positions for section #{section.id}")
    end

    it 'duplicate lecture id sad path' do
      stub_firebase_verify_success
      section = create(:section)
      lecture1 = section.lectures.create!(title: 'lecture 1')
      section.lectures.create!(title: 'lecture 2')
      payload = {
        section_id: section.id,
        lectures: [{
          lecture_id: lecture1.id,
          lecture_position: 1
        },
                   {
                     lecture_id: lecture1.id,
                     lecture_position: 2
                   }]
      }
      post '/api/v1/lectures/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Duplicate lecture_id: #{lecture1.id}")
    end

    it 'duplicate section position sad path' do
      stub_firebase_verify_success
      stub_firebase_verify_success
      section = create(:section)
      lecture1 = section.lectures.create!(title: 'lecture 1')
      lecture2 = section.lectures.create!(title: 'lecture 2')
      payload = {
        section_id: section.id,
        lectures: [{
          lecture_id: lecture1.id,
          lecture_position: 1
        },
                   {
                     lecture_id: lecture2.id,
                     lecture_position: 1
                   }]
      }
      post '/api/v1/lectures/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate lecture_position: 1')
    end

    it 'invalid chapter relation id sad path' do
      stub_firebase_verify_success
      lecture = create(:lecture)
      random_lecture = create(:lecture)
      payload = {
        section_id: random_lecture.section.id,
        lectures: [{
          lecture_id: lecture.id,
          section_position: 1
        }]
      }
      post '/api/v1/lectures/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Lecture #{lecture.id} does not belong to #{random_lecture.section.id}")
    end
  end
end
