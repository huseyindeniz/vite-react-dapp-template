export interface Post {
  id: number;
  userId: number; // Reference to Author
  title: string;
  body: string;
}
