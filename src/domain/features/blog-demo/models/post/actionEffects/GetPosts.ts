import log from 'loglevel';
import { call, put } from 'redux-saga/effects';

import { RootState } from '@/core/features/app/store/store';
import { smartFetch } from '@/core/features/slice-manager/sagas/smartFetch';
import { BlogSlices } from '@/domain/features/blog-demo/configureSlice';
import { IBlogDemoApi } from '@/domain/features/blog-demo/interfaces/IBlogDemoApi';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';
import * as actions from '../actions';
import * as sliceActions from '../slice';
import { postsSelectors } from '../slice';
import { Post } from '../types/Post';

export function* ActionEffectGetPosts(
  blogDemoApi: IBlogDemoApi,
  action: ReturnType<typeof actions.fetchPosts>
) {
  try {
    log.debug('ActionEffectGetPosts received payload:', action.payload);
    yield put(sliceActions.resetError());
    yield put(sliceActions.setLoading(LoadingStatusType.REQUESTED));

    const { language, limit, start } = action.payload;

    const posts = (yield* smartFetch(
      BlogSlices.POSTS,
      { language, limit, start },
      (state: unknown) =>
        postsSelectors.selectAll((state as RootState).blogDemo.posts),
      function* () {
        return yield call(
          [blogDemoApi, blogDemoApi.getPosts],
          language,
          limit,
          start
        );
      },
      {
        languageSelector: (state: unknown) =>
          (state as RootState).blogDemo.posts.language,
        lastFetchParamsSelector: (state: unknown) =>
          (state as RootState).blogDemo.posts.lastFetchParams,
      }
    )) as Post[] | null;

    if (posts) {
      yield put(sliceActions.addPosts(posts));
      yield put(sliceActions.setLanguage(language));
      yield put(sliceActions.setLastFetchParams({ language, limit, start }));
    }
  } catch (error) {
    log.debug(error);
    yield put(sliceActions.setError((error as Error).message));
  } finally {
    yield put(sliceActions.setLoading(LoadingStatusType.IDLE));
  }
}
