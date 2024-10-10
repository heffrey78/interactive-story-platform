import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Story } from './story.entity';

@Entity()
export class StorySegment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => Story, story => story.segments)
  story: Story;

  @ManyToOne(() => StorySegment, segment => segment.nextSegments)
  previousSegment: StorySegment;

  @OneToMany(() => StorySegment, segment => segment.previousSegment)
  nextSegments: StorySegment[];

  @Column('json')
  choices: { text: string; nextSegmentId: number }[];
}
