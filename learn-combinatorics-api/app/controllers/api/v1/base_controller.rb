# frozen_string_literal: true

# Parent class for all API controllers
class Api::V1::BaseController < ApplicationController
  include Rails.application.routes.url_helpers
  # rescue_from Exception, with: :render_500_error
  helper_method :authenticate, :google_authenticate
  rescue_from GoogleAuthenticationError, with: :render_403_google_error
  rescue_from AuthenticationError, with: :render_403_error
  rescue_from AuthorizationError, with: :render_403_error
  rescue_from InvalidParamsError, with: :render_400_error
  rescue_from LogicalError, with: :render_400_error
  rescue_from InvalidRequestError, with: :render_400_error
  rescue_from ActiveRecord::RecordNotFound, with: :render_404_error
  rescue_from ActiveRecord::RecordInvalid, with: :render_json_error

  def google_authenticate(scope)
    token = request.headers['Authorization'].split(' ')[1]

    raise InvalidParamsError, 'Bearer Token empty' if token.nil?

    response = HTTParty.post("https://oauth2.googleapis.com/tokeninfo?id_token=#{token}")
    response_json = JSON.parse(response.body)
    raise GoogleAuthenticationError, response_json['error'] if response_json['error']

    @user = User.find_by_primary_email([response_json["email"]])

    @user ||= User.create!(name: response_json["name"], primary_email: response_json["email"])
    if response_json["picture"] && !@user.avatar.attached?
      @user.grab_avatar_from_url(response_json["picture"])
    end
    default_roles = UserDefaultRole.where(user_email: @user.primary_email)
    if default_roles
      default_roles.each do |default_role|
        @user.add_role(default_role.role)
      end
    end
    unless @user.has_role? scope
      raise AuthorizationError, "User not authorized to access #{scope}"
    end
  end

  def authenticate(scope)
    token = request.headers['Authorization']
    raise InvalidParamsError, 'Bearer Token empty' if token.nil?

    response = HTTParty.post("#{ENV['FIREBASE_ENDPOINT']}/verify",
                             headers: {"Authorization": token}, body: {"scope": scope})
    raise AuthenticationError, response.body if response.body == 'User not authorized'

    begin
      @user_json = JSON.parse(response.body)
    rescue JSON::ParserError
      raise AuthenticationError, response.body
    end
    raise AuthenticationError, 'Invalid authentication flow' if @user_json['uid'].nil?
  end

  def render_json_error(error)
    log_api_call(400, error)
    render json: {
        error: "#{error.record.class.name} record: #{error.message}"
    },
           status: 400 # Bad Request
  end

  def render_403_google_error(error)
    log_api_call(403, error)
    render json: {
      error: error.message,
      error_code: "GOOGLE_403"
    }
  end

  def render_500_error(error)
    log_api_call(500, error)
    render json: {error: error.message}, status: 500 # Internal Server Error
  end

  def render_400_error(error)
    log_api_call(400, error)
    render json: {error: error.message}, status: 400 # Internal Server Error
  end

  def render_401_error(error)
    log_api_call(401, error)
    render json: {error: error.message}, status: 401 # Internal Server Error
  end

  def render_403_error(error)
    log_api_call(403, error)
    render json: {error: error.message}, status: 403 # Authentication Error
  end

  def render_404_error(error)
    log_api_call(404, error)
    render json: {error: error.message}, status: 404 # Not Found
  end

  protected

  def log_api_call(status, error = nil)
    resp = error || JSON.parse(response.body) || response.body
    controller = params['controller']
    action = params['action']
    resp = ensure_within_text_length(resp.to_s)

    ApiQueryLog.create!(
        controller: controller,
        action: action,
        params: params.to_s,
        response: resp,
        status: status
    )

    return if status == 200

    Rails.logger.info "#{controller}##{action}: #{status} #{error&.inspect}"
    return if status != 500
  end

  def ensure_within_text_length(text)
    return nil if text.nil?
    return text if text.length < 65_535

    text[0..65_534]
  end
end
