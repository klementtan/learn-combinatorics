class RemoveSection < ActiveRecord::Migration[6.0]
  def change
    remove_reference :lectures, :section
    add_reference :lectures, :chapter
    drop_table :sections
  end
end
