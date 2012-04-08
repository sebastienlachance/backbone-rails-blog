
_.templateSettings = {
  interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};

function formatDate(datetime) {
    var dateObj = new Date(datetime);
    var dateStr = (dateObj.getMonth()+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
    return dateStr; // will return mm/dd/yyyy
}

var Comment = Backbone.Model.extend({
  url: function() {
         return  "/api/posts/" + this.post_permalink + '/comments';
  },
  
  toJSON: function() {
    return { comment: _.clone( this.attributes ) }
  },
    
});

var Comments = Backbone.Collection.extend({
  model: Comment,
  url: function() {
    console.log(this);
    return "/api/posts/" + this.post_permalink + "/comments";     
  }
});

var CommentView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#comment_template').html()),
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

var CommentsView = Backbone.View.extend({

  tagName: 'ul',
  
  initialize: function() {
     _.bindAll(this, 'addComment');            
     this.collection.on("add", this.addComment);
  },

  render: function() {
    this.collection.each(this.addComment);
    return this;      
  },

  addComment: function(comment) {
      var view = new CommentView({model: comment});
      $(this.el).append(view.render().el);
  }

});

var AddCommentView = Backbone.View.extend({

  template: _.template($('#add_comment_template').html()),

  events: {
    "click #submit" : "addComment"
  },

  initialize: function() {
     _.bindAll(this, 'addCommentToComments');            
  },

  render: function() {
    $(this.el).html(this.template());
    return this;
  },

  addComment: function() {
    var comment = new Comment();
    comment.set('email', $(this.el).find('#email').val());
    comment.set('name', $(this.el).find('#name').val());
    comment.set('comment', $(this.el).find('#comment').val());
    comment.post_permalink = this.post.get('permalink');
    var self = this;
    comment.save(null, {success: function(comment) {
      self.addCommentToComments(comment);
    }});
  },

  addCommentToComments: function(comment) {
     console.log('rendu ici');
     console.log(this.comments);
     this.comments.add(comment);
     console.log(this.comments);
  }

})


var Post = Backbone.Model.extend({
  defaults: {
    'title' : '' ,
    'body' : '' ,
    'created_at': Date.now(),
    'permalink': ''
  } ,
  url: function() {
     return "/api/posts/" + this.get('permalink');
  },
});

var PostList = Backbone.Collection.extend({
  model: Post,
  url: '/api/posts'
});


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


var Posts = new PostList();

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

  post: function(permalink_received) {
     var p = new Post();
     p.set('permalink',permalink_received);
     p.fetch({success: function(model, response) {
       var view = new PostView({model: model});
       $('#blog').html(view.render().el);

       var comments = new Comments();
       comments.post_permalink = model.get('permalink');
       comments.fetch({success: function(comments, response){
         var commentsView = new CommentsView({collection: comments});
         console.log('comments');
         console.log(commentsView.render().el);
         $('#blog').append(commentsView.render().el);

         var addCommentView = new AddCommentView();
         addCommentView.post = p;
         addCommentView.comments = comments;
         
         $('#blog').append(addCommentView.render().el);

       }});

     }});

  }

});



$(function() {

  window.blog = new Blog();

  Backbone.history.start({pushState: true});

});
