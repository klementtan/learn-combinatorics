require 'open-uri'

class User < ApplicationRecord
  rolify
  include Rails.application.routes.url_helpers
  validates :primary_email, :name , presence: true
  has_one_attached :avatar
  after_create :assign_default_role
  has_many :otps
  has_many :attempts
  has_many :doubt_replies
  has_many :doubt_threads
  def assign_default_role
    self.add_role(Roles::PUBLIC_USER)
  end
  def avatar_url
    url = nil
    url = rails_blob_url(avatar, Rails.application.config.action_mailer.default_url_options) if avatar.attached?
    url
  end

  def grab_avatar_from_url(avatar_url)
    downloaded_photo = open(avatar_url)
    self.avatar.attach(io: downloaded_photo, filename: "#{self.name}_avatar.jpg")
  end
end
