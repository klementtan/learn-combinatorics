class ChangeTimeToAttemptTime < ActiveRecord::Migration[6.0]
  def change
    rename_column :attempts, :time, :attempt_time
  end
end
