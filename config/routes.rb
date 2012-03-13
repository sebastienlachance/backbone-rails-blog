BackboneRailsBlog::Application.routes.draw do
  match "/:permalink" => 'posts#index'

  root :to => 'posts#index'

end
