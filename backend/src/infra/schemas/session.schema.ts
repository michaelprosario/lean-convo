import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  organizerId: string;

  @Prop({ required: true, unique: true })
  joinCode: string;

  @Prop({ default: '' })
  videoLink: string;

  @Prop({ required: true, default: 3 })
  maxUpvotesPerParticipant: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
