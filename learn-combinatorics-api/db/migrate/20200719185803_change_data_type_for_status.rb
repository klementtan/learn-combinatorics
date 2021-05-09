class ChangeDataTypeForStatus < ActiveRecord::Migration[6.0]
  def change
    remove_column :attempts, :status
    add_column :attempts, :status,  :integer, :default => 0
  end
end
