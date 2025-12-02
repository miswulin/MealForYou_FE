//회원정보 관련 api
import { apiClient } from "./auth";

const ME_API_URL = "/members/me";

export const memberInfo = {
  // 1) 내 프로필 조회 GET
  getMyInfo: async () => {
    try {
      const res = await apiClient.get(`${ME_API_URL}`);
      return res.data;
    } catch (error) {
      console.error(`회원 정보 조회 오류:`, error);
      throw (
        error.response?.data || {
          message: "회원 정보를 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  // 2) 내 프로필 수정 PATCH
  updateMyInfo: async (payload) => {
    try {
      const res = await apiClient.patch(`${ME_API_URL}/info`, payload);
      return res.data;
    } catch (error) {
      console.error(`회원 정보 수정 오류:`, error);
      throw (
        error.response?.data || {
          message: "회원 정보를 수정하는 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
