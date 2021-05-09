class CreateHints < ActiveRecord::Migration[6.0]
  def change
    create_table :hints do |t|
      t.string :title
      t.text :body
      t.references :problem, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
