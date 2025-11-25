import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import styles from "../MyPage/EditPassword.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
export default function EditPassword() {
  const [errors, setErrors] = useState({});
  // UI용 handleChange — 동작은 X, 에러 방지
  const handleChange = (e) => {};
  return (
    <main>
      {/* 헤더 */}
      <Header
        title="비밀번호 변경"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />
      <section>
        <form className={styles.form}>
          {/* onSubmit={handleSubmit} */}
          {/* 현재 비밀번호 */}
          <label className={styles.label}>현재 비밀번호</label>
          <div className={styles.inputWrapper}>
            <img src={lock} className={styles.lock} />
            <input
              type="password"
              name="password"
              className={styles.input}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력해주세요."
            />
            <img src={eye} className={styles.eye} />
          </div>
          {/* 변경할 비밀번호 */}
          <label className={styles.label}>변경할 비밀번호</label>
          <div className={styles.inputWrapper}>
            <img src={lock} className={styles.lock} />
            <input
              type="email"
              name="email"
              className={styles.input}
              onChange={handleChange}
              placeholder="변경할 비밀번호를 입력해주세요."
            />
            <img src={eye} className={styles.eye} />
          </div>
          <p className={styles.error}>
            8~16자의 영문, 소문자, 숫자, 특수문자 !@#$* 를 조합하여
            입력해주세요.
          </p>
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          {/* 변경할 비밀번호 확인 */}
          <label className={styles.label}>변경할 비밀번호 확인 </label>
          <div className={styles.inputWrapper}>
            <img src={lock} className={styles.lock} />
            <input
              type="email"
              name="email"
              className={styles.input}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요."
            />
            <img src={eye} className={styles.eye} />
          </div>
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          <button type="submit" className={styles.editbtn} disabled>
            수정하기
          </button>
        </form>
      </section>
    </main>
  );
}
