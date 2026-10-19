export interface AddSubscriberRequestBody {
  email?: string;
  referrer_url?: string;
  /** Honeypot. Humans leave this empty. */
  company_website?: string;
}

export interface AddSubscriberResponseBody {
  error: string;
}

export interface SuggestionPayload {
  title: string;
  author: string;
  message?: string;
  /** Honeypot. Humans leave this empty. */
  company_website?: string;
}

export interface SuggestionResponseBody {
  error?: string;
}
