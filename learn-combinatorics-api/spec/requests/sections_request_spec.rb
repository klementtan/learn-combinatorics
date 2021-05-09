# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Sections API', type: :request do
  describe 'GET /sections' do
    it 'return all random sections with 1 - 1 chapter' do
      create_list(:section, 10)
      stub_firebase_verify_success
      get '/api/v1/sections', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['sections']).not_to be_empty
      expect(json['sections'].size).to eq(10)
      json['sections'].each do |section|
        expect(section['position']).to eq(1)
      end
    end

    it 'return all sections with chapter scope' do
      chapter1 = Chapter.create!(title: 'chapter 1')
      chapter2 = Chapter.create!(title: 'chapter 1')

      (0..5).each do |i|
        chapter1.sections.create!(title: "section #{i} for chapter 1")
      end

      (0..7).each do |i|
        chapter2.sections.create!(title: "section #{i} for chapter 2")
      end
      stub_firebase_verify_success
      get '/api/v1/sections', headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['sections']).not_to be_empty
      expect(json['sections'].size).to eq(14)

      (0..5).each do |i|
        section_json = json['sections'][i]
        expect(section_json['title']).to eq("section #{i} for chapter 1")
        expect(section_json['position']).to eq(i + 1)
      end

      (0..5).each do |i|
        section_json = json['sections'][i + 6]
        expect(section_json['title']).to eq("section #{i} for chapter 2")
        expect(section_json['position']).to eq(i + 1)
      end
    end
  end

  describe 'POST /sections' do
    it 'create section' do
      stub_firebase_verify_success
      chapter = create(:chapter)
      post '/api/v1/sections', headers: { 'Authorization' => 'Bearer MoCkToken' },
                               params: { section: { title: 'Section test' }, chapter_id: chapter.id }
      expect(json['section']['title']).to eq('Section test')
      expect(json['section']['position']).to eq(1)
      expect(json['section']['chapter']['id']).to eq(chapter.id)
    end
  end

  describe 'PUT /sections/:section_id' do
    it 'return update section with chapter change' do
      stub_firebase_verify_success
      chapter1 = Chapter.create!(title: 'chapter 1')
      chapter2 = Chapter.create!(title: 'chapter 1')

      (0..5).each do |i|
        chapter1.sections.create!(title: "section #{i} for chapter 1")
      end

      (0..7).each do |i|
        chapter2.sections.create!(title: "section #{i} for chapter 2")
      end
      section = chapter2.sections.create!(title: 'section')
      put "/api/v1/sections/#{section.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                            params: { section: { title: 'Section Update' }, chapter_id: chapter2.id }
      expect(json['section']['title']).to eq('Section Update')
      expect(json['section']['chapter']['id']).to eq(chapter2.id)
      expect(json['section']['position']).to eq(9)
    end

    it 'return update section without chapter change' do
      stub_firebase_verify_success
      section = create(:section)
      section.chapter.sections.create!(title: 'temp')
      put "/api/v1/sections/#{section.id}", headers: { 'Authorization' => 'Bearer MoCkToken' },
                                            params: { section: { title: 'Section Update' },
                                                      chapter_id: section.chapter.id }
      expect(json['section']['title']).to eq('Section Update')
      expect(json['section']['chapter']['id']).to eq(section.chapter.id)
      expect(json['section']['position']).to eq(1)
    end
  end

  describe 'GET /sections/:section_id' do
    it 'get section' do
      stub_firebase_verify_success
      section = create(:section)
      get "/api/v1/sections/#{section.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['section']['title']).to eq(section.title)
      expect(json['section']['position']).to eq(1)
      expect(json['section']['chapter']['id']).to eq(section.chapter.id)
    end
  end

  describe 'DELETE /chapters/:chapter_id' do
    it 'delete chapter' do
      stub_firebase_verify_success
      section = create(:section)
      delete "/api/v1/sections/#{section.id}", headers: { 'Authorization' => 'Bearer MoCkToken' }
      expect(json['section']['title']).to eq(section.title)
      expect { Section.find(section.id) }.to raise_error(ActiveRecord::RecordNotFound,
                                                         "Couldn't find Section with 'id'=#{section.id}")
    end
  end

  describe 'POST /sections/positions' do
    it 'update positions for all sections' do
      stub_firebase_verify_success
      chapter = create(:chapter)
      (0..9).each do |i|
        chapter.sections.create!(title: "section #{i}")
      end
      chapter.reload
      all_sections = chapter.sections
      payload = {
        chapter_id: chapter.id,
        sections: []
      }
      updated_id_position_map = {}
      all_sections.each do |section|
        payload[:sections].append({
                                    section_id: section.id,
                                    section_position: all_sections.length - section.position + 1
                                  })
        updated_id_position_map[section.id] = all_sections.length - section.position + 1
      end
      post '/api/v1/sections/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      sections_response = json['sections']
      sections_response.each do |section_response|
        section_id = section_response['id']
        expect(section_response['position']).to eq(updated_id_position_map[section_id])
        expect(section_response['position']).to eq(Section.find(section_id).position)
      end
    end

    it 'missing section sad path' do
      stub_firebase_verify_success
      chapter = create(:chapter)
      (0..1).each do |i|
        chapter.sections.create!(title: "section #{i}")
      end
      payload = {
        chapter_id: chapter.id,
        sections: [{
          section_id: 1,
          section_position: 1
        }]
      }
      post '/api/v1/sections/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Enter all sections to set positions for chapter #{chapter.id}")
    end

    it 'duplicate section id sad path' do
      stub_firebase_verify_success
      chapter = create(:chapter)
      section1 = chapter.sections.create!(title: 'section 1')
      chapter.sections.create!(title: 'section 2')
      payload = {
        chapter_id: chapter.id,
        sections: [{
          section_id: section1.id,
          section_position: 1
        },
                   {
                     section_id: section1.id,
                     section_position: 2
                   }]
      }
      post '/api/v1/sections/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Duplicate section_id: #{section1.id}")
    end

    it 'duplicate section position sad path' do
      stub_firebase_verify_success
      chapter = create(:chapter)
      section1 = chapter.sections.create!(title: 'section 1')
      section2 = chapter.sections.create!(title: 'section 2')
      payload = {
        chapter_id: chapter.id,
        sections: [{
          section_id: section1.id,
          section_position: 1
        },
                   {
                     section_id: section2.id,
                     section_position: 1
                   }]
      }
      post '/api/v1/sections/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq('Duplicate section_position: 1')
    end

    it 'invalid chapter relation id sad path' do
      stub_firebase_verify_success
      section = create(:section)
      random_section = create(:section)
      payload = {
        chapter_id: random_section.chapter.id,
        sections: [{
          section_id: section.id,
          section_position: 1
        }]
      }
      post '/api/v1/sections/positions', headers: { 'Authorization' => 'Bearer MoCkToken' }, params: payload
      expect(json['error']).to eq("Section #{section.id} does not belong to #{random_section.chapter.id}")
    end
  end
end
