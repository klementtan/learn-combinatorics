# frozen_string_literal: true

class HintSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :position, :updated_at, :created_at, :hint_video_url, :hint_body_pdf_url
  belongs_to :problem
  # delegate :hint_video_url, to: :object
  # delegate :hint_body_pdf_url, to: :object
end
