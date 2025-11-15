import { IAuthorApi } from '@/domain/features/blog-demo/models/author/interfaces/IAuthorApi';
import { IPostApi } from '@/domain/features/blog-demo/models/post/interfaces/IPostApi';

export interface IBlogDemoApi extends IPostApi, IAuthorApi {}
