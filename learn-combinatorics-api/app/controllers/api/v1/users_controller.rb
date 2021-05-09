# frozen_string_literal: true
require 'sendgrid-ruby'
include SendGrid

class Api::V1::UsersController < Api::V1::BaseController

  def get
    google_authenticate(Roles::PUBLIC_USER)
    render json: @user, serializer: UserSerializer, adapter: :json
  end
  def index
    google_authenticate(Roles::ADMIN)
    render json: User.all, each_serializer: UserSerializer, adapter: :json, root: 'users'
  end

  def update
    google_authenticate(Roles::PUBLIC_USER)
    @user.update!(permitted_user_params)
    render json: @user, serializer: UserSerializer, adapter: :json
  end

  def update_avatar
    google_authenticate(Roles::PUBLIC_USER)
    @user.avatar.attach(params.require('avatar'))
    render json: @user, serializer: UserSerializer, adapter: :json
  end

  def update_role
    google_authenticate(Roles::ADMIN)
    roles = params.require("roles")
    user = User.find(params.require("user_id"))
    user.roles.each do |role|
      role_name = role.name
      user.remove_role(role_name)
    end
    roles.each do |role|
      permitted_role = Roles::Enums[role.to_sym]
      raise InvalidParamsError, "Invalid Role provided #{role}" if permitted_role.nil?
      user.add_role(permitted_role)
    end
    render json: user, serializer: UserSerializer, adapter: :json
  end

  def send_otp
    google_authenticate(Roles::PUBLIC_USER)
    nus_email = params['nus_email']
    otp = rand(1..999999).to_s.rjust(6, "0")

    data = {
        'personalizations': [
            {
                'to': [
                    {
                        'email': nus_email
                    }
                ],
                'dynamic_template_data': {
                    'otp': otp
                }
            }
        ],
        'from': {
            'email': 'noreply@learn-combinatorics.com'
        },
        'template_id': 'd-f305ffa6b4e848f785131abf69530a70'
    }
    sg = SendGrid::API.new(api_key: ENV['SEND_GRID_API_KEY'])
    response = sg.client.mail._("send").post(request_body: JSON[data])
    raise InvalidRequestError, response if response.status_code != "202"
    @user.otps.create!(otp_value: otp, email: nus_email)
    @user.save!
    render  json: { status: response.status_code}
  end

  def verify_otp
    google_authenticate(Roles::PUBLIC_USER)
    otp = params['otp']
    matched_otp = @user.otps.find_by(otp_value: otp)
    raise InvalidRequestError, 'Invalid OTP sent' if matched_otp.nil?
    @user.add_role Roles::NUS_USER
    @user.update(nus_email: matched_otp.email)
    render json: @user, serializer: UserSerializer, adapter: :json
  end


  def permitted_user_params
    params.require(:user).permit(:name, :nus_email)
  end
end
