export class CreateStoryDto {
  title: string;
}

export class CreateSegmentDto {
  content: string;
}

export class LinkSegmentsDto {
  nextSegmentId: number;
  choiceText: string;
}
