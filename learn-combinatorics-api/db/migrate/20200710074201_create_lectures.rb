class CreateLectures < ActiveRecord::Migration[6.0]
  def change
    create_table :lectures do |t|
      t.string :title
      t.integer :position
      t.references :section, null: false, foreign_key: true

      t.timestamps
    end
  end
end
