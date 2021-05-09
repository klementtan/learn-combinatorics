# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Chapters API', type: :request do
  describe 'GET /chapters' do
    it 'return all chapters' do
      create_list(:chapter, 10)
      stub_firebase_verify_success
      get '/api/v1/chapters', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['chapters']).not_to be_empty
      expect(json['chapters'].size).to eq(10)
    end
  end

  describe 'POST /chapters' do
    it 'return create chapter' do
      stub_firebase_verify_success
      post '/api/v1/chapters', headers: { 'Authorization' => 'Bearer MoCkToken' },
                               params: { chapter: { title: 'Chapter test' } }
      expect(json['chapter']['title']).to eq('Chapter test')
      expect(json['chapter']['position']).to eq(1)
    end
  end

  describe 'PUT /chapters/:chapter_id' do
    it 'return update chapter' do
      stub_firebase_verify_success
      chapter = Chapter.create!(title: 'Chapter Foo')
      put "/api/v1/chapters/#{chapter.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                            params: { chapter: { title: 'Chapter bar' } }
      expect(json['chapter']['title']).to eq('Chapter bar')
      expect(Chapter.find(chapter.id).title).to eq('Chapter bar')
    end
  end

  describe 'GET /chapters/:chapter_id' do
    it 'get chapter' do
      stub_firebase_verify_success
      chapter = Chapter.create!(title: 'Chapter Foo')
      get "/api/v1/chapters/#{chapter.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['chapter']['title']).to eq('Chapter Foo')
    end
  end

  describe 'DELETE /chapters/:chapter_id' do
    it 'delete chapter' do
      stub_firebase_verify_success
      chapter = Chapter.create!(title: 'Chapter Foo')
      delete "/api/v1/chapters/#{chapter.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['chapter']['title']).to eq('Chapter Foo')
      expect { Chapter.find(chapter.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                         "Couldn't find Chapter with 'id'=#{chapter.id}")
    end
  end

  describe 'POST /chapters/positions' do
    it 'update positions for all chapter' do
      stub_firebase_verify_success
      create_list(:chapter, 10)
      # TODO: find a way to handle if not sorted by id
      all_chapters = Chapter.all.order(:id)
      payload = {
        chapters: []
      }
      updated_id_position_map = {}
      all_chapters.each do |chapter|
        payload[:chapters].append({
                                    chapter_id: chapter.id,
                                    chapter_position: all_chapters.length - chapter.position + 1
                                  })
        updated_id_position_map[chapter.id] = all_chapters.length - chapter.position + 1
      end
      post '/api/v1/chapters/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      chapters_response = json['chapters']
      chapters_response.each do |chapter_response|
        chapter_id = chapter_response['id']
        expect(chapter_response['position']).to eq(updated_id_position_map[chapter_id])
        expect(chapter_response['position']).to eq(Chapter.find(chapter_id).position)
      end
    end

    it 'missing chapter sad path' do
      stub_firebase_verify_success
      create_list(:chapter, 2)
      payload = {
        chapters: [{
          chapter_id: 1,
          chapter_position: 1
        }]
      }
      post '/api/v1/chapters/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Enter all chapters to set positions')
    end

    it 'duplicate chapter id sad path' do
      stub_firebase_verify_success
      create_list(:chapter, 2)
      payload = {
        chapters: [
          {
            chapter_id: 1,
            chapter_position: 1
          },
          {
            chapter_id: 1,
            chapter_position: 2
          }
        ]
      }
      post '/api/v1/chapters/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate chapter_id: 1')
    end

    it 'duplicate position sad path' do
      stub_firebase_verify_success
      create_list(:chapter, 2)
      payload = {
        chapters: [
          {
            chapter_id: 1,
            chapter_position: 1
          },
          {
            chapter_id: 2,
            chapter_position: 1
          }
        ]
      }
      post '/api/v1/chapters/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate chapter_position: 1')
    end
  end
end
