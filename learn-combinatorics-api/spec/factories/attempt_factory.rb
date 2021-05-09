# frozen_string_literal: true

FactoryBot.define do
  factory :attempt do
    association :last_hint, factory: :hint
    user_uid { SecureRandom.uuid }
    association :problem, factory: :problem_with_answer_and_hints
  end
end
