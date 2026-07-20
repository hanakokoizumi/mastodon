# frozen_string_literal: true

class AddWorldPlanToAccounts < ActiveRecord::Migration[8.0]
  def change
    add_column :accounts, :world_plan_server, :string, null: false, default: ''
    add_column :accounts, :world_plan_game_id, :string, null: false, default: ''
  end
end
