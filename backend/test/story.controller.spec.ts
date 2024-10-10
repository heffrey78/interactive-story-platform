import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from '../src/story/story.controller';
import { StoryService } from '../src/story/story.service';
import { CreateStoryDto, CreateSegmentDto, LinkSegmentsDto } from '../src/story/story.dto';

describe('StoryController', () => {
  let controller: StoryController;
  let service: StoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [
        {
          provide: StoryService,
          useValue: {
            createStory: jest.fn(),
            getStory: jest.fn(),
            createSegment: jest.fn(),
            linkSegments: jest.fn(),
            getStoryStructure: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoryController>(StoryController);
    service = module.get<StoryService>(StoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStory', () => {
    it('should create a new story', async () => {
      const createStoryDto: CreateStoryDto = { title: 'Test Story' };
      const expectedResult = { id: 1, ...createStoryDto };

      jest.spyOn(service, 'createStory').mockResolvedValue(expectedResult as any);

      const result = await controller.createStory(createStoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.createStory).toHaveBeenCalledWith(createStoryDto);
    });
  });

  describe('getStory', () => {
    it('should return a story by id', async () => {
      const storyId = '1';
      const expectedResult = { id: 1, title: 'Test Story' };

      jest.spyOn(service, 'getStory').mockResolvedValue(expectedResult as any);

      const result = await controller.getStory(storyId);

      expect(result).toEqual(expectedResult);
      expect(service.getStory).toHaveBeenCalledWith(1);
    });
  });

  describe('createSegment', () => {
    it('should create a new segment for a story', async () => {
      const storyId = '1';
      const createSegmentDto: CreateSegmentDto = { content: 'Test Segment' };
      const expectedResult = { id: 1, ...createSegmentDto };

      jest.spyOn(service, 'createSegment').mockResolvedValue(expectedResult as any);

      const result = await controller.createSegment(storyId, createSegmentDto);

      expect(result).toEqual(expectedResult);
      expect(service.createSegment).toHaveBeenCalledWith(1, createSegmentDto);
    });
  });

  describe('linkSegments', () => {
    it('should link two segments', async () => {
      const storyId = '1';
      const segmentId = '1';
      const linkSegmentsDto: LinkSegmentsDto = { nextSegmentId: 2, choiceText: 'Go to next segment' };
      const expectedResult = { id: 1, choices: [{ text: 'Go to next segment', nextSegmentId: 2 }] };

      jest.spyOn(service, 'linkSegments').mockResolvedValue(expectedResult as any);

      const result = await controller.linkSegments(storyId, segmentId, linkSegmentsDto);

      expect(result).toEqual(expectedResult);
      expect(service.linkSegments).toHaveBeenCalledWith(1, 1, linkSegmentsDto);
    });
  });

  describe('getStoryStructure', () => {
    it('should return the story structure', async () => {
      const storyId = '1';
      const expectedResult = {
        id: 1,
        title: 'Test Story',
        segments: {
          1: { id: 1, content: 'Segment 1', choices: [] },
          2: { id: 2, content: 'Segment 2', choices: [] },
        },
      };

      jest.spyOn(service, 'getStoryStructure').mockResolvedValue(expectedResult as any);

      const result = await controller.getStoryStructure(storyId);

      expect(result).toEqual(expectedResult);
      expect(service.getStoryStructure).toHaveBeenCalledWith(1);
    });
  });
});
