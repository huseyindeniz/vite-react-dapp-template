import { Post } from '../types/Post';

export interface IPostApi {
  getPosts: (language: string, limit: number, start: number) => Promise<Post[]>;
  getPost: (id: number) => Promise<Post>;
}
