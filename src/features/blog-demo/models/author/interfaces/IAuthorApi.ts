import { Author } from '../types/Author';

export interface IAuthorApi {
  getAuthor: (id: number) => Promise<Author[]>;
}
