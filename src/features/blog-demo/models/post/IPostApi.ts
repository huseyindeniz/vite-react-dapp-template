import { Post } from './types/Post';

export interface IPostApi {
  getPosts: (limit: number, start: number) => Promise<Post[]>;
}
