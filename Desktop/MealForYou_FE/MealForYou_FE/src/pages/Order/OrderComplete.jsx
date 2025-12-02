import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBar from "../../components/StatusBar";
import Header from "../../components/Header";

import bibimbap from "../../assets/images/bibimbap.png";
import Box from "../../assets/images/box.png";
import CheckIcon from "../../assets/images/check.png";
import ShippingIcon from "../../assets/images/shippingbox.png";
import TruckIcon from "../../assets/images/truck.png";

import "./OrderComplete.css";

export default function OrderComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // navigate("/order-complete", { state: { order: {...} } })
  const order =
    state?.order || {
      orderNumber: "2019380174198447",
      paidAt: "2025-10-11 17:40:30",
      items: [
        {
          id: 1,
          name: "밀키트 메뉴 이름",
          optionsSummary: "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g) 1개…",
          price: 10000,
          qty: 1,
        },
      ],
      deliveryFee: 2500,
      shipping: {
        name: "김멋사",
        phone: "010-0000-0000",
        address:
          "[01797]서울특별시 노원구 화랑로 621(50주년기념관 306호)",
      },
    };

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  const productsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleGoHome = () => {
    navigate("/"); // 홈 경로는 프로젝트에 맞게 수정해도 돼
  };

  const handleGoOrderHistory = () => {
    // 나중에 주문내역 페이지 만들면 거기로 연결
    // 예: navigate("/orders");
    console.log("주문 내역 보기 클릭");
  };

  return (
    <div className="order-complete-root">
      <StatusBar />
      <Header
        title="주문완료"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      <main className="order-complete-main">
        <section className="oc-hero">
          <div className="oc-hero-img-wrap">
            <img src={Box} alt="hero" className="oc-hero-img" />
          </div>
          <p className="oc-hero-title">주문이 완료되었습니다</p>
          <p className="oc-hero-time">{order.paidAt}</p>

          {/* 진행 상태 3단계 (주문완료 / 배송중 / 배송완료) */}
          <div className="oc-steps">
            <div className="oc-step oc-step-active">
            <div className="oc-step-icon oc-step-icon-active">
              <img src={CheckIcon} alt="주문완료" />
            </div>
            <span className="oc-step-label">주문완료</span>
            </div>
            <div className="oc-step">
            <div className="oc-step-icon">
              <img src={ShippingIcon} alt="배송중" />
            </div>
            <span className="oc-step-label">배송중</span>
            </div>
            <div className="oc-step">
            <div className="oc-step-icon">
              <img src={TruckIcon} alt="배송완료" />
            </div>
            <span className="oc-step-label">배송완료</span>
            </div>
          </div>
        </section>

        {/* 주문 상품/번호 섹션 */}
        <section className="oc-section oc-order-info">
          <div className="oc-order-number-row">
            <span className="oc-order-number-label">주문번호</span>
            <span className="oc-order-number-value">{order.orderNumber}</span>
          </div>

          {order.items.map((item) => (
            <article key={item.id} className="oc-item-card">
              <div className="oc-item-thumb-wrap">
                <img
                  src={bibimbap}
                  alt={item.name}
                  className="oc-item-thumb"
                />
              </div>

              <div className="oc-item-body">
                <div className="oc-item-top-row">
                  <h3 className="oc-item-name">{item.name}</h3>
                  <span className="oc-item-badge">결제완료</span>
                </div>
                <p className="oc-item-options">
                  {item.optionsSummary ||
                    "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…"}
                </p>
                <div className="oc-item-bottom-row">
                  <span className="oc-item-price">
                    {formatPrice(item.price * item.qty)}원
                  </span>
                </div>
              </div>
            </article>
          ))}

          <div className="oc-order-fee-row">
            <span className="oc-order-fee-label">배송비</span>
            <span className="oc-order-fee-value">
              {formatPrice(order.deliveryFee)}원
            </span>
          </div>
        </section>

        {/* 배송 정보 섹션 */}
        <section className="oc-section oc-shipping">
          <div className="oc-section-header">
            <h2 className="oc-section-title">배송정보</h2>
            <button type="button" className="oc-address-btn">
              주소변경
            </button>
          </div>

          <div className="oc-shipping-body">
            <dl className="oc-shipping-row">
              <dt>수령인</dt>
              <dd>{order.shipping.name}</dd>
            </dl>
            <dl className="oc-shipping-row">
              <dt>휴대폰</dt>
              <dd>{order.shipping.phone}</dd>
            </dl>
            <dl className="oc-shipping-row">
              <dt>주소지</dt>
              <dd>{order.shipping.address}</dd>
            </dl>
          </div>
        </section>
      </main>

      {/* 하단 버튼 2개 */}
      <div className="oc-bottom-bar">
        <button
          type="button"
          className="oc-bottom-btn oc-bottom-btn-outline"
          onClick={handleGoOrderHistory}
        >
          주문 내역 보기
        </button>
        <button
          type="button"
          className="oc-bottom-btn oc-bottom-btn-primary"
          onClick={handleGoHome}
        >
          홈 화면 가기
        </button>
      </div>
    </div>
  );
}
