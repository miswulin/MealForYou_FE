import axios from 'axios';

const DETAIL_API_URL = '/api/dish'; // 상품 상세 정보 API의 기본 경로를 가정
const CART_API_URL = '/api/cart'; // 장바구니/구매 API 경로

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


export const detailService = {
  
  // 1. 상품 상세 정보 조회 (GET /api/dish/{dishId} 가정)
  getDishDetail: async (dishId) => {
    try {
      const response = await axios.get(
        `${DETAIL_API_URL}/${dishId}`,
        { headers: authHeader() }
      );
      // 상품 정보, 옵션 목록 등을 반환한다고 가정
      return response.data;
    } catch (error) {
      console.error(`상품 상세 정보 (ID: ${dishId}) 조회 오류:`, error);
      throw error.response?.data || { message: '상품 정보를 불러오는 중 오류가 발생했습니다.' };
    }
  },

  // 2. 장바구니에 상품 추가 (POST /api/cart)
  addToCart: async (dishId, quantity, options) => {
    try {
      const response = await axios.post(
        CART_API_URL,
        { 
          dishId, 
          quantity, // 선택된 옵션 전체 수량 (Pd.jsx에서 계산 필요)
          options // 재료(옵션) 배열: [{ ingredientId, quantity }, ...]
        },
        { headers: authHeader() }
      );
      return response.data; 
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      throw error.response?.data || { message: '장바구니에 아이템 추가 중 오류가 발생했습니다.' };
    }
  },

  // 3. 바로 구매 (POST /api/cart/buy)
  // 스펙: Request body로 { dishId, options: [{ ingredientId, quantity }, ...] }를 받음.
  // 응답으로 생성된 cartItemId를 반환합니다.
  buyNow: async (dishId, options) => {
    try {
      const response = await axios.post(
        `${CART_API_URL}/buy`,
        { 
          dishId, 
          options, 
        },
        { headers: authHeader() }
      );

      return response.data; 
    } catch (error) {
      console.error('바로 구매 오류:', error);
      throw error.response?.data || { message: '바로 구매 처리 중 오류가 발생했습니다.' };
    }
  },
};