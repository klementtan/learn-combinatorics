class AddPositionToChapter < ActiveRecord::Migration[6.0]
  def change
    add_column :chapters, :position, :integer
  end
end
