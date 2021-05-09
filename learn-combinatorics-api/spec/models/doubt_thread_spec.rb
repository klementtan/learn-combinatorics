# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DoubtThread, type: :model do
  it { is_expected.to validate_presence_of(:body) }
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to validate_presence_of(:user_uid) }
  it { is_expected.to belong_to(:attempt) }
  it { is_expected.to have_many(:doubt_replies) }
end
