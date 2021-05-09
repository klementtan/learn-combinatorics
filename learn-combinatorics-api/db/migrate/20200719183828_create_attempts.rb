class CreateAttempts < ActiveRecord::Migration[6.0]
  def change
    create_table :attempts do |t|
      t.references :problem, null: false, foreign_key: true
      t.string :user_uid
      t.string :status

      t.timestamps
    end
  end
end
