export enum TopicStatus {
  Todo = 'Todo',
  Active = 'Active',
  Done = 'Done',
}

export class TopicEntity {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  proposedBy: string; // participantId
  upvoteCount: number;
  upvotedBy: string[]; // participantIds that have voted
  status: TopicStatus;
  createdAt: Date;

  constructor(partial: Partial<TopicEntity>) {
    Object.assign(this, partial);
  }
}
