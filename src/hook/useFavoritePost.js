import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { favoritesState } from '../state/atoms';
import { isFavoritePostSelector } from '../state/selectors';
import api from '../utility/api';

export default function useFavorite(post) {
  const setFavorites = useSetRecoilState(favoritesState);
  const isFavorite = useRecoilValue(isFavoritePostSelector(post.id));

  const toggleFavorite = useCallback(async () => {
    const newFavoriteStatus = !isFavorite;

    // 樂觀更新
    setFavorites((prev) => ({
      ...prev,
      posts: newFavoriteStatus ? [...prev.posts, post] : prev.posts.filter((p) => p.id !== post.id),
    }));

    try {
      const response = await api.get(`/my/post/${post.id}/favorite`);
      if (!response.success) {
        throw new Error('收藏失敗');
      } else {
        if (response.data) {
          setFavorites((prevState) => {
            const newState = {
              ...prevState,
              posts: prevState.posts.map((p) => {
                if (p.id === post.id) {
                  console.log('state:', response.data, p);
                }
                return p.id === post.id ? { ...response.data } : p;
              }),
            };
            return newState;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // 回滾到前一個狀態
      setFavorites((prev) => ({
        ...prev,
        posts: isFavorite ? [...prev.posts, post] : prev.posts.filter((p) => p.id !== post.id),
      }));
      alert('收藏失敗');
    }
  }, [post, isFavorite, setFavorites]);

  return [isFavorite, toggleFavorite];
}
