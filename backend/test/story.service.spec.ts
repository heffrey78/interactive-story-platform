import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryService } from '../src/story/story.service';
import { Story } from '../src/story/story.entity';
import { StorySegment } from '../src/story/story-segment.entity';

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

  describe('createStory', () => {
    it('should create a new story', async () => {
      const createStoryDto = { title: 'Test Story' };
      const story = { id: 1, ...createStoryDto };

      jest.spyOn(storyRepository, 'create').mockReturnValue(story as Story);
      jest.spyOn(storyRepository, 'save').mockResolvedValue(story as Story);

      const result = await service.createStory(createStoryDto);

      expect(result).toEqual(story);
      expect(storyRepository.create).toHaveBeenCalledWith(createStoryDto);
      expect(storyRepository.save).toHaveBeenCalledWith(story);
    });
  });

  // Add more test cases for other methods...
});
