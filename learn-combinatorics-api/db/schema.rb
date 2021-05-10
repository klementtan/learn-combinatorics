# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_05_090149) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "answers", force: :cascade do |t|
    t.bigint "problem_id", null: false
    t.integer "answer_value_numerator"
    t.integer "answer_value_denominator"
    t.text "explanation_body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["problem_id"], name: "index_answers_on_problem_id"
  end

  create_table "api_query_logs", force: :cascade do |t|
    t.string "controller"
    t.string "action"
    t.string "response"
    t.integer "status"
    t.string "params"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "attempts", force: :cascade do |t|
    t.bigint "problem_id", null: false
    t.string "user_uid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "last_hint_id"
    t.bigint "answer_id"
    t.integer "attempt_time", default: 0
    t.bigint "user_id"
    t.index ["answer_id"], name: "index_attempts_on_answer_id"
    t.index ["last_hint_id"], name: "index_attempts_on_last_hint_id"
    t.index ["problem_id"], name: "index_attempts_on_problem_id"
    t.index ["user_id"], name: "index_attempts_on_user_id"
  end

  create_table "chapters", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "position"
  end

  create_table "doubt_replies", force: :cascade do |t|
    t.text "body"
    t.string "user_uid"
    t.boolean "read_by_admin"
    t.boolean "read_by_user"
    t.bigint "doubt_thread_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["doubt_thread_id"], name: "index_doubt_replies_on_doubt_thread_id"
    t.index ["user_id"], name: "index_doubt_replies_on_user_id"
  end

  create_table "doubt_threads", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.string "user_uid"
    t.bigint "attempt_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.bigint "user_id"
    t.index ["attempt_id"], name: "index_doubt_threads_on_attempt_id"
    t.index ["user_id"], name: "index_doubt_threads_on_user_id"
  end

  create_table "hints", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.bigint "problem_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["problem_id"], name: "index_hints_on_problem_id"
  end

  create_table "lectures", force: :cascade do |t|
    t.string "title"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "chapter_id"
    t.index ["chapter_id"], name: "index_lectures_on_chapter_id"
  end

  create_table "otps", force: :cascade do |t|
    t.string "otp_value"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "email"
    t.index ["user_id"], name: "index_otps_on_user_id"
  end

  create_table "problems", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.integer "privilege_level"
    t.bigint "lecture_id", null: false
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "difficulty", default: 0
    t.index ["lecture_id"], name: "index_problems_on_lecture_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "submissions", force: :cascade do |t|
    t.bigint "attempt_id", null: false
    t.integer "submission_value_numerator"
    t.integer "submission_value_denominator"
    t.integer "status", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["attempt_id"], name: "index_submissions_on_attempt_id"
  end

  create_table "user_default_roles", force: :cascade do |t|
    t.string "user_email"
    t.string "role"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "primary_email"
    t.string "nus_email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "answers", "problems"
  add_foreign_key "attempts", "answers"
  add_foreign_key "attempts", "hints", column: "last_hint_id"
  add_foreign_key "attempts", "problems"
  add_foreign_key "doubt_replies", "doubt_threads"
  add_foreign_key "doubt_threads", "attempts"
  add_foreign_key "hints", "problems"
  add_foreign_key "otps", "users"
  add_foreign_key "problems", "lectures"
  add_foreign_key "submissions", "attempts"
end
