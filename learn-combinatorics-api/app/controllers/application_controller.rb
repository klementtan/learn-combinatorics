# frozen_string_literal: true

class ApplicationController < ActionController::API
  helper :all
  def check
    render json: {
        message: 'ok'
    }

  end
end
