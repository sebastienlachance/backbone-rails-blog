class CommentsController < ApplicationController
  def index
    post = Post.where('permalink = ?', params[:permalink]).first();
    @comments = post.comments
    respond_to do |format|
      format.json { render json: @comments }
    end 
  end
end
