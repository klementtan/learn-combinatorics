# frozen_string_literal: true

FactoryBot.define do
  factory :section do
    title { Faker::Lorem.word }
    chapter
  end
end
