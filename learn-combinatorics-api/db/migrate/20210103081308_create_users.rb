class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :picture_url
      t.string :primary_email
      t.string :nus_email

      t.timestamps
    end
  end
end
