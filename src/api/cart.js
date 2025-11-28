import axios from 'axios';

const CART_API_URL = '/api/cart';

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

export const cartService = {
  // 1. 장바구니 조회 (GET /api/cart)
  getCart: async () => {
    try {
      const response = await axios.get(CART_API_URL, { headers: authHeader() });
      return response.data;
    } catch (error) {
      console.error('장바구니 목록 조회 오류:', error);
      throw error.response?.data || { message: '장바구니 목록을 불러오는 중 오류가 발생했습니다.' };
    }
  },

  // 2. 장바구니 아이템 삭제 (DELETE /api/cart/{cartItemId})
  removeItemFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(
        `${CART_API_URL}/${cartItemId}`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error(`장바구니 아이템 (ID: ${cartItemId}) 삭제 오류:`, error);
      throw error.response?.data || { message: '장바구니 아이템 삭제 중 오류가 발생했습니다.' };
    }
  },

  // 3. 상품 수량 변경 (PATCH /api/cart/{cartItemId}/quantity)
  updateItemQuantity: async (cartItemId, updateData) => {
    try {
      const response = await axios.patch(
        `${CART_API_URL}/${cartItemId}/quantity`,
        updateData, 
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error(`아이템 (ID: ${cartItemId}) 수량 변경 오류:`, error);
      throw error.response?.data || { message: '상품 수량 변경 중 오류가 발생했습니다.' };
    }
  },
  
  // 4. 옵션 수량 변경 (PUT 또는 PATCH /api/cart/ingredient/{cartItemIngredientId} )
  updateOptionQuantity: async (cartItemIngredientId, newQuantity) => {
    try {
      const response = await axios.put(
        `${CART_API_URL}/ingredient/${cartItemIngredientId}`,
        { quantity: newQuantity }, 
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error(`옵션 (ID: ${cartItemIngredientId}) 수량 변경 오류:`, error);
      throw error.response?.data || { message: '옵션 수량 변경 중 오류가 발생했습니다.' };
    }
  },

  // 5. 상품 다중 삭제 (DELETE /api/cart/items)
  removeMultipleItemsFromCart: async (cartItemIds) => {
    try {
      const response = await axios.delete(
        `${CART_API_URL}/items`,
        { 
          data: cartItemIds, 
          headers: authHeader() 
        }
      );
      return response.data; 
    } catch (error) {
      console.error(`선택 아이템 일괄 삭제 오류:`, error);
      throw error.response?.data || { message: '선택 상품 삭제 중 오류가 발생했습니다.' };
    }
  },
};