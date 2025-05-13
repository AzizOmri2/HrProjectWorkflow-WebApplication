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

ActiveRecord::Schema[8.0].define(version: 2025_05_12_231829) do
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
    t.index ["candidate_id"], name: "index_applications_on_candidate_id"
    t.index ["job_offer_id"], name: "index_applications_on_job_offer_id"
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
    t.index ["created_by_id"], name: "index_offers_on_created_by_id"
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
    t.index "lower((email)::text)", name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "applications", "offers", column: "job_offer_id"
  add_foreign_key "applications", "users", column: "candidate_id"
  add_foreign_key "interviews", "applications"
  add_foreign_key "interviews", "users", column: "interviewer_id"
  add_foreign_key "offers", "users", column: "created_by_id"
end
