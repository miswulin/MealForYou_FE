import axios from 'axios';

const PAYMENT_API_URL = '/api/payment';

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

export const paymentService = {
  
  /**
   * 결제 완료 후 서버에 검증 및 주문 완료 요청
   * @param {Object} paymentData API 스펙에 맞는 결제 데이터
   * - impUid: string (아임포트 결제 고유번호)
   * - merchantUid: string (상점 주문 번호)
   * - cartItemIds: number[] (주문 상품 ID 목록)
   * - paymentType: string (결제 수단 타입)
   * @returns {string} 서버 응답 (예: 생성된 주문 번호)
   */
  completePayment: async (paymentData) => {
    try {
      const response = await axios.post(
        `${PAYMENT_API_URL}/complete`,
        paymentData, 
        { headers: authHeader() }
      );
      return response.data; 
    } catch (error) {
      console.error('결제 완료 및 검증 오류:', error);
      throw error.response?.data || { message: '결제 검증 및 주문 생성 중 오류가 발생했습니다.' };
    }
  },
  
};