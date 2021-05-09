class AddUserToTutorialsDoubtThreadsDoubtReplies < ActiveRecord::Migration[6.0]
  def change
    add_reference :attempts, :user
    add_reference :doubt_threads, :user
    add_reference :doubt_replies, :user
  end
end
