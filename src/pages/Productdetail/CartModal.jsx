import React from "react";
import "./CartModal.css";

export default function CartModal({ isOpen, onClose, onGoCart }) {
  if (!isOpen) return null;

  return (
    <div className="cartmodal-overlay">
      <div className="cartmodal-container">

        <h3 className="cartmodal-title">장바구니 담기 완료!</h3>
        <p className="cartmodal-text">
          선택한 상품이 장바구니에 추가되었습니다.<br />
          쇼핑을 계속 하시겠습니까?
        </p>

        <div className="cartmodal-actions">
          <button className="cartmodal-btn-outline" onClick={onClose}>
            쇼핑 계속하기
          </button>
          <button className="cartmodal-btn-orange" onClick={onGoCart}>
            장바구니 이동
          </button>
        </div>

      </div>
    </div>
  );
}
