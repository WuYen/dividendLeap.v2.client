// atoms.js
import { atom } from 'recoil';

export const postsState = atom({
  key: 'postsState',
  default: [],
});

export const authorsState = atom({
  key: 'authorsState',
  default: [],
});

export const favoritesState = atom({
  key: 'favoritesState',
  default: {
    posts: [],
    authors: [],
  },
});
