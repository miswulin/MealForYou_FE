import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/StatusBar";
import Header from "../../components/Header";

import "./Cart.css";
import bibimbap from "../../assets/images/bibimbap.png"; // 임시 썸네일
import checkIcon from "../../assets/images/check.png"

export default function Cart() {
  const navigate = useNavigate();

  // 샘플 장바구니 데이터 (나중에 API 연결하면 여기만 교체하면 됨)
  const [items, setItems] = useState([
    {
      id: 1,
      name: "밀키트 메뉴 이름",
      price: 10000,
      qty: 1,
      checked: true,
      isOptionsOpen: false,
      options: [
        { label: "옵션1(00g)", count: 1 },
        { label: "옵션2(00g)", count: 1 },
        { label: "옵션3(00g)", count: 1 },
        { label: "옵션4(00g)", count: 0 },
        { label: "옵션5(00g)", count: 0 },
      ],
    },
    {
      id: 2,
      name: "밀키트 메뉴 이름",
      price: 10000,
      qty: 1,
      checked: false,
      isOptionsOpen: false,
      options: [
        { label: "옵션1(00g)", count: 1 },
        { label: "옵션2(00g)", count: 0 },
        { label: "옵션3(00g)", count: 0 },
        { label: "옵션4(00g)", count: 0 },
        { label: "옵션5(00g)", count: 0 },
      ],
    },
  ]);

  const allChecked =
    items.length > 0 && items.every((item) => item.checked === true);
  const checkedCount = items.filter((i) => i.checked).length;

  const selectedTotalPrice = useMemo(() => {
    return items
      .filter((i) => i.checked)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  // 옵션 요약 텍스트
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
  const handleChangeQty = (id, delta) => {
    const next = items.map((item) => {
      if (item.id !== id) return item;
      const nextQty = Math.max(1, item.qty + delta);
      return { ...item, qty: nextQty };
    });
    setItems(next);
  };

  // 아이템 삭제
  const handleRemoveItem = (id) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
  };

  //  옵션 바 클릭 시 열기 / 닫기
  const handleToggleOptionsOpen = (id) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, isOptionsOpen: !item.isOptionsOpen } : item
    );
    setItems(next);
  };

  // 옵션별 수량 변경
  const handleChangeOptionQty = (itemId, optionIndex, delta) => {
    const next = items.map((item) => {
      if (item.id !== itemId) return item;
      const newOptions = item.options.map((opt, idx) => {
        if (idx !== optionIndex) return opt;
        const nextCount = Math.max(0, opt.count + delta);
        return { ...opt, count: nextCount };
      });
      return { ...item, options: newOptions };
    });
    setItems(next);
  };

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
          <button className="cart-select-remove-btn">선택 삭제</button>
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
            <span>0원</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>주문 금액</span>
            <span>{formatPrice(selectedTotalPrice)}원</span>
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
            {formatPrice(selectedTotalPrice)}원 주문하기
          </span>
        </button>
      </div>
    </div>
  );
}
