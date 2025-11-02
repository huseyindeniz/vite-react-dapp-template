import { IAuthorApi } from '@/features/blog-demo/models/author/interfaces/IAuthorApi';
import { IPostApi } from '@/features/blog-demo/models/post/interfaces/IPostApi';

export interface IBlogDemoApi extends IPostApi, IAuthorApi {}
