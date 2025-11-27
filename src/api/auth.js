import axios from 'axios';

// API 기본 URL 설정 (프록시 사용)
const API_URL = '/api/auth';

export const authService = {
  // 회원가입
  signup: async (userData) => {
    try {
      const response = await axios.post(API_URL + '/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error.response?.data || { message: '회원가입 중 오류가 발생했습니다.' };
    }
  },
  
  // 로그인
  login: async (credentials) => {
    try {
      const response = await axios.post(API_URL + '/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error.response?.data || { message: '로그인 중 오류가 발생했습니다.' };
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
  
  // 이메일 인증 요청
  requestEmailVerification: async (email) => {
    try {
      const response = await axios.post(API_URL + '/email/verification-request', { email });
      return response.data;
    } catch (error) {
      console.error('이메일 인증 요청 오류:', error);
      throw error.response?.data || { message: '이메일 인증 요청 중 오류가 발생했습니다.' };
    }
  },
  
  // 이메일 인증 확인
  verifyEmail: async (email, code) => {
    try {
      const response = await axios.post(API_URL + '/email/verify', { email, code });
      return response.data;
    } catch (error) {
      console.error('이메일 인증 확인 오류:', error);
      throw error.response?.data || { message: '이메일 인증 확인 중 오류가 발생했습니다.' };
    }
  }
};
