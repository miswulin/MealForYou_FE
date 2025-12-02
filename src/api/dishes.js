import { apiClient } from "./auth"; 

const DISH_API_URL = "/dishes";
const CART_API_URL = "/cart";

export const dishesService = {
  // 1) 상품 상세 조회 GET 
  getDishDetail: async (dishId) => {
    try {
      const res = await apiClient.get(`${DISH_API_URL}/${dishId}`);
      return res.data;
    } catch (error) {
      console.error(`상품 상세 정보 (ID: ${dishId}) 조회 오류:`, error);
      throw (
        error.response?.data || {
          message: "상품 정보를 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 2) 관심 상품 토글 POST 
  toggleInterest: async (dishId) => {
    const res = await apiClient.post(`${DISH_API_URL}/${dishId}/interest`);
    // 예시 응답: true / false
    return res.data;
  },

  // 3) 장바구니 담기 POST 
  addToCart: async (dishId, options) => {
    try {
      const res = await apiClient.post(
        `${CART_API_URL}/add`,
        { dishId, options }
      );
      return res.data;
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      throw (
        error.response?.data || {
          message: "장바구니에 아이템 추가 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 4) 바로구매 POST
  buyNow: async (dishId, options) => {
    const res = await apiClient.post(
      `${CART_API_URL}/buy`,
      { dishId, options }
    );
    return res.data; // cartItemId 같은 값
  },
};
