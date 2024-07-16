import { selectorFamily } from 'recoil';
import { favoritesState } from './atoms';

// export const filteredPostsState = selector({
//   key: 'filteredPostsState',
//   get: ({ get }) => {
//     const posts = get(postsState);
//     const favorites = get(favoritesState).posts;
//     return posts.map((post) => ({
//       ...post,
//       isFavorite: favorites.includes(post.id),
//     }));
//   },
// });

export const isFavoritePostSelector = selectorFamily({
  key: 'isFavoritePostSelector',
  get:
    (postId) =>
    ({ get }) => {
      const favorites = get(favoritesState);
      return favorites.posts.some((post) => post.id === postId);
    },
});
