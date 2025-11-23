import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBar from "../../components/StatusBar";
import Header from "../../components/Header";

import "./Order.css";
import bibimbap from "../../assets/images/bibimbap.png";
import upIcon from "../../assets/images/up.png"

// 결제수단 목록
const PAYMENT_METHODS = [
  { id: "card-easy", label: "카드 간편결제" },
  { id: "account-easy", label: "계좌 간편결제" },
  { id: "card-normal", label: "일반결제" },
  { id: "naverpay", label: "네이버페이" },
  { id: "kakaopay", label: "카카오페이" },
  { id: "tosspay", label: "토스페이" },
];

export default function Order() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Cart에서 넘어온 선택 상품 (없으면 샘플 데이터)
  const selectedItems =
    state?.selectedItems && state.selectedItems.length > 0
      ? state.selectedItems
      : [
          {
            id: 1,
            name: "밀키트 메뉴 이름",
            price: 10000,
            qty: 1,
            optionsSummary: "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…",
          },
          {
            id: 2,
            name: "밀키트 메뉴 이름",
            price: 10000,
            qty: 1,
            optionsSummary: "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…",
          },
        ];

  const [isItemsOpen, setIsItemsOpen] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  // 배송지 정보 (나중에 API 연결하면 여기만 교체)
  const shipping = {
    name: "김수니",
    phone: "010-0000-0000",
    address: "(01797) 서울 노원구 화랑로 621, 50주년기념관 306호",
  };

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  const productsTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems]
  );

  const deliveryFee = 0;
  const finalTotal = productsTotal + deliveryFee;

  const handlePay = () => {
    // 주문번호 간단 생성 (나중에 API 연동하면 서버에서 받은 값으로 대체)
    const orderNumber = Date.now().toString();
  
    // 주문완료 페이지로 이동 + 주문 정보 같이 넘기기
    navigate("/OrderComplete", {
      state: {
        order: {
          orderNumber,
          items: selectedItems,
          deliveryFee,
          shipping,
          paidAt: new Date().toLocaleString("ko-KR"),
          payMethod: selectedMethod,
          totalPrice: finalTotal,
        },
      },
    });
  };

  const [isShippingOpen, setIsShippingOpen] = useState(true);
  return (
    <div className="order-root">
      <StatusBar />
      <Header
        title="주문 / 결제"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      <main className="order-main">
        {/* 배송지 */}
        <section className="order-section order-shipping">
          <div className="order-section-header">
            <h2 className="order-section-title">배송지</h2>
            <button className="order-section-toggle" type="button" onClick={() => setIsShippingOpen((v) => !v)}>
              <img src={upIcon} alt="열기" className={`toggle-icon ${isShippingOpen ? "open" : "closed"}`} />
            </button>
          </div>
          {isShippingOpen && (
          <div className="order-shipping-body">
            <dl className="order-shipping-row">
              <dt>수령인</dt>
              <dd>{shipping.name}</dd>
            </dl>
            <dl className="order-shipping-row">
              <dt>전화번호</dt>
              <dd>{shipping.phone}</dd>
            </dl>
            <dl className="order-shipping-row">
              <dt>주소</dt>
              <dd>{shipping.address}</dd>
            </dl>
          </div>
        )}
        </section>

        {/* 주문 상품 */}
        <section className="order-section order-items">
          <button
            type="button"
            className="order-section-header order-items-header"
            onClick={() => setIsItemsOpen((v) => !v)}
          >
            <h2 className="order-section-title">주문 상품</h2>
            <span className="order-section-toggle">
              {isItemsOpen ? "▴" : "▾"}
            </span>
          </button>

          {isItemsOpen && (
            <div className="order-items-list">
              {selectedItems.map((item) => (
                <article key={item.id} className="order-item">
                  <div className="order-item-thumb-wrap">
                    <img
                      src={bibimbap}
                      alt={item.name}
                      className="order-item-thumb"
                    />
                  </div>
                  <div className="order-item-info">
                    <div className="order-item-top-row">
                      <h3 className="order-item-name">{item.name}</h3>
                      <span className="order-item-qty">{item.qty}개</span>
                    </div>
                    <p className="order-item-options">
                      {item.optionsSummary ||
                        "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…"}
                    </p>
                    <p className="order-item-price">
                      {formatPrice(item.price * item.qty)}원
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 결제 금액 */}
        <section className="order-section order-price">
          <h2 className="order-section-title">결제 금액</h2>
          <div className="order-price-body">
            <div className="order-price-row">
              <span>선택 상품 금액</span>
              <span>{formatPrice(productsTotal)}원</span>
            </div>
            <div className="order-price-row">
              <span>배송비</span>
              <span>{formatPrice(deliveryFee)}원</span>
            </div>
            <div className="order-price-row order-price-final">
              <span>최종 결제 금액</span>
              <span className="order-price-final-value">
                {formatPrice(finalTotal)}원
              </span>
            </div>
          </div>
        </section>

        {/* 결제수단 */}
        <section className="order-section order-pay-method">
          <h2 className="order-section-title">결제수단</h2>
          <div className="order-pay-method-list">
            {PAYMENT_METHODS.map((method) => (
              <label key={method.id} className="order-pay-method-row">
                <input
                  type="radio"
                  name="payMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="order-notice">
          주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
        </p>
      </main>

      {/* 하단 결제 버튼 */}
      <div className="order-bottom-bar">
        <button
            className="order-pay-btn"
            disabled={selectedItems.length === 0}
            onClick={handlePay}
        >
         <span className="order-pay-text">결제하기</span>
        </button>
        </div>
    </div>
  );
}
