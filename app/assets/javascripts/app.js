
_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};


  var Post = Backbone.Model.extend({
    defaults: {
      'title' : '' ,
      'body' : '' ,
      'created_at': Date.now()
    } 
  });

  var PostList = Backbone.Collection.extend({
    model: Post,
    url: '/posts'
  });

  var Posts = new PostList();

  var PostView = Backbone.View.extend({
    
    template: _.template($('#post_template').html()),

    events : {
      "click a.permalink" : 'linkClicked'
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    linkClicked: function(event) {
      event.preventDefault();
      //this doesn't feel right
      blog.navigate(this.model.get('permalink'), true);
    }

  });

  var BlogView = Backbone.View.extend({
  
    initialize: function() {
      Posts.bind('add', this.display, this); //not required but useful for testing
      Posts.bind('reset', this.displayAll, this);
      Posts.fetch();
    },

    display: function(post) {
      var view = new PostView({model: post});         
      $('#blog').append(view.render().el);
    },

    displayAll: function() {
      Posts.each(this.display);             
    }

  });



  var Blog = Backbone.Router.extend({

    routes: {
      "": "index",
      ":permalink": "post"
    },

    index: function() {
       var view = new BlogView();
    },

    post: function(permalink) {
       Posts.get(1);
    }

  });

$(function() {

  window.blog = new Blog();

  Backbone.history.start({pushState: true});

  var post = new Post({ 'title': 'test', 'body' : 'body', 'permalink': 'test'}); 
  Posts.add(post);

});