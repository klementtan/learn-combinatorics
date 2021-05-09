# frozen_string_literal: true

class Api::V1::ChaptersController < Api::V1::BaseController
  def index
    google_authenticate(Roles::PUBLIC_USER)
    render json: Chapter.all, each_serializer: ChapterSerializer, adapter: :json, root: 'chapters'
  end

  def create
    google_authenticate(Roles::ADMIN)
    chapter = Chapter.create!(permitted_chapter_params)
    render json: chapter, serializer: ChapterSerializer, adapter: :json
  end

  def show
    google_authenticate(Roles::PUBLIC_USER)
    chapter_id = params['chapter_id']
    raise InvalidParamsError, 'chapter_id missing' if chapter_id.nil?

    chapter = Chapter.find(chapter_id)
    render json: chapter, serializer: ChapterSerializer, adapter: :json
  end

  def update
    google_authenticate(Roles::ADMIN)
    chapter_id = params['chapter_id']
    raise InvalidParamsError, 'chapter_id missing' if chapter_id.nil?

    chapter = Chapter.find(chapter_id)
    chapter.update(permitted_chapter_params)
    render json: chapter, serializer: ChapterSerializer, adapter: :json
  end

  def delete
    google_authenticate(Roles::ADMIN)
    chapter_id = params['chapter_id']
    raise InvalidParamsError, 'chapter_id missing' if chapter_id.nil?

    chapter = Chapter.find(chapter_id)
    chapter.remove_from_list
    chapter.destroy!
    render json: chapter, serializer: ChapterSerializer, adapter: :json
  end

  def change_position
    google_authenticate(Roles::ADMIN)
    chapter = Chapter.find(params['chapter_id'])
    delta = params.require(:delta)
    if delta > 0
      chapter.move_higher
    elsif delta < 0
      chapter.move_lower
    end
    chapter.save
    render json: Chapter.all, each_serializer: ChapterSerializer, adapter: :json, root: 'chapters'
  end

  def permitted_chapter_params
    params.require(:chapter).permit(:title)
  end
end
