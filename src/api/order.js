import { apiClient } from "./auth";

const ORDER_API_URL = "/orders";

export const orderService = {
  // 1) 주문 생성 (결제)
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post(ORDER_API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error("주문 생성/결제 오류:", error);
      throw (
        error.response?.data || {
          message: "주문 처리 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 2) 주문/결제 페이지 정보 조회
  getOrderSheet: async (cartItemIds) => {
    try {
      const response = await apiClient.get(`${ORDER_API_URL}/sheet`, {
        params: { items: cartItemIds },
      });
      return response.data;
    } catch (error) {
      console.error("주문/결제 페이지 정보 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "주문/결제 정보 조회 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 3) 주문 완료 페이지 조회
  getOrderComplete: async (orderId) => {
    try {
      const response = await apiClient.get(
        `${ORDER_API_URL}/${orderId}/complete`
      );
      return response.data;
    } catch (error) {
      console.error("주문 완료 정보 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "주문 완료 정보 조회 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 4) 주문 내역 조회
  getOrderHistory: async () => {
    try {
      const response = await apiClient.get(`${ORDER_API_URL}/history`);
      return response.data;
    } catch (error) {
      console.error("주문 내역 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "주문 내역 조회 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
