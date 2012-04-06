BackboneRailsBlog::Application.routes.draw do

  #resource :posts
  match "/api/posts/:permalink" => 'posts#show'
  match "/api/posts/" => "posts#index"
  match "/api/posts/:permalink/comments" => 'comments#index'

  match "/:permalink" => "posts#index"

  root :to => 'posts#index'

end
