import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  proposedBy: string; // participantId

  @Prop({ default: 0 })
  upvoteCount: number;

  @Prop({ type: [String], default: [] })
  upvotedBy: string[];

  @Prop({ default: 'Todo' })
  status: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
