# frozen_string_literal: true

class Api::V1::LecturesController < Api::V1::BaseController
  def index
    google_authenticate(Roles::PUBLIC_USER)
    render json: Lecture.ordered_all, each_serializer: LectureSerializer, adapter: :json, root: 'lectures'
  end

  def create
    google_authenticate(Roles::ADMIN)
    chapter = Chapter.find(params['chapter_id'])
    raise InvalidParamsError, 'Invalid chapter_id id' if chapter.nil?

    lecture = chapter.lectures.create!(permitted_lecture_params)
    render json: lecture, serializer: LectureSerializer, adapter: :json
  end

  def show
    google_authenticate(Roles::PUBLIC_USER)
    lecture_id = params['lecture_id']
    raise InvalidParamsError, 'lecture_id missing' if lecture_id.nil?

    lecture = Lecture.find(lecture_id)
    render json: lecture, serializer: LectureSerializer, adapter: :json
  end

  def update
    google_authenticate(Roles::ADMIN)
    lecture_id = params['lecture_id']
    raise InvalidParamsError, 'lecture_id missing' if lecture_id.nil?

    lecture = Lecture.find(lecture_id)
    chapter = Chapter.find(params['chapter_id'])
    lecture.update!(permitted_lecture_params)
    lecture.save!
    if chapter != lecture.chapter
      lecture.chapter = chapter
      lecture.save!
    end
    lecture.reload

    render json: lecture, serializer: LectureSerializer, adapter: :json
  end

  def delete
    google_authenticate(Roles::ADMIN)
    lecture_id = params['lecture_id']
    raise InvalidParamsError, 'lecture_id missing' if lecture_id.nil?

    lecture = Lecture.find(lecture_id)
    lecture.remove_from_list
    lecture.destroy!
    render json: lecture, serializer: LectureSerializer, adapter: :json
  end

  def change_position
    google_authenticate(Roles::ADMIN)
    lecture = Lecture.find(params['lecture_id'])
    delta = params.require(:delta)
    if delta > 0
      lecture.move_higher
    elsif delta < 0
      lecture.move_lower
    end
    lecture.save
    render json: Lecture.all, each_serializer: LectureSerializer, adapter: :json, root: 'lectures'
  end
  def permitted_lecture_params
    params.require(:lecture).permit(:title)
  end
end
