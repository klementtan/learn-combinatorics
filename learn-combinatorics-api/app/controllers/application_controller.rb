# frozen_string_literal: true

class ApplicationController < ActionController::API
  helper :all
  def check
    render json: {
        message: 'ok'
    }

  end
  def health_check
    #Check db connection
    database_connection = false
    require './config/environment.rb' # Assuming the script is located in the root of the rails app
    begin
      ActiveRecord::Base.establish_connection # Establishes connection
      puts 'ActiveRecord::Base.establish_connection Pass!'
      ActiveRecord::Base.connection # Calls connection object
      puts 'ActiveRecord::Base.connection pass'
      database_connection = true if ActiveRecord::Base.connected?
      puts 'ActiveRecord::Base.connected? pass'
    rescue
      puts 'NOT CONNECTED!'
    end


    render json: {
        sever_running: true,
        database_connection: database_connection
    }
  end
end
