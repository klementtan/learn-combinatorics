class UserDefaultRole < ApplicationRecord
  validates :user_email, :role , presence: true
end
