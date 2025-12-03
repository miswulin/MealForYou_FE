import { apiClient } from "./auth";

const CART_API_URL = "/cart";

export const cartService = {
  // 1. 장바구니 조회 
  getCart: async () => {
    try {
      const response = await apiClient.get(CART_API_URL);
      return response.data;
    } catch (error) {
      console.error("장바구니 목록 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "장바구니 목록을 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 2. 장바구니 아이템 삭제
  removeItemFromCart: async (cartItemId) => {
    try {
      const response = await apiClient.delete(`${CART_API_URL}/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error(`장바구니 아이템 (ID: ${cartItemId}) 삭제 오류:`, error);
      throw (
        error.response?.data || {
          message: "장바구니 아이템 삭제 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 3. 상품 수량 변경
  updateOptionQuantity: async (cartItemIngredientId, quantity) => {
    try {
      const res = await apiClient.put(
        `${CART_API_URL}/ingredient/${cartItemIngredientId}`,
        null, // body 비움
        { params: { quantity } }  // ?quantity=1
      );
      return res.data;
    } catch (error) {
      console.error(
        `옵션 수량 변경 오류 (ID: ${cartItemIngredientId}):`,
        error
      );
      throw (
        error.response?.data || {
          message: "옵션 수량 변경 중 오류가 발생했습니다.",
        }
      );
    }
  },

  updateItemQuantity: async (cartItemId, { delta }) => {
    try {
      const response = await apiClient.put(
        `${CART_API_URL}/${cartItemId}`, 
        { delta } // 증감량 전달
      );
      return response.data;
    } catch (error) {
      console.error(`메인 상품 수량 변경 오류 (ID: ${cartItemId}):`, error);
      throw (
        error.response?.data || {
          message: "메인 상품 수량 변경 중 오류가 발생했습니다.",
        }
      );
    }
  },


  // 5. 상품 다중 삭제
  removeMultipleItemsFromCart: async (cartItemIds) => {
    try {
      const response = await apiClient.delete(`${CART_API_URL}/items`, {
        data: cartItemIds,
      });
      return response.data;
    } catch (error) {
      console.error("선택 아이템 일괄 삭제 오류:", error);
      throw (
        error.response?.data || {
          message: "선택 상품 삭제 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
