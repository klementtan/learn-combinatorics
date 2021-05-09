class AddStatusToDoubtThreads < ActiveRecord::Migration[6.0]
  def change
    add_column :doubt_threads, :status, :integer, default: 0
  end
end
