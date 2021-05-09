class AddAnswerToAttempt < ActiveRecord::Migration[6.0]
  def change
    add_reference :attempts, :answer, null: true, foreign_key: true
  end
end
