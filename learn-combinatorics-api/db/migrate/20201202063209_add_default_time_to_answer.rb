class AddDefaultTimeToAnswer < ActiveRecord::Migration[6.0]
  def change
    change_column :attempts, :time, :integer, :default => 0
  end
end
