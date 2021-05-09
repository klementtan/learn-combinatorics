class RemoveStatusFromAttempts < ActiveRecord::Migration[6.0]
  def change
    remove_column :attempts, :status
    add_reference :attempts, :last_hint, index: true, foreign_key: { to_table: :hints }

  end
end
