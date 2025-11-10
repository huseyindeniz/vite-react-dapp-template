import log from 'loglevel';
import { call, put } from 'redux-saga/effects';

import { IBlogDemoApi } from '@/domain/features/blog-demo/interfaces/IBlogDemoApi';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';
import * as actions from '../actions';
import * as sliceActions from '../slice';
import { Author } from '../types/Author';

export function* ActionEffectGetAuthor(
  blogDemoApi: IBlogDemoApi,
  action: ReturnType<typeof actions.fetchAuthor>
) {
  try {
    yield put(sliceActions.resetError());
    yield put(sliceActions.setLoading(LoadingStatusType.REQUESTED));
    const author: Author = yield call(blogDemoApi.getAuthor, action.payload);
    yield put(sliceActions.addAuthor(author));
    yield put(sliceActions.setLastFetchParams({ authorId: action.payload }));
  } catch (error) {
    log.debug(error);
    yield put(sliceActions.setError((error as Error).message));
  } finally {
    yield put(sliceActions.setLoading(LoadingStatusType.IDLE));
  }
}
