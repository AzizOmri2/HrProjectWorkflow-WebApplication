Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'sessions',
    registrations: 'registrations'
  }
  
  resources :protected, only: [:index]

  # List all users
  get 'users/list', to: 'user#index'

  # Toggle active status (Ban or Unban)
  patch 'users/:id/toggle_active', to: 'user#toggle_active', as: 'toggle_user_active'

  # Add this line to enable show (GET) route for fetching user details by ID  
  get 'users/:id/show', to: 'user#show', as: 'user'

  # Add this line to enable update (PATCH or PUT)
  patch 'users/:id/update', to: 'user#update'
  put 'users/:id/update', to: 'user#update' # optional, allows PUT as well

  root 'user#index'
  
end