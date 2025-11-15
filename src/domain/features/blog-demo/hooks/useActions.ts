import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { fetchPost, fetchPosts } from '../models/post/actions';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      fetchPosts,
      fetchPost,
    },
    dispatch
  );
};
