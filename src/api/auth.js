import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// API 기본 경로
const API_URL = '/auth';

export const authService = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await apiClient.post(API_URL + '/signup', userData);
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
      const response = await apiClient.post(API_URL + '/login', credentials);
      
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('로그인 오류:', error);
      const errorMessage = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
  },
  
  // 로그아웃
  logout: () => {
    localStorage.removeItem('user');
  },
  
  // 토큰 재발급
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(API_URL + '/refresh', { refreshToken });
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      throw error.response?.data || { message: '토큰 재발급 중 오류가 발생했습니다.' };
    }
  },
  
  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
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
