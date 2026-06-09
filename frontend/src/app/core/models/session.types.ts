export interface Session {
  id: string;
  title: string;
  description?: string;
  videoLink?: string;
  joinCode: string;
  maxUpvotesPerParticipant: number;
  organizerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionResponse {
  success: boolean;
  data?: Session;
  message?: string;
  errorMessage?: string;
}

export interface SessionsListResponse {
  success: boolean;
  data?: Session[];
  message?: string;
  errorMessage?: string;
}

export interface ExportSessionResponse {
  success: boolean;
  data?: {
    session: Session;
    topics: any[];
    participants: any[];
  };
  message?: string;
  errorMessage?: string;
}
