import axios from "axios";

const DISH_API_URL = "/api/dishes";
const CART_API_URL = "/api/cart";

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    };
  }
  return { "Content-Type": "application/json" };
};

export const dishesService = {
  getDishDetail: async (dishId) => {
    try {
      const res = await axios.get(`${DETAIL_API_URL}/${dishId}`, {
        headers: authHeader(),
      });
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

  toggleInterest: async (dishId) => {
    const res = await axios.post(
      `${DISHES_API_URL}/${dishId}/interest`,
      null,
      { headers: authHeader() }
    );
    // 예시 응답: true / false
    return res.data;
  },


  addToCart: async (dishId, quantity, options) => {
    const res = await axios.post(
      CART_API_URL,
      { dishId, quantity, options },
      { headers: authHeader() }
    );
    return res.data;
  },

  buyNow: async (dishId, options) => {
    const res = await axios.post(
      `${CART_API_URL}/buy`,
      { dishId, options },
      { headers: authHeader() }
    );
    return res.data;
  },
};
