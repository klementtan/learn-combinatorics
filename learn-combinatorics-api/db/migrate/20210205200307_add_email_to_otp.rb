class AddEmailToOtp < ActiveRecord::Migration[6.0]
  def change
    add_column :otps, :email, :string
  end
end
