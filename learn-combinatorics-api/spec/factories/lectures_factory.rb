# frozen_string_literal: true

FactoryBot.define do
  factory :lecture do
    title { Faker::Lorem.word }
    section
  end
end
