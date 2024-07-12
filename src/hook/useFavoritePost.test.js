import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import useFavoritePost from './useFavoritePost';
import { favoritesState } from '../state/atoms';
import { isFavoritePostSelector } from '../state/selectors';

// Mock API
jest.mock('../utility/api', () => ({
  get: jest.fn(),
}));

import api from '../utility/api';

describe('useFavorite', () => {
  const testPost = { id: '1', title: 'Test Post' };

  const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial favorite status', () => {
    const { result } = renderHook(() => useFavoritePost(testPost), { wrapper });
    const [isFavorite] = result.current;

    expect(isFavorite).toBe(false);
  });

  it('should toggle favorite status', async () => {
    api.get.mockResolvedValue({ success: true });

    const { result } = renderHook(
      () => ({
        favoriteHook: useFavoritePost(testPost), //  const [isFavorite, toggleFavorite] = useFavorite(testPost)
        favoritesValue: useRecoilValue(favoritesState),
        isFavorite: useRecoilValue(isFavoritePostSelector(testPost.id)),
      }),
      { wrapper }
    );

    // 然後在測試中使用
    const [initFavoriteState, toggleFavorite] = result.current.favoriteHook;

    expect(initFavoriteState).toBe(false);
    expect(result.current.isFavorite).toBe(false);

    await act(async () => {
      toggleFavorite();
    });

    const [newIsFavoriteState] = result.current.favoriteHook;
    expect(newIsFavoriteState).toBe(true);
    expect(result.current.isFavorite).toBe(true);
    expect(result.current.favoritesValue.posts).toContainEqual(testPost);
  });

  it('should handle API failure', async () => {
    api.get.mockResolvedValue({ success: false });

    const { result } = renderHook(
      () => ({
        favorite: useFavoritePost(testPost),
        favoritesValue: useRecoilValue(favoritesState),
      }),
      { wrapper }
    );

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      result.current.favorite[1]();
    });

    expect(result.current.favorite[0]).toBe(false);
    expect(result.current.favoritesValue.posts).not.toContainEqual(testPost);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
