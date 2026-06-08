import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ timestamps: true })
export class Participant {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  linkedInUrl: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
