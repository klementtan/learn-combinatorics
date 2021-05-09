# frozen_string_literal: true

# spec/support/request_spec_helper
# Helper method for request specs
module RequestSpecHelper
  # Parse JSON response to ruby hash
  def json
    JSON.parse(response.body)
  end

  def stub_firebase_verify_success
    stub_request(:post, 'https://us-central1-learn-combinatorics.cloudfunctions.net/verify')
      .to_return(status: 200, body: JSON.generate({
                                                    "name": 'admin',
                                                    "email_verified": false,
                                                    "picture": 's3.aws.com.sg',
                                                    "email": 'adminadmin@email.com',
                                                    "uid": 'yescQDqOM3MV7ef5VuG9uk6Dqcq2',
                                                    "role": {
                                                      "privilege_level": 3,
                                                      "title": 'Admin User'
                                                    }
                                                  }), headers:  { 'Content-Type' => 'application/json' })
  end

  def stub_firebase_verify_success_user(user)
    stub_request(:post, 'https://us-central1-learn-combinatorics.cloudfunctions.net/verify')
      .to_return(status: 200, body: JSON.generate({
                                                    "name": 'admin',
                                                    "email_verified": false,
                                                    "picture": 's3.aws.com.sg',
                                                    "email": 'adminadmin@email.com',
                                                    "uid": user[:user_uid],
                                                    "role": {
                                                      "privilege_level": 3,
                                                      "title": 'Admin User'
                                                    }
                                                  }), headers:  { 'Content-Type' => 'application/json' })
  end

  def stub_firebase_verify_success_custom_role(privilege_level)
    stub_request(:post, 'https://us-central1-learn-combinatorics.cloudfunctions.net/verify')
      .to_return(status: 200, body: JSON.generate({
                                                    "name": 'admin',
                                                    "email_verified": false,
                                                    "picture": 's3.aws.com.sg',
                                                    "email": 'adminadmin@email.com',
                                                    "uid": 'yescQDqOM3MV7ef5VuG9uk6Dqcq2',
                                                    "role": {
                                                      "privilege_level": privilege_level,
                                                      "title": 'Mock user'
                                                    }
                                                  }), headers:  { 'Content-Type' => 'application/json' })
  end

  def stub_firebase_verify_failure
    stub_request(:post, 'https://us-central1-learn-combinatorics.cloudfunctions.net/verify')
      .to_return(status: 200, body: 'Error: Firebase ID token has invalid signature. See https://firebase.google.'\
        'com/docs/auth/admin/verify-id-tokens for'\
        'details on how to retrieve an ID token.', headers: {})
  end
end
