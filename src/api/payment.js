// src/api/payment.js (경로는 프로젝트 구조에 맞춰 수정)
import { apiClient } from "./auth";

const PAYMENT_API_URL = "/payment";

export const paymentService = {
  /**
   * 결제 완료 후 서버에 검증 및 주문 완료 요청
   * POST /api/payment/complete
   * 
   * @param {Object} paymentData
   * - impUid: string
   * - merchantUid: string
   * - cartItemIds: number[]
   * - paymentType: string
   * @returns {string} 생성된 주문 번호
   */
  completePayment: async ({ impUid, merchantUid, cartItemIds, paymentType }) => {
    const payload = {
      impUid,
      merchantUid,
      cartItemIds: cartItemIds.map(Number),
      paymentType,
    };

    console.log("결제 완료 요청 payload:", payload);

    try {
      const response = await apiClient.post(
        `${PAYMENT_API_URL}/complete`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("결제 완료 및 검증 오류:", error.response || error);
      throw (
        error.response?.data || {
          message: "결제 검증 및 주문 생성 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
