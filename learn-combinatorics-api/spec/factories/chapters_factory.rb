# frozen_string_literal: true

FactoryBot.define do
  factory :chapter do
    title { Faker::Lorem.word }
  end
end
