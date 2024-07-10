import { selector } from 'recoil';
import { postsState, authorsState } from './atoms';

export const filteredPostsState = selector({
  key: 'filteredPostsState',
  get: ({ get }) => {
    const posts = get(postsState);
    const favorites = get(favoritesState).posts;
    return posts.map((post) => ({
      ...post,
      isFavorite: favorites.includes(post.id),
    }));
  },
});

// export const filteredAuthorsState = selector({
//   key: 'filteredAuthorsState',
//   get: ({ get }) => {
//     const authors = get(authorsState);
//     const favorites = get(favoritesState).authors;
//     return authors.map((author) => ({
//       ...author,
//       isFavorite: favorites.includes(author.id),
//     }));
//   },
// });
