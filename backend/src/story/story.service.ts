import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity';
import { CreateSegmentDto, UpdateSegmentDto, SegmentResponseDto, StoryStructureDto, ChoiceDto, StoryDto, CreateStoryDto } from './story.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(StorySegment)
    private segmentRepository: Repository<StorySegment>,
  ) {}

  /**
   * Retrieves the count of stories.
   * @returns Promise<number> The number of stories
   */
  async getStoryCount(): Promise<number> {
    return this.storyRepository.count();
  }

  /**
   * Retrieves all stories.
   * @returns Promise<StoryDto[]> An array of all stories
   */
  async getAllStories(): Promise<StoryDto[]> {
    const stories = await this.storyRepository.find();
    return stories.map(story => this.mapStoryToDto(story));
  }

  async getStory(id: number): Promise<StoryDto> {
    const story = await this.storyRepository.findOne({ where: { id } });
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return this.mapStoryToDto(story);
  }

   /**
   * Creates a new story.
   * @param createStoryDto The data for creating a new story
   * @returns Promise<StoryDto> The created story
   * @throws BadRequestException if the story creation fails
   */
  async createStory(createStoryDto: CreateStoryDto): Promise<StoryDto> {
    try {
      const story = this.storyRepository.create(createStoryDto);
      const savedStory = await this.storyRepository.save(story);
      return this.mapStoryToDto(savedStory);
    } catch (error) {
      throw new BadRequestException('Failed to create story: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Retrieves the initial segment of the story. If no initial segment exists, creates one.
   * @returns Promise<SegmentResponseDto> The initial story segment
   */
  async getInitialSegment(storyId: number): Promise<SegmentResponseDto> {
    const initialSegment = await this.segmentRepository.findOne({ where: { story: { id: storyId }, isInitial: true } });
    if (!initialSegment) {
      throw new NotFoundException(`Initial segment for story with ID ${storyId} not found`);
    }
    return this.mapSegmentToDto(initialSegment);
  }

  /**
   * Retrieves a specific story segment by its ID.
   * @param id The ID of the segment to retrieve
   * @returns Promise<SegmentResponseDto> The requested story segment
   * @throws NotFoundException if the segment is not found
   */
  async getSegment(storyId: number, segmentId: number): Promise<SegmentResponseDto> {
    const segment = await this.segmentRepository.findOne({ where: { id: segmentId, story: { id: storyId } } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found in story with ID ${storyId}`);
    }
    return this.mapSegmentToDto(segment);
  }

  /**
   * Processes a user's choice and returns the next segment ID.
   * @param choiceId The ID of the choice made by the user
   * @returns Promise<{ nextSegmentId: number | null }> The ID of the next segment
   * @throws NotFoundException if the choice is not found
   */
  async processChoice(storyId: number, choiceId: number): Promise<{ nextSegmentId: number | null }> {
    const segment = await this.segmentRepository
      .createQueryBuilder('segment')
      .where('segment.story.id = :storyId', { storyId })
      .andWhere('segment.choices @> :choice', { choice: JSON.stringify([{ id: choiceId }]) })
      .getOne();

    if (!segment) {
      throw new NotFoundException(`Choice with ID ${choiceId} not found in story with ID ${storyId}`);
    }

    const choice = segment.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new NotFoundException(`Choice with ID ${choiceId} not found in segment`);
    }

    return { nextSegmentId: choice.nextSegmentId };
  }

  /**
   * Retrieves all story segments.
   * @returns Promise<SegmentResponseDto[]> An array of all story segments
   */
  async getAllSegments(storyId: number): Promise<SegmentResponseDto[]> {
    const segments = await this.segmentRepository.find({ where: { story: { id: storyId } } });
    return segments.map(segment => this.mapSegmentToDto(segment));
  }

  /**
   * Creates a new story segment.
   * @param createSegmentDto The data for creating a new segment
   * @returns Promise<SegmentResponseDto> The created story segment
   * @throws BadRequestException if the segment creation fails
   */
  async createSegment(storyId: number, createSegmentDto: CreateSegmentDto): Promise<SegmentResponseDto> {
    try {
      const story = await this.storyRepository.findOne({ where: { id: storyId } });
      if (!story) {
        throw new NotFoundException(`Story with ID ${storyId} not found`);
      }

      const segment = this.segmentRepository.create({
        ...createSegmentDto,
        story,
        choices: createSegmentDto.choices.map(choice => ({
          ...choice,
          id: choice.id === undefined ? null : choice.id,
          nextSegmentId: choice.nextSegmentId === undefined ? null : choice.nextSegmentId
        }))
      });
      const savedSegment = await this.segmentRepository.save(segment);
      return this.mapSegmentToDto(savedSegment);
    } catch (error) {
      throw new BadRequestException('Failed to create segment: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updateSegment(storyId: number, segmentId: number, updateSegmentDto: UpdateSegmentDto): Promise<SegmentResponseDto> {
    const segment = await this.segmentRepository.findOne({ where: { id: segmentId, story: { id: storyId } } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found in story with ID ${storyId}`);
    }

    const updatedSegment = {
      ...segment,
      ...updateSegmentDto,
      choices: updateSegmentDto.choices ? updateSegmentDto.choices.map(choice => ({
        ...choice,
        id: choice.id === undefined ? null : choice.id,
        nextSegmentId: choice.nextSegmentId === undefined ? null : choice.nextSegmentId
      })) : segment.choices
    };

    const savedSegment = await this.segmentRepository.save(updatedSegment);
    return this.mapSegmentToDto(savedSegment);
  }

  async deleteSegment(storyId: number, segmentId: number): Promise<void> {
    const result = await this.segmentRepository.delete({ id: segmentId, story: { id: storyId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found in story with ID ${storyId}`);
    }
  }

  async addChoice(storyId: number, segmentId: number, choiceDto: ChoiceDto): Promise<SegmentResponseDto> {
    const segment = await this.segmentRepository.findOne({ where: { id: segmentId, story: { id: storyId } } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found in story with ID ${storyId}`);
    }

    segment.choices.push({
      ...choiceDto,
      id: choiceDto.id === undefined ? null : choiceDto.id,
      nextSegmentId: choiceDto.nextSegmentId === undefined ? null : choiceDto.nextSegmentId
    });
    const updatedSegment = await this.segmentRepository.save(segment);
    return this.mapSegmentToDto(updatedSegment);
  }

  async removeChoice(storyId: number, segmentId: number, choiceId: number): Promise<SegmentResponseDto> {
    const segment = await this.segmentRepository.findOne({ where: { id: segmentId, story: { id: storyId } } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found in story with ID ${storyId}`);
    }

    segment.choices = segment.choices.filter(choice => choice.id !== choiceId);
    const updatedSegment = await this.segmentRepository.save(segment);
    return this.mapSegmentToDto(updatedSegment);
  }

  /**
   * Retrieves the entire story structure.
   * @returns Promise<StoryStructureDto> The story structure including all segments and choices
   */
  async getStoryStructure(storyId: number): Promise<StoryStructureDto> {
    const story = await this.storyRepository.findOne({ where: { id: storyId }, relations: ['segments'] });
    if (!story) {
      throw new NotFoundException(`Story with ID ${storyId} not found`);
    }
    return this.buildStoryStructure(story);
  }

  /**
   * Builds the story structure from the given segments.
   * @param segments An array of story segments
   * @returns StoryStructureDto The structured story object
   */
  private buildStoryStructure(story: Story): StoryStructureDto {
    return {
      title: story.title,
      segments: story.segments.map(segment => this.mapSegmentToDto(segment)),
    };
  }

  /**
   * Maps a StorySegment entity to a SegmentResponseDto.
   * @param segment The StorySegment entity to map
   * @returns SegmentResponseDto The mapped DTO
   */
  private mapSegmentToDto(segment: StorySegment): SegmentResponseDto {
    return {
      id: segment.id,
      title: segment.title,
      content: segment.content,
      choices: segment.choices,
      isInitial: segment.isInitial,
    };
  }

  /**
   * Maps a Story entity to a StoryDto.
   * @param story The Story entity to map
   * @returns StoryDto The mapped DTO
   */
  private mapStoryToDto(story: Story): StoryDto {
    return {
      id: story.id,
      title: story.title,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    };
  }
}
