class CommentsController < ApplicationController
  before_filter :get_post
  def index
    @comments = @post.comments
    respond_to do |format|
      format.json { render json: @comments }
    end 
  end

  def create
    comment = @post.comments.new(params[:comment]);
    comment.save!

    render json: comment 
  end

  private 

  def get_post
    @post = Post.where('permalink = ?', params[:permalink]).first();
  end

end
