import axios, { AxiosError } from 'axios';

import { Author } from '@/features/blog-demo/models/author/types/Author';
import { Post } from '@/features/blog-demo/models/post/types/Post';

import { IBlogDemoApi } from '../../features/blog-demo/IBlogDemoApi';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class BlogDemoApi implements IBlogDemoApi {
  private static instance: BlogDemoApi;

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): BlogDemoApi {
    if (!BlogDemoApi.instance) {
      BlogDemoApi.instance = new BlogDemoApi();
    }
    return BlogDemoApi.instance;
  }

  async getPosts(limit: number, start: number): Promise<Post[]> {
    try {
      const response = await axios.get<Post[]>(`${BASE_URL}/posts`, {
        params: { _limit: limit, _start: start },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch posts');
    }
  }

  async getAuthor(id: number): Promise<Author[]> {
    try {
      const response = await axios.get<Author[]>(`${BASE_URL}/users`, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to fetch author with ID ${id}`);
    }
  }

  private handleError(error: unknown, message: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        `${message}: ${axiosError.response?.data || axiosError.message}`
      );
    }
    throw new Error(message);
  }
}
