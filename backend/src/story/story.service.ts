import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity';
import { CreateStoryDto, CreateSegmentDto, LinkSegmentsDto } from './story.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(StorySegment)
    private segmentRepository: Repository<StorySegment>,
  ) {}

  async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    const story = this.storyRepository.create(createStoryDto);
    return this.storyRepository.save(story);
  }

  async getStory(id: number): Promise<Story> {
    return this.storyRepository.findOne({ where: { id }, relations: ['segments'] });
  }

  async createSegment(storyId: number, createSegmentDto: CreateSegmentDto): Promise<StorySegment> {
    const story = await this.storyRepository.findOne({ where: { id: storyId } });
    const segment = this.segmentRepository.create({ ...createSegmentDto, story });
    return this.segmentRepository.save(segment);
  }

  async linkSegments(storyId: number, segmentId: number, linkSegmentsDto: LinkSegmentsDto): Promise<StorySegment> {
    const segment = await this.segmentRepository.findOne({ where: { id: segmentId, story: { id: storyId } } });
    const nextSegment = await this.segmentRepository.findOne({ where: { id: linkSegmentsDto.nextSegmentId, story: { id: storyId } } });
    
    segment.choices = segment.choices || [];
    segment.choices.push({ text: linkSegmentsDto.choiceText, nextSegmentId: nextSegment.id });
    
    return this.segmentRepository.save(segment);
  }

  async getStoryStructure(id: number): Promise<any> {
    const story = await this.storyRepository.findOne({ where: { id }, relations: ['segments'] });
    return this.buildStoryStructure(story);
  }

  private buildStoryStructure(story: Story): any {
    const structure = {
      id: story.id,
      title: story.title,
      segments: {},
    };

    for (const segment of story.segments) {
      structure.segments[segment.id] = {
        id: segment.id,
        content: segment.content,
        choices: segment.choices,
      };
    }

    return structure;
  }
}
