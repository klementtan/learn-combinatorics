class CreateSubmissions < ActiveRecord::Migration[6.0]
  def change
    create_table :submissions do |t|
      t.references :attempt, null: false, foreign_key: true
      t.integer :submission_value_numerator
      t.integer :submission_value_denominator
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
