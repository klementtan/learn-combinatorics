# frozen_string_literal: true

FactoryBot.define do
  factory :problem do
    title { Faker::Lorem.word }
    body { Faker::Lorem.paragraph }
    factory :problem_with_answer do
      after(:create) do |problem, _evaluator|
        create(:answer, problem: problem)
        problem
      end
    end
    factory :problem_with_answer_and_hints do
      transient do
        hints_count { 5 }
      end
      after(:create) do |problem, evaluator|
        create_list(:hint, evaluator.hints_count, problem: problem)
        create(:answer, problem: problem)
        problem
      end
    end
    lecture
  end
end
