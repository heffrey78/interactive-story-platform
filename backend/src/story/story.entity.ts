import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StorySegment } from './story-segment.entity';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => StorySegment, segment => segment.story)
  segments: StorySegment[];
}
