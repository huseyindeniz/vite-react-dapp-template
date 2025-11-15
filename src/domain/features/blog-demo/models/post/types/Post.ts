export interface Post {
  id: number;
  userId: number; // Reference to Author
  title: string;
  body: string;
  image: string; // Post cover image URL
  category: string; // Post category (Technology, React, etc.)
  postedAt: string; // Human-readable timestamp (e.g., "34 minutes ago")
  author: {
    // Embedded author summary for display
    name: string;
    avatar: string;
  };
}
