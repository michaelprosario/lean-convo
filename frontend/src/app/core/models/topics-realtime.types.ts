import { Topic, TopicStatus } from './topic.types';

export type SocketEnvelope<TPayload> = {
  requestId: string;
  payload: TPayload;
};

export type SocketAck<TData> = {
  requestId?: string;
  success: boolean;
  data?: TData;
  errorMessage?: string;
};

export type TopicsUpdatedEvent = {
  success: boolean;
  data?: Topic[];
  errorMessage?: string;
};

export type ProposeTopicPayload = {
  sessionId: string;
  participantId: string;
  title: string;
  description?: string;
};

export type UpvoteTopicPayload = {
  topicId: string;
  participantId: string;
};

export type EditTopicByParticipantPayload = {
  topicId: string;
  participantId: string;
  title: string;
  description?: string;
};

export type DeleteTopicByParticipantPayload = {
  topicId: string;
  participantId: string;
};

export type EditTopicByOrganizerPayload = {
  topicId: string;
  title: string;
  description?: string;
};

export type SetTopicStatusByOrganizerPayload = {
  topicId: string;
  status: TopicStatus;
};

export type DeleteTopicByOrganizerPayload = {
  topicId: string;
};
