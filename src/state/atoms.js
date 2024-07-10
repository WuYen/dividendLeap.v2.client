// atoms.js
import { atom } from 'recoil';

export const postsState = atom({
  key: 'postsState',
  default: [],
});

export const favoritesState = atom({
  key: 'favoritesState',
  default: {
    posts: [],
    authors: [],
    loading: true,
  },
});

export const authorPostsState = atom({
  key: 'authorPostsState',
  default: [],
});

export const authorsRankState = atom({
  key: 'authorsRankState',
  default: [],
});
