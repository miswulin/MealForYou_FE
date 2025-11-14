import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import styles from "../MyPage/EditPassword.module.css";
import React, { useEffect, useState } from "react";

export default function EditPassword() {
  const [errors, setErrors] = useState({});
  // 💡 일단 UI용 handleChange — 동작은 안해도 에러 방지
  const handleChange = (e) => {
    };
  return (
    <main>
      {/* 추후 헤더추가 */}
      <header></header>
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
              className={styles.password}
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
              className={styles.email}
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
              className={styles.email}
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
