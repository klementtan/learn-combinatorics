# frozen_string_literal: true

FactoryBot.define do
  factory :doubt_thread do
    title { Faker::Lorem.word }
    body { Faker::Lorem.word }
    user_uid { SecureRandom.uuid }
    attempt
  end
end
