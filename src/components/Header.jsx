import React from "react";
import "./Header.css";

// 기본 PNG 아이콘 (필요시 props.icons로 덮어쓰기 가능)
import backPng   from "../assets/images/back.png";
import heartPng  from "../assets/images/heart.png";
import cartPng   from "../assets/images/cart.png";
import personPng from "../assets/images/person.png";

export default function Header({
  title = "",
  onBack,
  onHeart,
  onCart,
  onPerson,
  icons = {},
  showHeart = true,
  showCart = true,
  showPerson = true,
  cartCount = 0,
  className = "",
}) {
  const _icons = {
    back:   icons.back   || backPng,
    heart:  icons.heart  || heartPng,
    cart:   icons.cart   || cartPng,
    person: icons.person || personPng,
  };

  return (
    <header className={`header ${className}`}>
      {/* 뒤로가기 */}
      <button className="header-icon-btn-b" aria-label="뒤로가기" onClick={onBack}>
        <img src={_icons.back} alt="" className="header-icon-img" />
      </button>

      {/* 가운데 제목 */}
      <h1 className="header-title" title={title}>
        {title}
      </h1>

      {/* 오른쪽 아이콘들 */}
      <div className="header-right">
        {showHeart && (
          <button className="header-icon-btn" aria-label="찜" onClick={onHeart}>
            <img src={_icons.heart} alt="" className="header-icon-img" />
          </button>
        )}

        {showCart && (
          <button className="header-icon-btn header-cart-btn" aria-label="장바구니" onClick={onCart}>
            <img src={_icons.cart} alt="" className="header-icon-img" />
            {/* 뱃지 */}
            {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
          </button>
        )}

        {showPerson && (
          <button className="header-icon-btn" aria-label="마이페이지" onClick={onPerson}>
            <img src={_icons.person} alt="" className="header-icon-img" />
          </button>
        )}
      </div>
    </header>
  );
}
