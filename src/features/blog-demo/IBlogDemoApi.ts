import { IAuthorApi } from '@/features/blog-demo/models/author/IAuthorApi';
import { IPostApi } from '@/features/blog-demo/models/post/IPostApi';

export interface IBlogDemoApi extends IPostApi, IAuthorApi {}
