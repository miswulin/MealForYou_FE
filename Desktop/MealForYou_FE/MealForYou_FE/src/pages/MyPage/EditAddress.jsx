import styles from "../MyPage/EditAddress.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";

export default function EditAddress() {
  const [errors, setErrors] = useState({});
  // UI용 handleChange — 동작은 X, 에러 방지
  return (
    <main>
      {/* 헤더 */}
      <Header
        title="배송지 관리"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      {/* 현재 주소정보*/}
      <section className={styles.section1}>
        <div className={styles.textwrapper}>
          <span className={styles.name}>김멋사</span>
          <span className={styles.badge}>기본주소</span>
        </div>
        <p className={styles.address}>
          [01797] 서울특별시 노원구 화랑로 621 서울여자대학교 50주년 기념관
          306호
        </p>
        <p className={styles.phone}>010-0000-0000</p>
      </section>
      <hr />

      {/* 새로운 주소 입력 */}
      <section className={styles.newAddress}>
        <form className={styles.form}>
          {/* onSubmit={handleSubmit} */}
          {/* 현재 비밀번호 */}
          <p className={styles.sectionTitle}>새로운 주소</p>
          {/* 우편번호 + 버튼 */}
          <div className={styles.zipRow}>
            <input type="text" placeholder="01797" className={styles.input} />
            <button className={styles.zipBtn}>우편번호 찾기</button>
          </div>
          {/* 나머지 입력칸 */}
          <input
            type="text"
            placeholder="서울 노원구 화랑로 621"
            className={styles.input}
          />
          <div className={styles.zipRow}>
            <input
              type="text"
              placeholder="50주년 기념관 306호"
              className={styles.input}
            />
            <input
              type="text"
              placeholder="참고항목"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.editbtn} disabled>
            수정하기
          </button>
        </form>
      </section>
    </main>
  );
}
