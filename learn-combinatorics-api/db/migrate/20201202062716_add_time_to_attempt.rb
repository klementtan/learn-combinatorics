class AddTimeToAttempt < ActiveRecord::Migration[6.0]
  def change
    add_column :attempts, :time, :integer
  end
end
