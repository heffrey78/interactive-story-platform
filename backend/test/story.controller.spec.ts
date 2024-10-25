import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from '../src/story/story.controller';
import { StoryService } from '../src/story/story.service';
import { CreateSegmentDto, UpdateSegmentDto, ChoiceDto, SegmentResponseDto, StoryDto, CreateStoryDto, StoryStructureDto } from '../src/story/story.dto';

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
            getStoryCount: jest.fn(),
            getAllStories: jest.fn(),
            getStory: jest.fn(),
            createStory: jest.fn(),
            getInitialSegment: jest.fn(),
            getSegment: jest.fn(),
            processChoice: jest.fn(),
            getAllSegments: jest.fn(),
            createSegment: jest.fn(),
            updateSegment: jest.fn(),
            deleteSegment: jest.fn(),
            addChoice: jest.fn(),
            removeChoice: jest.fn(),
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

  describe('getStoryCount', () => {
    it('should return the number of stories', async () => {
      const expectedCount = 5;
      jest.spyOn(service, 'getStoryCount').mockResolvedValue(expectedCount);

      const result = await controller.getStoryCount();

      expect(result).toEqual(expectedCount);
      expect(service.getStoryCount).toHaveBeenCalled();
    });
  });

  describe('startStory', () => {
    it('should return a redirect when no stories exist', async () => {
      jest.spyOn(service, 'getStoryCount').mockResolvedValue(0);

      const result = await controller.startStory();

      expect(result).toEqual({ redirect: '/create' });
      expect(service.getStoryCount).toHaveBeenCalled();
    });

    it('should return the initial segment when one story exists', async () => {
      const expectedResult: SegmentResponseDto = { id: 1, title: 'Initial', content: 'Initial segment', choices: [], isInitial: true };
      jest.spyOn(service, 'getStoryCount').mockResolvedValue(1);
      jest.spyOn(service, 'getAllStories').mockResolvedValue([{ id: 1, title: 'Story 1', createdAt: new Date(), updatedAt: new Date() }]);
      jest.spyOn(service, 'getInitialSegment').mockResolvedValue(expectedResult);

      const result = await controller.startStory();

      expect(result).toEqual(expectedResult);
      expect(service.getStoryCount).toHaveBeenCalled();
      expect(service.getAllStories).toHaveBeenCalled();
      expect(service.getInitialSegment).toHaveBeenCalledWith(1);
    });

    it('should return all stories when multiple stories exist', async () => {
      const expectedResult: StoryDto[] = [
        { id: 1, title: 'Story 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Story 2', createdAt: new Date(), updatedAt: new Date() },
      ];
      jest.spyOn(service, 'getStoryCount').mockResolvedValue(2);
      jest.spyOn(service, 'getAllStories').mockResolvedValue(expectedResult);

      const result = await controller.startStory();

      expect(result).toEqual(expectedResult);
      expect(service.getStoryCount).toHaveBeenCalled();
      expect(service.getAllStories).toHaveBeenCalled();
    });
  });

  describe('getAllStories', () => {
    it('should return all stories', async () => {
      const expectedResult: StoryDto[] = [
        { id: 1, title: 'Story 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'Story 2', createdAt: new Date(), updatedAt: new Date() },
      ];
      jest.spyOn(service, 'getAllStories').mockResolvedValue(expectedResult);

      const result = await controller.getAllStories();

      expect(result).toEqual(expectedResult);
      expect(service.getAllStories).toHaveBeenCalled();
    });
  });

  describe('getStory', () => {
    it('should return a specific story', async () => {
      const storyId = '1';
      const expectedResult: StoryDto = { id: 1, title: 'Story 1', createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(service, 'getStory').mockResolvedValue(expectedResult);

      const result = await controller.getStory(storyId);

      expect(result).toEqual(expectedResult);
      expect(service.getStory).toHaveBeenCalledWith(1);
    });
  });

  describe('createStory', () => {
    it('should create a new story', async () => {
      const createStoryDto: CreateStoryDto = { title: 'New Story' };
      const expectedResult: StoryDto = { id: 1, title: 'New Story', createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(service, 'createStory').mockResolvedValue(expectedResult);

      const result = await controller.createStory(createStoryDto);

      expect(result).toEqual(expectedResult);
      expect(service.createStory).toHaveBeenCalledWith(createStoryDto);
    });
  });

  describe('getSegment', () => {
    it('should return a specific segment', async () => {
      const storyId = '1';
      const segmentId = '1';
      const expectedResult: SegmentResponseDto = { id: 1, title: 'Segment 1', content: 'Content 1', choices: [], isInitial: false };
      jest.spyOn(service, 'getSegment').mockResolvedValue(expectedResult);

      const result = await controller.getSegment(storyId, segmentId);

      expect(result).toEqual(expectedResult);
      expect(service.getSegment).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('makeChoice', () => {
    it('should process a choice and return the next segment id', async () => {
      const storyId = '1';
      const choiceData: ChoiceDto = { id: 1, text: 'Test Choice', nextSegmentId: 2 };
      const expectedResult = { nextSegmentId: 2 };

      jest.spyOn(service, 'processChoice').mockResolvedValue(expectedResult);

      const result = await controller.makeChoice(storyId, choiceData);

      expect(result).toEqual(expectedResult);
      expect(service.processChoice).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('getAllSegments', () => {
    it('should return all segments for a story', async () => {
      const storyId = '1';
      const expectedResult: SegmentResponseDto[] = [
        { id: 1, title: 'Segment 1', content: 'Content 1', choices: [], isInitial: true },
        { id: 2, title: 'Segment 2', content: 'Content 2', choices: [], isInitial: false },
      ];

      jest.spyOn(service, 'getAllSegments').mockResolvedValue(expectedResult);

      const result = await controller.getAllSegments(storyId);

      expect(result).toEqual(expectedResult);
      expect(service.getAllSegments).toHaveBeenCalledWith(1);
    });
  });

  describe('createSegment', () => {
    it('should create a new segment', async () => {
      const storyId = '1';
      const createSegmentDto: CreateSegmentDto = { 
        title: 'New Segment', 
        content: 'New Content', 
        choices: [], 
        isInitial: false 
      };
      const expectedResult: SegmentResponseDto = { id: 3, ...createSegmentDto, isInitial: false };

      jest.spyOn(service, 'createSegment').mockResolvedValue(expectedResult);

      const result = await controller.createSegment(storyId, createSegmentDto);

      expect(result).toEqual(expectedResult);
      expect(service.createSegment).toHaveBeenCalledWith(1, createSegmentDto);
    });
  });

  describe('updateSegment', () => {
    it('should update an existing segment', async () => {
      const storyId = '1';
      const segmentId = '1';
      const updateSegmentDto: UpdateSegmentDto = { 
        title: 'Updated Segment', 
        content: 'Updated Content' 
      };
      const expectedResult: SegmentResponseDto = { 
        id: 1, 
        title: 'Updated Segment', 
        content: 'Updated Content', 
        choices: [], 
        isInitial: false 
      };

      jest.spyOn(service, 'updateSegment').mockResolvedValue(expectedResult);

      const result = await controller.updateSegment(storyId, segmentId, updateSegmentDto);

      expect(result).toEqual(expectedResult);
      expect(service.updateSegment).toHaveBeenCalledWith(1, 1, updateSegmentDto);
    });
  });

  describe('deleteSegment', () => {
    it('should delete a segment', async () => {
      const storyId = '1';
      const segmentId = '1';

      jest.spyOn(service, 'deleteSegment').mockResolvedValue(undefined);

      await controller.deleteSegment(storyId, segmentId);

      expect(service.deleteSegment).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('addChoice', () => {
    it('should add a choice to a segment', async () => {
      const storyId = '1';
      const segmentId = '1';
      const choiceDto: ChoiceDto = { id: 1, text: 'New Choice', nextSegmentId: 2 };
      const expectedResult: SegmentResponseDto = { 
        id: 1, 
        title: 'Test', 
        content: 'Test Content', 
        choices: [choiceDto], 
        isInitial: false 
      };

      jest.spyOn(service, 'addChoice').mockResolvedValue(expectedResult);

      const result = await controller.addChoice(storyId, segmentId, choiceDto);

      expect(result).toEqual(expectedResult);
      expect(service.addChoice).toHaveBeenCalledWith(1, 1, choiceDto);
    });
  });

  describe('removeChoice', () => {
    it('should remove a choice from a segment', async () => {
      const storyId = '1';
      const segmentId = '1';
      const choiceId = '1';
      const expectedResult: SegmentResponseDto = { 
        id: 1, 
        title: 'Test', 
        content: 'Test Content', 
        choices: [], 
        isInitial: false 
      };

      jest.spyOn(service, 'removeChoice').mockResolvedValue(expectedResult);

      const result = await controller.removeChoice(storyId, segmentId, choiceId);

      expect(result).toEqual(expectedResult);
      expect(service.removeChoice).toHaveBeenCalledWith(1, 1, 1);
    });
  });

  describe('getStoryStructure', () => {
    it('should return the story structure', async () => {
      const storyId = '1';
      const expectedResult: StoryStructureDto = {
        title: 'Test Story',
        segments: [
          { id: 1, title: 'Segment 1', content: 'Content 1', choices: [], isInitial: true },
          { id: 2, title: 'Segment 2', content: 'Content 2', choices: [], isInitial: false },
        ],
      };

      jest.spyOn(service, 'getStoryStructure').mockResolvedValue(expectedResult);

      const result = await controller.getStoryStructure(storyId);

      expect(result).toEqual(expectedResult);
      expect(service.getStoryStructure).toHaveBeenCalledWith(1);
    });
  });
});
