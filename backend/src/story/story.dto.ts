import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsBoolean, IsOptional, IsNumber, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStoryDto {
  @ApiProperty()
  @IsString()
  title: string;
}

export class ChoiceDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsNumber()
  id?: number | null;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsNumber()
  nextSegmentId?: number | null;
}

export class CreateSegmentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ChoiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInitial?: boolean;
}

export class UpdateSegmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ type: [ChoiceDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices?: ChoiceDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInitial?: boolean;
}

export class LinkSegmentsDto {
  @ApiProperty()
  @IsNumber()
  nextSegmentId: number;

  @ApiProperty()
  @IsString()
  choiceText: string;
}

export class SegmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [ChoiceDto] })
  choices: ChoiceDto[];

  @ApiProperty()
  isInitial: boolean;
}

export class StoryStructureDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: [SegmentResponseDto] })
  segments: SegmentResponseDto[];
}

export class StoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
