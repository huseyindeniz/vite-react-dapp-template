import log from 'loglevel';
import { call, put, select } from 'redux-saga/effects';

import { RootState } from '@/core/features/app/store/store';
import { IBlogDemoApi } from '@/domain/features/blog-demo/interfaces/IBlogDemoApi';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';
import * as actions from '../actions';
import * as sliceActions from '../slice';
import { postsSelectors } from '../slice';
import { Post } from '../types/Post';

export function* ActionEffectGetPost(
  blogDemoApi: IBlogDemoApi,
  action: ReturnType<typeof actions.fetchPost>
) {
  try {
    log.debug('ActionEffectGetPost received payload:', action.payload);
    yield put(sliceActions.resetError());
    yield put(sliceActions.setLoading(LoadingStatusType.REQUESTED));

    const { id } = action.payload;

    // Check if post already exists in store
    const existingPost: Post | undefined = yield select((state: RootState) =>
      postsSelectors.selectById(state.blogDemo.posts, id)
    );

    if (existingPost) {
      log.debug(`Post ${id} already in store, skipping fetch`);
    } else {
      // Fetch single post from API
      const post: Post = yield call([blogDemoApi, blogDemoApi.getPost], id);

      if (post) {
        yield put(sliceActions.addPost(post));
      }
    }
  } catch (error) {
    log.debug(error);
    yield put(sliceActions.setError((error as Error).message));
  } finally {
    yield put(sliceActions.setLoading(LoadingStatusType.IDLE));
  }
}
