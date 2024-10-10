import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story, StorySegment])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
