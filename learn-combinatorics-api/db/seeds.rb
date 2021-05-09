# frozen_string_literal: true
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

admin_user_uid = "yescQDqOM3MV7ef5VuG9uk6Dqcq2" # adminadmin@email.com adminadmin
public_user_uid = "RwCqFDrK4TWjN4E6KDjpyL6Zkkz2" #useruser@email.com useruser

chapters = []
for i in (0..2) do
  chapter = Chapter.create!(title: "Chapter #{i}")
  chapters.append(chapter)
end

lectures = []
chapters.each do |chapter|
  for i in (0..2) do
    lecture = chapter.lectures.create!(title: "#{chapter.title} lecture #{i}")
    lectures.append(lecture)
  end
end


problems = []
lectures.each do |lecture|
  for i in (0..1) do
    problem = lecture.problems.create!(title: "#{lecture.title} problem #{i}", body: "foo")
    problem.create_answer!(:explanation_body => "#{problem.title}'s answer'", :answer_value_denominator => 3, :answer_value_numerator => 7)
    problem.problem_pdf.attach(io: File.open('/Users/tandeningklement/Desktop/codes/free_lance/combinatorics/example_questions/example_question.pdf'), filename: 'example_question.pdf')
    problem.answer.explanation_body_pdf.attach(io: File.open('/Users/tandeningklement/Desktop/codes/free_lance/combinatorics/example_questions/example_question.pdf'), filename: 'example_question.pdf')
    problem.answer.explanation_video.attach(io: File.open('/Users/tandeningklement/Desktop/codes/free_lance/combinatorics/example_questions/sample video.mov'), filename: 'sample video.mov')
    problem.answer.save
    problem.save

    puts(problem.title)
    problems.append(problem)
  end
end

hints = []
problems.each do |problem|
  for i in (0..1) do
    hint = problem.hints.create!(title: "#{problem.title} hint #{i} title", body: "#{problem.title} hint #{i} body")
    hint.hint_body_pdf.attach(io: File.open('/Users/tandeningklement/Desktop/codes/free_lance/combinatorics/example_questions/example_question.pdf'), filename: 'example_question.pdf')
    hint.hint_video.attach(io: File.open('/Users/tandeningklement/Desktop/codes/free_lance/combinatorics/example_questions/sample video.mov'), filename: 'sample video.mov')
    hint.save
    puts(hint.title)
    hints.append(hint)
  end
end

# public user attempt first 2 problems

current_public_user_problem = Chapter.all.first.sections.first.lectures.first.problems.first

while current_public_user_problem.lecture.section.chapter.position != 1 do
  attempt = Attempt.create!(problem: current_public_user_problem, user_uid: public_user_uid, last_hint: current_public_user_problem.hints.first)
  doubt_thread = attempt.create_doubt_thread!(title: "#{current_public_user_problem.title} doubt thread", body: "#{current_public_user_problem.title} doubt body")
  doubt_thread.doubt_replies.create!(body: " #{doubt_thread.title} reply", user_uid: public_user_uid, read_by_admin: false, read_by_user: true)
end

