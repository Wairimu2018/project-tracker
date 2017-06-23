# == Schema Information
#
# Table name: projects
#
#  id         :integer          not null, primary key
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Project < ApplicationRecord
  validates :title, presence: true

  has_many :memberships, dependent: :destroy

  has_many :members,
    through: :memberships,
    source: :user

  has_many :ownerships, -> { owned }, class_name: 'Membership'
  has_many :owners, through: :ownerships, source: :user

  has_many :stories
end
