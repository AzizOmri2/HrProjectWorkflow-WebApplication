# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_21_131106) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "applications", force: :cascade do |t|
    t.bigint "job_offer_id", null: false
    t.bigint "candidate_id", null: false
    t.string "cv_file"
    t.string "status"
    t.datetime "applied_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "cover_letter"
    t.index ["candidate_id"], name: "index_applications_on_candidate_id"
    t.index ["job_offer_id"], name: "index_applications_on_job_offer_id"
  end

  create_table "article_reactions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "article_id", null: false
    t.string "reaction", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_reactions_on_article_id"
    t.index ["user_id", "article_id"], name: "index_article_reactions_on_user_id_and_article_id", unique: true
    t.index ["user_id"], name: "index_article_reactions_on_user_id"
  end

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.bigint "author_id"
    t.string "image"
    t.integer "nb_likes", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "nb_dislikes", default: 0
    t.index ["author_id"], name: "index_articles_on_author_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "commenter_id"
    t.bigint "article_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_comments_on_article_id"
    t.index ["commenter_id"], name: "index_comments_on_commenter_id"
  end

  create_table "interview_feedbacks", force: :cascade do |t|
    t.bigint "interview_id", null: false
    t.bigint "user_id", null: false
    t.text "feedback"
    t.integer "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interview_id"], name: "index_interview_feedbacks_on_interview_id"
    t.index ["user_id"], name: "index_interview_feedbacks_on_user_id"
  end

  create_table "interviews", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.datetime "interview_date", null: false
    t.bigint "interviewer_id", null: false
    t.string "link"
    t.string "status"
    t.string "result"
    t.integer "duration"
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_interviews_on_application_id"
    t.index ["interviewer_id"], name: "index_interviews_on_interviewer_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "title"
    t.text "message"
    t.boolean "read"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "offers", force: :cascade do |t|
    t.string "title"
    t.string "department"
    t.text "skills_required"
    t.string "experience_level"
    t.date "deadline"
    t.integer "status", default: 0, null: false
    t.bigint "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.string "location"
    t.index ["created_by_id"], name: "index_offers_on_created_by_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.string "email"
    t.string "phone"
    t.json "skills"
    t.json "experience"
    t.json "education"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "cv_file"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.integer "role", default: 2
    t.string "image"
    t.boolean "active"
    t.integer "nbCnx", default: 0
    t.string "gender"
    t.date "birth_date"
    t.string "nationality"
    t.string "phone_number"
    t.index "lower((email)::text)", name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "applications", "offers", column: "job_offer_id"
  add_foreign_key "applications", "users", column: "candidate_id"
  add_foreign_key "article_reactions", "articles"
  add_foreign_key "article_reactions", "users"
  add_foreign_key "articles", "users", column: "author_id"
  add_foreign_key "comments", "articles"
  add_foreign_key "comments", "users", column: "commenter_id"
  add_foreign_key "interview_feedbacks", "interviews"
  add_foreign_key "interview_feedbacks", "users"
  add_foreign_key "interviews", "applications"
  add_foreign_key "interviews", "users", column: "interviewer_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "offers", "users", column: "created_by_id"
  add_foreign_key "profiles", "users"
end
