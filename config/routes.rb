BackboneRailsBlog::Application.routes.draw do

  #resource :posts
  match "/api/posts/:permalink" => 'posts#show'
  match "/api/posts/" => "posts#index"
  get "/api/posts/:permalink/comments" => 'comments#index'
  post "/api/posts/:permalink/comments" => 'comments#create'

  match "/:permalink" => "posts#index"

  root :to => 'posts#index'

end
