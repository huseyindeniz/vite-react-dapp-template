import log from 'loglevel';

import { IHttpService } from '@/core/features/app/types/IHttpService';
import { IBlogDemoApi } from '@/domain/features/blog-demo/interfaces/IBlogDemoApi';
import { Author } from '@/domain/features/blog-demo/models/author/types/Author';
import { Post } from '@/domain/features/blog-demo/models/post/types/Post';

// Data enrichment - mapping post IDs to additional display data
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80',
];

const POST_CATEGORIES = [
  'Technology',
  'Web Development',
  'React',
  'TypeScript',
  'Tutorial',
];

const AUTHOR_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
];

const AUTHOR_NAMES = [
  'Sarah Chen',
  'Alex Rivera',
  'Jordan Kim',
  'Morgan Lee',
  'Casey Park',
];

export class BlogDemoApi implements IBlogDemoApi {
  constructor(private http: IHttpService) {}

  async getPosts(
    language: string,
    limit: number,
    start: number
  ): Promise<Post[]> {
    try {
      log.debug(
        `Fetching posts for language: ${language}, limit: ${limit}, start: ${start}`
      );
      const response = await this.http.get<
        Omit<Post, 'image' | 'category' | 'postedAt' | 'author'>[]
      >('/posts', {
        params: { _limit: limit, _start: start },
      });

      // Enrich posts with additional display data
      return response.map((post, index) => {
        const globalIndex = start + index;
        return {
          ...post,
          image: POST_IMAGES[globalIndex % POST_IMAGES.length],
          category: POST_CATEGORIES[globalIndex % POST_CATEGORIES.length],
          postedAt: `${Math.floor(Math.random() * 60) + 1} minutes ago`,
          author: {
            name: AUTHOR_NAMES[globalIndex % AUTHOR_NAMES.length],
            avatar: AUTHOR_AVATARS[globalIndex % AUTHOR_AVATARS.length],
          },
        };
      });
    } catch (error) {
      this.handleError(error, 'Failed to fetch posts');
    }
  }

  async getPost(id: number): Promise<Post> {
    try {
      log.debug(`Fetching single post with ID: ${id}`);
      const post = await this.http.get<
        Omit<Post, 'image' | 'category' | 'postedAt' | 'author'>
      >(`/posts/${id}`);

      // Enrich single post with display data (use post.id for consistent data)
      return {
        ...post,
        image: POST_IMAGES[(post.id - 1) % POST_IMAGES.length],
        category: POST_CATEGORIES[(post.id - 1) % POST_CATEGORIES.length],
        postedAt: `${Math.floor(Math.random() * 60) + 1} minutes ago`,
        author: {
          name: AUTHOR_NAMES[(post.id - 1) % AUTHOR_NAMES.length],
          avatar: AUTHOR_AVATARS[(post.id - 1) % AUTHOR_AVATARS.length],
        },
      };
    } catch (error) {
      this.handleError(error, `Failed to fetch post with ID ${id}`);
    }
  }

  async getAuthor(id: number): Promise<Author[]> {
    try {
      const response = await this.http.get<Omit<Author, 'avatar'>[]>(
        '/users',
        {
          params: { id },
        }
      );

      // Enrich authors with avatar images
      return response.map(author => ({
        ...author,
        avatar: AUTHOR_AVATARS[(author.id - 1) % AUTHOR_AVATARS.length],
      }));
    } catch (error) {
      this.handleError(error, `Failed to fetch author with ID ${id}`);
    }
  }

  private handleError(error: unknown, message: string): never {
    if (error instanceof Error) {
      throw new Error(`${message}: ${error.message}`);
    }
    throw new Error(message);
  }
}
