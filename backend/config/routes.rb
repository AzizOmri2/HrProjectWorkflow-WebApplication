Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'sessions',
    registrations: 'registrations',
    passwords: 'passwords'
  }
  

  resources :protected, only: [:index]

  # Get All Users
  get 'users/list', to: 'user#index'

  # Get All HR
  get 'users/list/hr', to: 'user#hr_users'

  # Toggle active status (Ban or Unban)
  patch 'users/:id/toggle_active', to: 'user#toggle_active', as: 'toggle_user_active'

  # Show User Details by ID  
  get 'users/:id/show', to: 'user#show', as: 'user'

  # Update User (PATCH or PUT)
  patch 'users/:id/update', to: 'user#update'
  put 'users/:id/update', to: 'user#update' # optional, allows PUT as well

  # Delete User
  delete 'users/:id/delete', to: 'user#destroy', as: 'delete_user'

  # Password Change
  put '/users/update_password', to: 'user#update_password'

  # Offers Full CRUD
  resources :offers

  # Applications Full CRUD
  get 'applications/not_withdrawn', to: 'applications#not_withdrawn'
  resources :applications
  put 'applications/:id/withdraw', to: 'applications#withdraw'
  get 'applications/by_candidate/:id', to: 'applications#by_candidate'
  get 'applications/by_offer/:id', to: 'applications#by_offer'
  get 'applications/:id/download_pdf', to: 'applications#download_pdf', as: 'download_pdf'


  # Interviews Full CRUD
  resources :interviews
  put 'interviews/:id/accept', to: 'interviews#validate_interview_accept'
  put 'interviews/:id/reject', to: 'interviews#validate_interview_reject'

  # Notifications
  get 'users/:user_id/notifications', to: 'notifications#index'
  get 'users/:user_id/notifications/unread', to: 'notifications#unread'
  patch 'users/:user_id/notifications/mark-all-read' , to: 'notifications#mark_all_read'
  delete 'users/:user_id/notifications/:id', to: 'notifications#destroy'


  # Interview_Feedbacks
  resources :interview_feedbacks
  get 'interview_feedbacks/:interview_id/interview_feedback', to: 'interview_feedbacks#get_feedbacks_by_interview_id'
  get 'interviews/by_user/:user_id', to: 'interviews#by_user'


  # Articles and ArticleReactions Full CRUD
  resources :articles do
    resource :article_reaction, only: [] do
      get :user_reaction
      post :like
      post :unlike
      post :dislike
      post :undislike
    end
  end
  

  # Comments Full CRUD
  resources :comments
  get 'comments/:article_id/by_id_article', to: 'comments#comments_by_article'
  

  # Reports
  get '/reports/funnel', to: 'reports#funnel'
  get '/reports/time_to_hire', to: 'reports#time_to_hire'
  get '/reports/diversity', to: 'reports#diversity'


  # Upload CV For Profile Generating
  post 'cv_parser/upload', to: 'cv_parser#upload'
  # Show the profile details
  get 'cv_parser/profile', to: 'cv_parser#show'
  
  root 'user#index'
  
end