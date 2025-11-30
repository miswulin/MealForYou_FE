// src/api/order.js (경로는 프로젝트 구조에 맞게 수정)
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
  // GET /api/orders/sheet?items=1&items=2&...
  getOrderSheet: async (items) => {
    try {
      const response = await apiClient.get(`${ORDER_API_URL}/sheet`, {
        params: { items },
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
  // GET /api/orders/{orderId}/complete
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
};
