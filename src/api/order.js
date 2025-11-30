import axios from 'axios';

const ORDER_API_URL = '/api/orders';

// 인증 헤더 함수
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { 
            'Authorization': `Bearer ${user.accessToken}`, 
            'Content-Type': 'application/json' 
        };
    } else {
        return { 'Content-Type': 'application/json' };
    }
};


export const orderService = {
    // 1) 주문 생성 (결제)
    createOrder: async (orderData) => {
      try {
        const response = await axios.post(
          ORDER_API_URL,
          orderData,
          { headers: authHeader() }
        );
        return response.data;
      } catch (error) {
        console.error('주문 생성/결제 오류:', error);
        throw error.response?.data || { message: '주문 처리 중 오류가 발생했습니다.' };
      }
    },
  
    // 2) 주문/결제 페이지 정보 조회 
    getOrderSheet: async (items) => {
      try {
        const response = await axios.get(
          `${ORDER_API_URL}/sheet`,
          {
            headers: authHeader(),
            params: { items } 
          }
        );
        return response.data;
      } catch (error) {
        console.error('주문/결제 페이지 정보 조회 오류:', error);
        throw error.response?.data || { message: '주문/결제 정보 조회 중 오류가 발생했습니다.' };
      }
    },
  
    // 3) 주문 완료 페이지 조회 (GET /api/orders/{orderId}/complete)
    getOrderComplete: async (orderId) => {
      try {
        const response = await axios.get(
          `${ORDER_API_URL}/${orderId}/complete`,
          { headers: authHeader() }
        );
        return response.data;
      } catch (error) {
        console.error('주문 완료 정보 조회 오류:', error);
        throw error.response?.data || { message: '주문 완료 정보 조회 중 오류가 발생했습니다.' };
      }
    }
  };
  
