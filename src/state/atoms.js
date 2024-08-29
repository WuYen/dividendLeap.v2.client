// atoms.js
import { atom } from 'recoil';
import { getLoginStatus } from '../utility/loginHelper';

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

export const authState = atom({
  key: 'authState',
  default: (function initializeState() {
    const [isValid, decoded] = getLoginStatus();
    return {
      isLoggedIn: isValid,
      userInfo: isValid ? decoded : null,
    };
  })(),
});
