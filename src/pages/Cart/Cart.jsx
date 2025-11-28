import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/StatusBar";
import Header from "../../components/Header";
import { cartService } from "../../api/cart";

import "./Cart.css";
import bibimbap from "../../assets/images/bibimbap.png"; // 임시 썸네일
import checkIcon from "../../assets/images/check.png"

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

 
  const [shippingFee, setShippingFee] = useState(0);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);


  const allChecked =
    items.length > 0 && items.every((item) => item.checked === true);
  const checkedCount = items.filter((i) => i.checked).length;

  const selectedTotalPrice = useMemo(() => {
    return items
      .filter((i) => i.checked)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  // 옵션 요약
  const getOptionsSummary = (options) => {
    const picked = options.filter((o) => o.count > 0);
    if (picked.length === 0) return "옵션을 선택하세요";
    return picked
      .map((o) => `${o.label} ${o.count}개`)
      .join(", ");
  };

  // 전체 선택 / 해제
  const handleToggleAll = () => {
    const next = items.map((item) => ({ ...item, checked: !allChecked }));
    setItems(next);
  };

  // 개별 체크박스
  const handleToggleItem = (id) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(next);
  };

  // 수량 변경 (상단 메인 수량)
  const handleChangeQty = async (id, delta) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    // 클라이언트 측에서 예상되는 다음 수량 계산 (서버에서 최종 검증)
    const nextQty = Math.max(0, itemToUpdate.qty + delta);
    if (nextQty === itemToUpdate.qty) return;

    try {
      await cartService.updateItemQuantity(id, { delta }); 

      const next = items.map((item) =>
        item.id === id ? { ...item, qty: nextQty } : item
      ).filter(item => item.qty > 0);
      
      setItems(next);

    } catch (error) {
      console.error(`ID ${id} 수량 변경 실패:`, error);
      alert('수량 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 아이템 삭제
  const handleRemoveItem = async (id) => {
    try {
      if (!window.confirm("선택한 상품을 장바구니에서 삭제하시겠습니까?")) {
        return;
      }
      
      await cartService.removeItemFromCart(id); 

      const next = items.filter((item) => item.id !== id);
      setItems(next);
      
      fetchCart(); 

    } catch (error) {
      console.error(`ID ${id} 아이템 삭제 실패:`, error);
      alert('아이템 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'); 
    }
  };

  // 선택 삭제
  const handleRemoveSelectedItems = async () => {
    const selectedItems = items.filter(item => item.checked);
    const selectedIds = selectedItems.map(item => item.id);

    if (selectedIds.length === 0) {
      alert("삭제할 상품을 선택해 주세요.");
      return;
    }
    
    if (!window.confirm(`${selectedIds.length}개의 상품을 장바구니에서 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await cartService.removeMultipleItemsFromCart(selectedIds);

      const next = items.filter((item) => !item.checked);
      setItems(next);
      alert('선택하신 상품들이 삭제되었습니다.');

      fetchCart();

    } catch (error) {
      console.error("선택 아이템 일괄 삭제 실패:", error);
      alert('일부 상품 삭제에 실패했습니다. 장바구니를 새로고침합니다.');
      fetchCart();
    }
  };

  //  옵션 바 클릭 시 열기 / 닫기
  const handleToggleOptionsOpen = (id) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, isOptionsOpen: !item.isOptionsOpen } : item
    );
    setItems(next);
  };

  // 옵션별 수량 변경
  const handleChangeOptionQty = async (itemId, optionIndex, delta) => {
    const itemToUpdate = items.find(item => item.id === itemId);
    if (!itemToUpdate) return;
    
    const optionToUpdate = itemToUpdate.options[optionIndex];
    const nextCount = Math.max(0, optionToUpdate.count + delta);
    if (nextCount === optionToUpdate.count) return;

    // 중요: 장바구니 조회 시 이 ID를 items 상태에 저장
    const cartItemIngredientId = optionToUpdate.cartItemIngredientId; 

    if (!cartItemIngredientId) {
        console.error("Cart Item Ingredient ID를 찾을 수 없습니다.");
        alert("옵션 정보를 찾을 수 없어 수량 변경에 실패했습니다.");
        return;
    }
    
    try {
      await cartService.updateOptionQuantity(cartItemIngredientId, nextCount);

      const next = items.map((item) => {
        if (item.id !== itemId) return item;
        const newOptions = item.options.map((opt, idx) => {
          if (idx !== optionIndex) return opt;
          return { ...opt, count: nextCount };
        });
        return { ...item, options: newOptions };
      });
      setItems(next);

    } catch (error) {
      console.error(`옵션 변경 실패 (ID: ${cartItemIngredientId}):`, error);
      alert('옵션 수량 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

    const parsePriceNumber = (priceStr) => {
      if (!priceStr) return 0;
      const numeric = priceStr.replace(/[^0-9]/g, "");
      return Number(numeric) || 0;
    };
  
    const parseQuantityNumber = (qtyStr) => {
      if (!qtyStr) return 1;
      const numeric = qtyStr.replace(/[^0-9]/g, "");
      return Number(numeric) || 1;
    };

    useEffect(() => {
      const fetchCart = async () => {
        try {
          const data = await cartService.getCart();
  
          const mappedItems = (data.cartItems || []).map((item) => {
            const qtyNum = parseQuantityNumber(item.quantity);
            const totalPriceNum = parsePriceNumber(item.totalPrice);
            const unitPrice = qtyNum > 0 ? totalPriceNum / qtyNum : totalPriceNum;
  
            return {
              id: item.cartItemId,
              name: item.dishName,
              price: unitPrice,
              qty: qtyNum,
              checked: true,
              isOptionsOpen: false,
              options: (item.ingredients || []).map((ing) => ({
                cartItemIngredientId: ing.cartItemIngredientID, 
                label: ing.name,
                count: parseQuantityNumber(ing.quantity),
              })),
              imageUrl: item.imageUrl,
            };
          });
  
          setItems(mappedItems);
          setShippingFee(parsePriceNumber(data.shippingFee));
          setTotalOrderPrice(parsePriceNumber(data.totalProductPrice)); 
        } catch (err) {
          console.error("장바구니 조회 실패:", err);
        }
      };
  
      fetchCart();
    }, []);
  

  return (
    <div className="cart-root">
      {/* STATUS BAR */}
      <StatusBar />

      {/* HEADER */}
      <Header
        title="장바구니"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      {/* 메인 스크롤 영역 */}
      <main className="cart-main">
        {/* 전체 선택 영역 */}
        <section className="cart-select-bar">
          <label className="cart-checkbox-row">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={handleToggleAll}
            />
            <span className="cart-checkbox-ui" />
            <span>
              전체 선택 ({checkedCount}/{items.length})
            </span>
          </label>
          <button className="cart-select-remove-btn" onClick={handleRemoveSelectedItems} 
            disabled={checkedCount === 0}>선택 삭제</button>
        </section>

        {/* 장바구니 리스트 */}
        <section className="cart-list">
          {items.map((item) => (
            <article key={item.id} className="cart-item">
              <div className="cart-item-top">
                <label className="cart-item-check">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleItem(item.id)}
                  />
                  <span className="cart-checkbox-ui" />
                </label>

                <div className="cart-thumb-wrap">
                  <img
                    src={bibimbap}
                    alt={item.name}
                    className="cart-thumb-img"
                  />
                </div>

                <div className="cart-item-info">
                  <h2 className="cart-item-name">{item.name}</h2>

                  <div className="cart-qty-row">
                    {/* 알약 모양 – 0 + 박스 */}
                    <div className="qty-box">
                      <button className="qty-btn minus" onClick={() => handleChangeQty(item.id, -1)}>
                        −
                      </button>

                      <span className="qty-value">{item.qty}</span>

                      <button className="qty-btn plus" onClick={() => handleChangeQty(item.id, 1)}>
                        +
                      </button>
                    </div>

                    {/* 오른쪽 가격 */}
                    <span className="cart-item-price">
                      {formatPrice(item.price * item.qty)}원
                    </span>
                  </div>
                </div>

                <button
                  className="cart-item-delete"
                  aria-label="삭제"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  ×
                </button>
              </div>

              {/* 옵션 요약 줄 (클릭하면 드롭다운 열림) */}
              <button
                type="button"
                className="cart-item-options-row"
                onClick={() => handleToggleOptionsOpen(item.id)}
              >
                <p className="cart-item-options-text">
                  {getOptionsSummary(item.options)}
                </p>
                <span className="cart-item-options-toggle">
                  {item.isOptionsOpen ? "▴" : "▾"}
                </span>
              </button>

              {/* 옵션 드롭다운 영역 */}
              {item.isOptionsOpen && (
                <div className="cart-options-panel">
                  {item.options.map((opt, idx) => (
                    <div key={opt.label} className="cart-option-row">
                      <span className="cart-option-label">{opt.label}</span>
                      <div className="cart-option-qty-box">
                        <button
                          className="cart-option-qty-btn"
                          onClick={() =>
                            handleChangeOptionQty(item.id, idx, -1)
                          }
                          disabled={opt.count === 0}
                        >
                          −
                        </button>
                        <span className="cart-option-qty-value">
                          {opt.count}
                        </span>
                        <button
                          className="cart-option-qty-btn"
                          onClick={() =>
                            handleChangeOptionQty(item.id, idx, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="cart-add-more">
          <button
            type="button"
            className="cart-add-more-btn"
            onClick={() => {
              // 나중에 다른 메뉴 리스트 페이지로 이동하면 여기서 navigate() 쓰면 됨
              // 예: navigate("/menu");
            }}
          >
            + 다른 메뉴 추가하기
          </button>
        </section>

        {/* 합계 영역 */}
        <section className="cart-summary">
          <div className="cart-summary-row">
            <span>선택 상품 금액</span>
            <span>{formatPrice(selectedTotalPrice)}원</span>
          </div>
          <div className="cart-summary-row">
            <span>배송비</span>
            <span>{formatPrice(shippingFee)}원</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
          <span>{formatPrice(selectedTotalPrice + shippingFee)}원</span>
          </div>
        </section>
      </main>

      {/* 하단 주문 버튼 */}
      <div className="cart-bottom-bar">
        <button
          className="cart-order-btn"
          disabled={checkedCount === 0}
          onClick={() => navigate("/order")}
        >
          <span className="cart-order-count">{checkedCount}</span>
          <span className="cart-order-text">
          {formatPrice(selectedTotalPrice + shippingFee)}원 주문하기
          </span>
        </button>
      </div>
    </div>
  );
}
