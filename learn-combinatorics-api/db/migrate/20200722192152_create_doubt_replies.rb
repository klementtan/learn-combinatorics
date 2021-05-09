class CreateDoubtReplies < ActiveRecord::Migration[6.0]
  def change
    create_table :doubt_replies do |t|
      t.text :body
      t.string :user_uid
      t.boolean :read_by_admin
      t.boolean :read_by_user
      t.references :doubt_thread, null: false, foreign_key: true

      t.timestamps
    end
  end
end
