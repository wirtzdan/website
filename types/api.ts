export interface AddSubscriberRequestBody {
  email?: string;
  referrer_url?: string;
}

export interface AddSubscriberResponseBody {
  error: string;
}

export interface SuggestionPayload {
  title: string;
  author: string;
  message?: string;
}

export interface SuggestionResponseBody {
  error?: string;
}
