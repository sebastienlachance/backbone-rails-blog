BackboneRailsBlog::Application.routes.draw do

  #resource :posts
  match "/posts" => "posts#index"
  match "/posts/:permalink" => 'posts#show'

  root :to => 'posts#index'

end
