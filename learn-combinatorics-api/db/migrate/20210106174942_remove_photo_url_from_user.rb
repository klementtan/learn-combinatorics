class RemovePhotoUrlFromUser < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :picture_url
  end
end
