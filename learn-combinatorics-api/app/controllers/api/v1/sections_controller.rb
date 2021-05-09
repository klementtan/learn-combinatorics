# frozen_string_literal: true

# frozen_string_literal: true"

class Api::V1::SectionsController < Api::V1::BaseController
  def index
    authenticate(Roles::PUBLIC_USER)
    render json: Section.ordered_all, each_serializer: SectionSerializer, adapter: :json, root: 'sections'
  end

  def create
    authenticate(Roles::ADMIN)
    chapter = Chapter.find(params['chapter_id'])
    raise InvalidParamsError, 'Invallid chapter id' if chapter.nil?

    section = chapter.sections.create!(permitted_section_params)
    render json: section, serializer: SectionSerializer, adapter: :json
  end

  def show
    authenticate(Roles::PUBLIC_USER)
    section_id = params['section_id']
    raise InvalidParamsError, 'section_id missing' if section_id.nil?

    section = Section.find(section_id)
    render json: section, serializer: SectionSerializer, adapter: :json
  end

  def update
    authenticate(Roles::ADMIN)
    section_id = params['section_id']
    raise InvalidParamsError, 'section_id missing' if section_id.nil?

    section = Section.find(section_id)
    chapter = Chapter.find(params['chapter_id'])
    section.update!(permitted_section_params)
    section.save!
    if chapter != section.chapter
      section.chapter = chapter
      section.save!
    end
    section.reload

    render json: section, serializer: SectionSerializer, adapter: :json
  end

  def delete
    authenticate(Roles::ADMIN)
    section_id = params['section_id']
    raise InvalidParamsError, 'section_id missing' if section_id.nil?

    section = Section.find(section_id)
    section.remove_from_list
    section.destroy!
    render json: section, serializer: SectionSerializer, adapter: :json
  end

  def set_positions
    authenticate(Roles::ADMIN)
    chapter = Chapter.find(params['chapter_id'])
    sections = params.require(:sections)
    raise InvalidParamsError, "Enter all sections to set positions for chapter #{chapter.id}" if sections.length !=
                                                                                                 chapter.sections.length

    # Validate unique id and position combination
    section_id_arr = []
    section_position_arr = []

    sections.each do |sections_json|
      section_id = sections_json['section_id'].to_i
      section_position = sections_json['section_position'].to_i
      raise InvalidParamsError, "Duplicate section_id: #{section_id}" if section_id_arr.include? section_id
      if section_position_arr.include? section_position
        raise InvalidParamsError, "Duplicate section_position: #{section_position}"
      end

      section = Section.find(section_id)
      raise InvalidParamsError, "Section #{section_id} does not belong to #{chapter.id}" if chapter != section.chapter

      section_id_arr.append(section_id)
      section_position_arr.append(section_position)
    end

    sections.each do |sections_json|
      section_id = sections_json['section_id'].to_i
      section_position = sections_json['section_position'].to_i
      section = Section.find(section_id)
      raise InvalidParamsError, "Invalid section_id #{section_id}" if section.nil?

      section.insert_at(section_position)
    end
    render json: chapter.sections.all, each_serializer: SectionSerializer, adapter: :json
  end

  def permitted_section_params
    params.require(:section).permit(:title)
  end
end
