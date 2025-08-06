# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end




# Adding an admin if it doesn't exists

admin_email = "admin@example.com"
admin_password = "123456"
admin_default_image = "uploads/profile_pictures/default.jpg"

# Check if the admin already exists
unless User.exists?(email: admin_email)
  admin = User.new(
    name: "Super Admin",
    email: admin_email,
    password: admin_password,
    password_confirmation: admin_password,
    role: :admin,         # using enum
    image: admin_default_image, # default image
    active: true,
    nbCnx: 0,
    gender: "",     
    nationality: ""
  )

  if admin.save
    puts "✅ Admin user created with email: #{admin_email}"
  else
    puts "❌ Failed to create admin: #{admin.errors.full_messages.join(', ')}"
  end
else
  puts "⚠️ Admin user already exists with email: #{admin_email}"
end
