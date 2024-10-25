import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { CreateSegmentDto, UpdateSegmentDto, ChoiceDto, SegmentResponseDto, StoryStructureDto, StoryDto, CreateStoryDto } from './story.dto';

@ApiTags('story')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'Get story count' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the number of stories', type: Number })
  @Get('count')
  async getStoryCount(): Promise<number> {
    return this.storyService.getStoryCount();
  }

  @ApiOperation({ summary: 'Start a new story or get story list' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the initial story segment, redirects to create page, or returns story list', type: [StoryDto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No stories found' })
  @Get('start')
  async startStory(): Promise<SegmentResponseDto | StoryDto[] | { redirect: string }> {
    const storyCount = await this.storyService.getStoryCount();
    if (storyCount === 0) {
      return { redirect: '/create' };
    } else if (storyCount === 1) {
      const stories = await this.storyService.getAllStories();
      return this.storyService.getInitialSegment(stories[0].id);
    } else {
      return this.storyService.getAllStories();
    }
  }

  @ApiOperation({ summary: 'Get all stories' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns an array of all stories', type: [StoryDto] })
  @Get('all')
  async getAllStories(): Promise<StoryDto[]> {
    return this.storyService.getAllStories();
  }

  @ApiOperation({ summary: 'Get a specific story' })
  @ApiParam({ name: 'id', type: 'string', description: 'Story ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the requested story', type: StoryDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Story not found' })
  @Get(':id')
  async getStory(@Param('id') id: string): Promise<StoryDto> {
    return this.storyService.getStory(+id);
  }

  @ApiOperation({ summary: 'Create a new story' })
  @ApiBody({ type: CreateStoryDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns the created story', type: StoryDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @Post()
  async createStory(@Body(ValidationPipe) createStoryDto: CreateStoryDto): Promise<StoryDto> {
    return this.storyService.createStory(createStoryDto);
  }

  @ApiOperation({ summary: 'Get a specific story segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiParam({ name: 'segmentId', type: 'string', description: 'Segment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the requested story segment', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Segment not found' })
  @Get(':storyId/segment/:segmentId')
  async getSegment(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string
  ): Promise<SegmentResponseDto> {
    return this.storyService.getSegment(+storyId, +segmentId);
  }

  @ApiOperation({ summary: 'Make a choice in the story' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiBody({ type: ChoiceDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the next segment ID', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Choice not found' })
  @Post(':storyId/choice')
  async makeChoice(
    @Param('storyId') storyId: string,
    @Body(ValidationPipe) choiceData: ChoiceDto
  ): Promise<{ nextSegmentId: number }> {
    return this.storyService.processChoice(+storyId, choiceData.id);
  }

  @ApiOperation({ summary: 'Get all story segments' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns an array of all story segments', type: [SegmentResponseDto] })
  @Get(':storyId/segments')
  async getAllSegments(@Param('storyId') storyId: string): Promise<SegmentResponseDto[]> {
    return this.storyService.getAllSegments(+storyId);
  }

  @ApiOperation({ summary: 'Create a new story segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiBody({ type: CreateSegmentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns the created story segment', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @Post(':storyId/segment')
  async createSegment(
    @Param('storyId') storyId: string,
    @Body(ValidationPipe) createSegmentDto: CreateSegmentDto
  ): Promise<SegmentResponseDto> {
    return this.storyService.createSegment(+storyId, createSegmentDto);
  }

  @ApiOperation({ summary: 'Update an existing story segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiParam({ name: 'segmentId', type: 'string', description: 'Segment ID' })
  @ApiBody({ type: UpdateSegmentDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the updated story segment', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Segment not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @Put(':storyId/segment/:segmentId')
  async updateSegment(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string,
    @Body(ValidationPipe) updateSegmentDto: UpdateSegmentDto
  ): Promise<SegmentResponseDto> {
    return this.storyService.updateSegment(+storyId, +segmentId, updateSegmentDto);
  }

  @ApiOperation({ summary: 'Delete a story segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiParam({ name: 'segmentId', type: 'string', description: 'Segment ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Segment successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Segment not found' })
  @Delete(':storyId/segment/:segmentId')
  async deleteSegment(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string
  ): Promise<void> {
    return this.storyService.deleteSegment(+storyId, +segmentId);
  }

  @ApiOperation({ summary: 'Add a choice to a segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiParam({ name: 'segmentId', type: 'string', description: 'Segment ID' })
  @ApiBody({ type: ChoiceDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the updated story segment', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Segment not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @Post(':storyId/segment/:segmentId/choice')
  async addChoice(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string,
    @Body(ValidationPipe) choiceDto: ChoiceDto
  ): Promise<SegmentResponseDto> {
    return this.storyService.addChoice(+storyId, +segmentId, choiceDto);
  }

  @ApiOperation({ summary: 'Remove a choice from a segment' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiParam({ name: 'segmentId', type: 'string', description: 'Segment ID' })
  @ApiParam({ name: 'choiceId', type: 'string', description: 'Choice ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the updated story segment', type: SegmentResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Segment or choice not found' })
  @Delete(':storyId/segment/:segmentId/choice/:choiceId')
  async removeChoice(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string,
    @Param('choiceId') choiceId: string
  ): Promise<SegmentResponseDto> {
    return this.storyService.removeChoice(+storyId, +segmentId, +choiceId);
  }

  @ApiOperation({ summary: 'Get the entire story structure' })
  @ApiParam({ name: 'storyId', type: 'string', description: 'Story ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the story structure including all segments and choices', type: StoryStructureDto })
  @Get(':storyId/structure')
  async getStoryStructure(@Param('storyId') storyId: string): Promise<StoryStructureDto> {
    return this.storyService.getStoryStructure(+storyId);
  }
}
