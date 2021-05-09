# frozen_string_literal: true

FactoryBot.define do
  factory :answer do
    numerator = Faker::Number.digit
    denominator = Faker::Number.digit
    while numerator.gcd(denominator) != 1
      numerator = Faker::Number.digit
      denominator = Faker::Number.digit
    end
    answer_value_numerator { numerator }
    answer_value_denominator { denominator }
    explanation_body { Faker::Lorem.paragraph }
    problem
  end
end
