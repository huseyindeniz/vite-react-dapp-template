import { HttpService } from '@/services/http/HttpService';
import { BlogDemoApi } from '@/services/jsonplaceholder/BlogDemoApi';

// Create HttpService instance for JSONPlaceholder API
const jsonPlaceholderHttp = HttpService.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// Create BlogDemoApi instance with HttpService dependency injection
export const blogDemoApi = new BlogDemoApi(jsonPlaceholderHttp);
