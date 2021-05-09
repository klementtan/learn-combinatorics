# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DoubtReply, type: :model do
  it { is_expected.to validate_presence_of(:body) }
  it { is_expected.to validate_inclusion_of(:read_by_admin).in_array [true, false] }
  it { is_expected.to validate_inclusion_of(:read_by_user).in_array [true, false] }
  it { belong_to(:doubt_thread) }

  describe 'read_by_user/admin validation' do
    it 'allow ready_by_user only' do
      doubt_thread = create(:doubt_thread)
      expect  do
        reply = doubt_thread.doubt_replies.create!(body: 'lorem', read_by_admin: false, read_by_user: true, user_uid: 'uidd')
      end.not_to raise_error
    end

    it 'allow ready_by_admin only' do
      doubt_thread = create(:doubt_thread)
      expect { doubt_thread.doubt_replies.create!(body: 'lorem', read_by_admin: true, read_by_user: false, user_uid: 'uidd') }.not_to raise_error
    end

    it 'allow ready_by_user and read_by_admin' do
      doubt_thread = create(:doubt_thread)
      expect { doubt_thread.doubt_replies.create!(body: 'lorem', read_by_admin: true, read_by_user: true, user_uid: 'uidd') }.not_to raise_error
    end

    it 'allow ready by none' do
      doubt_thread = create(:doubt_thread)
      expect { doubt_thread.doubt_replies.create!(body: 'lorem', read_by_admin: false, read_by_user: false, user_uid: 'uidd') }.to raise_error
    end
  end
end
