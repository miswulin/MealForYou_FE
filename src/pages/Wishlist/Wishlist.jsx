import styles from "../Wishlist/Wishlist.module.css";
import React, { useEffect, useState } from "react";

export default function Wishlist() {
  return (
    <main>
      {/* 추후 헤더추가 */}
      <header></header>
      <section>
        {/* 상단 선택 영역 */}
        <div className={styles.topbar}>
            <label className={styles.left}>
              <input type="checkbox" id="all" /> 전체 선택 (1/6)
            </label>
          <span className={styles.right}>선택삭제</span>
        </div>
        {/* 찜 상품 목록 */}
        <div className={styles.wishlist}>
          <div className={styles.item}>
            <img />
            <input type="checkbox" />
            <h3>밀포유 소불고기 밀박스</h3>
            <p>13000원</p>
          </div>
        </div>
      </section>
    </main>
  );
}
