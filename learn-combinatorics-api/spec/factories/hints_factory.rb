# frozen_string_literal: true

FactoryBot.define do
  factory :hint do
    title { Faker::Lorem.word }
    body { Faker::Lorem.paragraph }
    problem
  end
end
