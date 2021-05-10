# frozen_string_literal: true

Rails.application.routes.draw do
  default_url_options :host => ENV['HOST']
  get '/' => 'application#check'
  get '/health_check' => 'application#health_check'
  namespace :api do
    namespace :v1 do
      get '/users' => 'users#get'
      get '/users/all' => 'users#index'
      put '/users' => 'users#update'
      put '/users/:user_id/roles' => 'users#update_role'
      post '/users/otp/send' => 'users#send_otp'
      post '/users/otp/verify' => 'users#verify_otp'

      get '/chapters' => 'chapters#index'
      post '/chapters/:chapter_id/positions' => 'chapters#change_position'
      get '/chapters/:chapter_id' => 'chapters#show'
      put '/chapters/:chapter_id' => 'chapters#update'
      delete '/chapters/:chapter_id' => 'chapters#delete'
      post '/chapters' => 'chapters#create'
      post '/chapters/positions' => 'chapters#set_positions'


      get '/sections' => 'sections#index'
      get '/sections/:section_id' => 'sections#show'
      put '/sections/:section_id' => 'sections#update'
      delete '/sections/:section_id' => 'sections#delete'
      post '/sections' => 'sections#create'
      post '/sections/positions' => 'sections#set_positions'

      get '/lectures' => 'lectures#index'
      post '/lectures/:lecture_id/positions' => 'lectures#change_position'
      get '/lectures/:lecture_id' => 'lectures#show'
      put '/lectures/:lecture_id' => 'lectures#update'
      delete '/lectures/:lecture_id' => 'lectures#delete'
      post '/lectures' => 'lectures#create'
      post '/lectures/positions' => 'lectures#set_positions'

      get '/problems' => 'problems#index'
      get '/problems/:problem_id' => 'problems#show'
      put '/problems/:problem_id' => 'problems#update'
      delete '/problems/:problem_id' => 'problems#delete'
      post '/problems' => 'problems#create'
      post '/problems/positions' => 'problems#set_positions'
      put '/problems/:problem_id/problem_pdf' => 'problems#update_problem_pdf'

      get '/answers' => 'answers#index'
      get '/answers/:answer_id' => 'answers#show'
      put '/answers/:answer_id' => 'answers#update'
      delete '/answers/:answer_id' => 'answers#delete'
      post '/answers' => 'answers#create'
      put '/answers/:answer_id/explanation_video' => 'answers#update_explanation_video'
      put '/answers/:answer_id/explanation_body_pdf' => 'answers#update_explanation_body_pdf'

      get '/hints' => 'hints#index'
      post '/hints/:hint_id/positions' => 'hints#change_position'
      get '/hints/:hint_id' => 'hints#show'
      put '/hints/:hint_id' => 'hints#update'
      delete '/hints/:hint_id' => 'hints#delete'
      post '/hints' => 'hints#create'
      put '/hints/:hint_id/hint_video' => 'hints#update_hint_video'
      put '/hints/:hint_id/hint_body_pdf' => 'hints#update_hint_body_pdf'
      post '/hints/positions' => 'hints#set_positions'

      get '/attempts/' => 'attempts#get_all_attempts'
      get '/attempts/user' => 'attempts#get_all_user_attempt'
      get '/problems/:problem_id/attempts' => 'attempts#get_or_create'
      put '/attempts/:attempt_id/attempt_time' => 'attempts#update_time'
      get '/attempts/:attempt_id' => 'attempts#get_attempt'
      post '/attempts/:attempt_id/unlock_hint' => 'attempts#unlock_hint'
      post '/attempts/:attempt_id/unlock_answer' => 'attempts#unlock_answer'
      post '/attempts/:attempt_id/submissions' => 'attempts#create_submission'

      post '/doubt_threads/' => 'doubts#create_doubt_thread'
      put '/doubt_threads/:doubt_thread_id' => 'doubts#update_doubt_thread'
      delete '/doubt_threads/:doubt_thread_id' => 'doubts#delete_doubt_thread'
      get '/doubt_threads/admin' => 'doubts#admin_get_doubt_threads'
      get '/doubt_threads/notifications' => 'doubts#doubt_thread_notifications'
      get '/doubt_threads/notifications/admin' => 'doubts#doubt_thread_notifications_admin'
      post '/doubt_threads/replies/' => 'doubts#create_doubt_reply'
      get '/doubt_threads/:doubt_thread_id' => 'doubts#show_doubt_thread'


    end
  end
end
