import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 토큰이 있는 경우 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 만료 시 자동으로 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고, 토큰 만료로 인한 에러이며, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.refreshToken) {
          // 토큰 갱신 시도
          const response = await authService.refreshToken(user.refreshToken);
          const { accessToken, refreshToken } = response;
          
          // 새 토큰 저장
          const updatedUser = { ...user, accessToken, refreshToken };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (error) {
        console.error('토큰 갱신 실패:', error);
        // 토큰 갱신 실패 시 로그아웃 처리
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API 기본 경로
const API_URL = '/auth';

export const authService = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await apiClient.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      console.error('회원가입 오류:', error);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  },
  
  // 로그인
  login: async (credentials) => {
    try {
      const response = await apiClient.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      });
      
      const { accessToken, refreshToken } = response.data;
      
      if (accessToken && refreshToken) {
        const userData = {
          accessToken,
          refreshToken,
          tokenType: response.data.tokenType,
          expiresIn: response.data.expiresIn,
          email: credentials.email
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error('토큰이 정상적으로 발급되지 않았습니다.');
    } catch (error) {
      console.error('로그인 오류:', error);
      const errorMessage = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  },
  
  // 로그아웃
  logout: () => {
    localStorage.removeItem('user');
    // 서버 측 로그아웃도 필요한 경우 여기에 추가
  },
  
  // 토큰 재발급
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post(`${API_URL}/refresh`, { refreshToken });
      
      if (!response.data.accessToken || !response.data.refreshToken) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }
      
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        tokenType: response.data.tokenType,
        expiresIn: response.data.expiresIn
      };
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      throw new Error(error.response?.data?.message || '토큰 갱신에 실패했습니다.');
    }
  },
  
  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      return null;
    }
  },
  
  // 인증 헤더 가져오기
  getAuthHeader: () => {
    const user = authService.getCurrentUser();
    if (user?.accessToken) {
      return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
  },
  
  // 토큰 유효성 검사
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!(user?.accessToken);
  },
  
  // 이메일 인증 코드 발송
  sendVerificationCode: async (email) => {
    try {
      const response = await apiClient.post(API_URL + '/email/send', { 
        email
      });
      
      return {
        ...response.data,
        // 개발 환경에서는 응답에 devCode가 포함되어 있음
        devCode: process.env.NODE_ENV === 'development' ? response.data.devCode : null
      };
    } catch (error) {
      console.error('이메일 인증코드 발송 오류:', error);
      const errorMessage = error.response?.data?.message || '이메일 인증코드 발송 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  },
  
  // 이메일 인증 코드 검증
  verifyEmailCode: async (email, code) => {
    try {
      const response = await apiClient.post(API_URL + '/email/verify', { 
        email, 
        code: code.toString()
      });
      return response.data;
    } catch (error) {
      console.error('이메일 인증코드 검증 오류:', error);
      const errorMessage = error.response?.data?.message || '이메일 인증코드 검증 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  }
};

export { apiClient };

