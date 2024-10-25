import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Story } from './story.entity';

@Entity()
export class StorySegment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false, nullable: true })
  isInitial?: boolean;

  @ManyToOne(() => Story, story => story.segments)
  story: Story;

  @ManyToOne(() => StorySegment, segment => segment.nextSegments)
  previousSegment: StorySegment;

  @OneToMany(() => StorySegment, segment => segment.previousSegment)
  nextSegments: StorySegment[];

  @Column('json')
  choices: { id: number; text: string; nextSegmentId?: number | null }[];
}
