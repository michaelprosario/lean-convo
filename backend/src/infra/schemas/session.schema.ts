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

  // Backward compatibility for existing Mongo index/shareCode data.
  @Prop({ unique: true, sparse: true })
  shareCode?: string;

  @Prop({ default: '' })
  videoLink: string;

  @Prop({ required: true, default: 3 })
  maxUpvotesPerParticipant: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.pre('validate', function () {
  const doc = this as Session & { shareCode?: string };

  if (!doc.joinCode && doc.shareCode) {
    doc.joinCode = doc.shareCode;
  }

  if (!doc.shareCode && doc.joinCode) {
    doc.shareCode = doc.joinCode;
  }

});
