import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

const useAuthStore = create(
  persist(
    (set) => ({
      // 인증 상태
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      
      // 로그인 액션
      login: (tokens) => set({
        isAuthenticated: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }),
      
      // 로그아웃 액션
      logout: () => set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      }),
      
      // 사용자 정보 설정
      setUser: (userData) => set({ user: userData }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 상태 선택자
const stateSelector = (state) => ({
  isAuthenticated: state.isAuthenticated,
  user: state.user,
  accessToken: state.accessToken,
  refreshToken: state.refreshToken,
});

// 액션 선택자
const actionSelector = (state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
});

// 상태와 액션을 분리하여 내보내기
export const useAuthState = () => useAuthStore(stateSelector, shallow);
export const useAuthActions = () => useAuthStore(actionSelector, shallow);

// 개별 훅들
export const useIsAuthenticated = () => useAuthStore(s => s.isAuthenticated);
export const useUser = () => useAuthStore(s => s.user);
export const useAccessToken = () => useAuthStore(s => s.accessToken);
export const useRefreshToken = () => useAuthStore(s => s.refreshToken);
export const useLogin = () => useAuthStore(s => s.login);
export const useLogout = () => useAuthStore(s => s.logout);
export const useSetUser = () => useAuthStore(s => s.setUser);

// 이전 버전과의 호환성을 위한 useAuth
export const useAuth = () => ({
  ...useAuthState(),
  ...useAuthActions(),
});

export default useAuthStore;