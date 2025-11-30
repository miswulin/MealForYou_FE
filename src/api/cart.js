// src/api/cart.js (경로는 프로젝트에 맞게)
import { apiClient } from "./auth";

const CART_API_URL = "/cart";

export const cartService = {
  // 1. 장바구니 조회 (GET /api/cart)
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

  // 2. 장바구니 아이템 삭제 (DELETE /api/cart/{cartItemId})
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

  // 3. 상품 수량 변경 (PATCH /api/cart/{cartItemId}/quantity)
  updateItemQuantity: async (cartItemId, updateData) => {
    try {
      const response = await apiClient.patch(
        `${CART_API_URL}/${cartItemId}/quantity`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`아이템 (ID: ${cartItemId}) 수량 변경 오류:`, error);
      throw (
        error.response?.data || {
          message: "상품 수량 변경 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 4. 옵션 수량 변경 (PUT /api/cart/ingredient/{cartItemIngredientId})
  updateOptionQuantity: async (cartItemIngredientId, newQuantity) => {
    try {
      const response = await apiClient.put(
        `${CART_API_URL}/ingredient/${cartItemIngredientId}`,
        { quantity: newQuantity }
      );
      return response.data;
    } catch (error) {
      console.error(
        `옵션 (ID: ${cartItemIngredientId}) 수량 변경 오류:`,
        error
      );
      throw (
        error.response?.data || {
          message: "옵션 수량 변경 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 5. 상품 다중 삭제 (DELETE /api/cart/items)
  removeMultipleItemsFromCart: async (cartItemIds) => {
    try {
      const response = await apiClient.delete(`${CART_API_URL}/items`, {
        data: cartItemIds, // 예: [1,2,3]
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
