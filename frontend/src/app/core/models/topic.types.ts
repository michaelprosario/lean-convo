export type TopicStatus = 'Todo' | 'Active' | 'Done';

export interface Topic {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  status: TopicStatus;
  upvoteCount: number;
  proposedBy: string; // participant display name or ID
  upvotedBy: string[]; // array of participant IDs who voted
  createdAt?: string;
}

export interface TopicResponse {
  success: boolean;
  data?: Topic;
  message?: string;
  errorMessage?: string;
}

export interface TopicsListResponse {
  success: boolean;
  data?: Topic[];
  message?: string;
  errorMessage?: string;
}
