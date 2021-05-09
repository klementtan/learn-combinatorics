class CreateDoubtThreads < ActiveRecord::Migration[6.0]
  def change
    create_table :doubt_threads do |t|
      t.string :title
      t.text :body
      t.string :user_uid
      t.references :attempt, null: false, foreign_key: true

      t.timestamps
    end
  end
end
