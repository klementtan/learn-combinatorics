class CreateUserDefaultRoleTable < ActiveRecord::Migration[6.0]
  def change
    create_table :user_default_roles do |t|
      t.string :user_email
      t.string :role
    end
  end
end
