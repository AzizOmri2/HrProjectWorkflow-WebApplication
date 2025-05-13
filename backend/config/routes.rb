Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'sessions',
    registrations: 'registrations'
  }
  
  resources :protected, only: [:index]

  # Get All Users
  get 'users/list', to: 'user#index'

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
  resources :applications
  get 'applications/by_candidate/:id', to: 'applications#by_candidate'
  get 'applications/by_offer/:id', to: 'applications#by_offer'
  

  root 'user#index'
  
end