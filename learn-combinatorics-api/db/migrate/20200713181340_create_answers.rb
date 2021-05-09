class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :answers do |t|
      t.references :problem, null: false, foreign_key: true
      t.integer :answer_value_numerator
      t.integer :answer_value_denominator
      t.text :explanation_body

      t.timestamps
    end
  end
end
