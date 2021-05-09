class UserSerializer < ActiveModel::Serializer
  attributes :id, :primary_email, :name, :nus_email, :roles, :avatar_url

  def roles
    self.object.roles
  end
end
