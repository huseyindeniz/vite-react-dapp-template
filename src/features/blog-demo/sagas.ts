import { takeLatest } from 'redux-saga/effects';

import { IBlogDemoApi } from './IBlogDemoApi';
import { ActionEffectGetAuthor } from './models/author/actionEffects/GetAuthor';
import * as authorsActions from './models/author/actions';
import { ActionEffectGetPosts } from './models/post/actionEffects/GetPosts';
import * as postActions from './models/post/actions';

export function* watchBlogDemoSaga(blodDemoApi: IBlogDemoApi) {
  yield takeLatest(
    postActions.fetchPosts.type,
    ActionEffectGetPosts,
    blodDemoApi
  );
  yield takeLatest(
    authorsActions.fetchAuthor.type,
    ActionEffectGetAuthor,
    blodDemoApi
  );
}
