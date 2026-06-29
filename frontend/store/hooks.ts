import { useDispatch, useSelector, TypedUseSelectorHook, ReactReduxContext } from 'react-redux';
import { useContext } from 'react';
import type { RootState, AppDispatch } from './store';
import { store as reduxStore } from './store';

// Safe hooks that prevent crashes during Next.js build-time static pre-rendering
export const useAppDispatch = () => {
  const context = useContext(ReactReduxContext);
  if (!context) {
    return (() => {}) as any;
  }
  return useDispatch<AppDispatch>();
};

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) => {
  const context = useContext(ReactReduxContext);
  if (!context) {
    return selector(reduxStore.getState());
  }
  return useSelector(selector);
};