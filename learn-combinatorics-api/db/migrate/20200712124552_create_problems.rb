class CreateProblems < ActiveRecord::Migration[6.0]
  def change
    create_table :problems do |t|
      t.string :title
      t.text :body
      t.integer :privilege_level
      t.references :lecture, null: false, foreign_key: true
      t.integer :position
      t.timestamps
    end
  end
end
