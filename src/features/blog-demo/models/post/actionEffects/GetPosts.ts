import log from 'loglevel';
import { call, put } from 'redux-saga/effects';

import { IBlogDemoApi } from '@/features/blog-demo/IBlogDemoApi';
import {
  withSliceCache,
  createCacheKey,
} from '@/features/slice-manager/hocs/withSliceCache';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';
import * as actions from '../actions';
import * as sliceActions from '../slice';
import { Post } from '../types/Post';

export function* ActionEffectGetPosts(
  blogDemoApi: IBlogDemoApi,
  action: ReturnType<typeof actions.fetchPosts>
) {
  try {
    log.debug('ActionEffectGetPosts received payload:', action.payload);
    yield put(sliceActions.resetError());
    yield put(sliceActions.setLoading(LoadingStatusType.REQUESTED));

    const cacheKey = createCacheKey('posts', 'fetchPosts', {
      limit: action.payload.limit,
      start: action.payload.start,
    });

    const posts = (yield* withSliceCache(
      'posts',
      cacheKey,
      function* () {
        log.debug('Making API call with:', {
          limit: action.payload.limit,
          start: action.payload.start,
        });
        return yield call(
          blogDemoApi.getPosts,
          action.payload.limit,
          action.payload.start
        );
      },
      {
        ttl: 600000, // 10 minutes cache
      }
    )) as Post[] | null;

    if (posts) {
      yield put(sliceActions.addPosts(posts));
    }
  } catch (error) {
    log.debug(error);
    yield put(sliceActions.setError((error as Error).message));
  } finally {
    yield put(sliceActions.setLoading(LoadingStatusType.IDLE));
  }
}
