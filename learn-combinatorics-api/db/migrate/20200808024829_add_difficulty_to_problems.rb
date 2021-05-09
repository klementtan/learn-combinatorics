class AddDifficultyToProblems < ActiveRecord::Migration[6.0]
  def change
    add_column :problems, :difficulty, :integer, default: 0
  end
end
