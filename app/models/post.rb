class Post < ActiveRecord::Base
  before_create :generate_permalink

  has_many :comments

  def generate_permalink
    self.permalink = title.parameterize 
    return true
  end

end
