import axios from "axios";
import { apiClient } from "./auth";

const ORDER_API_URL = "/api/orders";

// 인증 헤더 함수는 공통 파일에서 가져온다고 가정
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    };
  } else {
    return { "Content-Type": "application/json" };
  }
};

export const orderService = {
  /**
   * 주문 생성 (결제) API 호출
   * POST /api/orders
   * @param {Object} orderData API 스펙에 맞는 주문 데이터
   * - cartItemIds: number[]
   * - paymentType: string
   * - receiverName: string
   * - receiverPhone: string
   * - address: string
   * @returns {string} 서버 응답 (예: 생성된 주문 번호 또는 "0" 등)
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(
        ORDER_API_URL,
        orderData, // API 스펙에 맞는 데이터 전송
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("주문 생성/결제 오류:", error);
      throw (
        error.response?.data || { message: "주문 처리 중 오류가 발생했습니다." }
      );
    }
  },

  // 필요하다면 주문 상세 조회, 주문 목록 조회 등 함수 추가
  /* 주문 내역 조회 */
  getOrderHistory: async () => {
    try {
      const res = await apiClient.get(`/orders/history`);
      return res.data;
    } catch (error) {
      console.error("주문 내역 조회 오류:", error);
      throw error.response?.data || { message: "주문 내역 조회 실패" };
    }
  },
};
