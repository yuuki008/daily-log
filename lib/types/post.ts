export type Post = {
  id: string;
  user_id: string;
  content: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
};
