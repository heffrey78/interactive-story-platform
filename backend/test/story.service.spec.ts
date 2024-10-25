import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryService } from '../src/story/story.service';
import { Story } from '../src/story/story.entity';
import { StorySegment } from '../src/story/story-segment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSegmentDto, UpdateSegmentDto, ChoiceDto, CreateStoryDto, StoryDto } from '../src/story/story.dto';

describe('StoryService', () => {
  let service: StoryService;
  let storyRepository: Repository<Story>;
  let segmentRepository: Repository<StorySegment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        {
          provide: getRepositoryToken(Story),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(StorySegment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StoryService>(StoryService);
    storyRepository = module.get<Repository<Story>>(getRepositoryToken(Story));
    segmentRepository = module.get<Repository<StorySegment>>(getRepositoryToken(StorySegment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStoryCount', () => {
    it('should return the number of stories', async () => {
      const expectedCount = 5;
      jest.spyOn(storyRepository, 'count').mockResolvedValue(expectedCount);

      const result = await service.getStoryCount();

      expect(result).toEqual(expectedCount);
      expect(storyRepository.count).toHaveBeenCalled();
    });
  });

  describe('getAllStories', () => {
    it('should return all stories', async () => {
      const stories: Story[] = [
        { id: 1, title: 'Story 1', segments: [], createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Story 2', segments: [], createdAt: new Date(), updatedAt: new Date() },
      ];
      jest.spyOn(storyRepository, 'find').mockResolvedValue(stories);

      const result = await service.getAllStories();

      expect(result).toEqual(stories.map(story => ({
        id: story.id,
        title: story.title,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      })));
      expect(storyRepository.find).toHaveBeenCalled();
    });
  });

  describe('getStory', () => {
    it('should return a story by id', async () => {
      const story: Story = { id: 1, title: 'Test Story', segments: [], createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(storyRepository, 'findOne').mockResolvedValue(story);

      const result = await service.getStory(1);

      expect(result).toEqual({
        id: story.id,
        title: story.title,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      });
      expect(storyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if story is not found', async () => {
      jest.spyOn(storyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getStory(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createStory', () => {
    it('should create a new story', async () => {
      const createStoryDto: CreateStoryDto = { title: 'New Story' };
      const newStory: Story = {
        id: 1,
        title: 'New Story',
        segments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(storyRepository, 'create').mockReturnValue(newStory);
      jest.spyOn(storyRepository, 'save').mockResolvedValue(newStory);

      const result = await service.createStory(createStoryDto);

      expect(result).toEqual({
        id: newStory.id,
        title: newStory.title,
        createdAt: newStory.createdAt,
        updatedAt: newStory.updatedAt,
      });
      expect(storyRepository.create).toHaveBeenCalledWith(createStoryDto);
      expect(storyRepository.save).toHaveBeenCalledWith(newStory);
    });

    it('should throw BadRequestException if story creation fails', async () => {
      const createStoryDto: CreateStoryDto = { title: 'New Story' };
      jest.spyOn(storyRepository, 'create').mockReturnValue({} as Story);
      jest.spyOn(storyRepository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(service.createStory(createStoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getInitialSegment', () => {
    it('should return the existing initial segment', async () => {
      const storyId = 1;
      const initialSegment: StorySegment = {
        id: 1,
        title: 'Initial',
        content: 'Initial segment',
        choices: [],
        isInitial: true,
        story: { id: storyId } as Story,
        previousSegment: null,
        nextSegments: []
      };
      jest.spyOn(segmentRepository, 'findOne').mockResolvedValue(initialSegment);

      const result = await service.getInitialSegment(storyId);

      expect(result).toEqual({
        id: initialSegment.id,
        title: initialSegment.title,
        content: initialSegment.content,
        choices: initialSegment.choices,
        isInitial: initialSegment.isInitial,
      });
      expect(segmentRepository.findOne).toHaveBeenCalledWith({ where: { story: { id: storyId }, isInitial: true } });
    });

    it('should throw NotFoundException if initial segment is not found', async () => {
      const storyId = 1;
      jest.spyOn(segmentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getInitialSegment(storyId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSegment', () => {
    it('should return a segment by id', async () => {
      const storyId = 1;
      const segmentId = 1;
      const segment: StorySegment = {
        id: segmentId,
        title: 'Test',
        content: 'Test segment',
        choices: [],
        isInitial: false,
        story: { id: storyId } as Story,
        previousSegment: null,
        nextSegments: []
      };
      jest.spyOn(segmentRepository, 'findOne').mockResolvedValue(segment);

      const result = await service.getSegment(storyId, segmentId);

      expect(result).toEqual({
        id: segment.id,
        title: segment.title,
        content: segment.content,
        choices: segment.choices,
        isInitial: segment.isInitial,
      });
      expect(segmentRepository.findOne).toHaveBeenCalledWith({ where: { id: segmentId, story: { id: storyId } } });
    });

    it('should throw NotFoundException if segment is not found', async () => {
      const storyId = 1;
      const segmentId = 1;
      jest.spyOn(segmentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getSegment(storyId, segmentId)).rejects.toThrow(NotFoundException);
    });
  });

  // Add more test cases for other methods (createSegment, updateSegment, deleteSegment, addChoice, removeChoice, getStoryStructure) following the same pattern

});
