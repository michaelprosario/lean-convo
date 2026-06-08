export interface Participant {
  id: string;
  sessionId: string;
  name: string;
  linkedInUrl?: string;
  remainingVotes?: number;
  joinedAt?: string;
}

export interface ParticipantResponse {
  success: boolean;
  data?: Participant;
  message?: string;
  errorMessage?: string;
}
