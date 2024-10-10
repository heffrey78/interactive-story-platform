import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto, CreateSegmentDto, LinkSegmentsDto } from './story.dto';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    return this.storyService.createStory(createStoryDto);
  }

  @Get(':id')
  async getStory(@Param('id') id: string) {
    return this.storyService.getStory(+id);
  }

  @Post(':id/segments')
  async createSegment(@Param('id') id: string, @Body() createSegmentDto: CreateSegmentDto) {
    return this.storyService.createSegment(+id, createSegmentDto);
  }

  @Put(':id/segments/:segmentId/link')
  async linkSegments(@Param('id') id: string, @Param('segmentId') segmentId: string, @Body() linkSegmentsDto: LinkSegmentsDto) {
    return this.storyService.linkSegments(+id, +segmentId, linkSegmentsDto);
  }

  @Get(':id/structure')
  async getStoryStructure(@Param('id') id: string) {
    return this.storyService.getStoryStructure(+id);
  }
}
