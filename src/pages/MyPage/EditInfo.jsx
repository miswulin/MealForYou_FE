import profileIcon from "../../assets/profile.svg";
import styles from "../MyPage/EditInfo.module.css";
import React, { useEffect, useState } from "react";

export default function EditInfo() {
  // 💡 임시 데이터 (mock)
  const [form, setForm] = useState({
    lastname: "김",
    firstname: "멋사",
    phone1: "010",
    phone2: "1234",
    phone3: "5678",
    email: "likelion13th@swu.ac.kr",
  });
  const [errors, setErrors] = useState({});
  // 💡 일단 UI용 handleChange — 동작은 안해도 에러 방지
  const handleChange = (e) => {
   };
  return (
    <main>
      {/* 추후 헤더추가 */}
      <header></header>
      <section>
        <div className={styles.profile}>
          <img src={profileIcon} alt="Profile Icon" />
          <h3>
            {form.lastname}
            {form.firstname}
          </h3>
          <p>{form.email}</p>
        </div>
      </section>

      <hr className={styles.hr1} />

      <section>
        <form className={styles.form}>
          {/* onSubmit={handleSubmit} */}
          {/* 이름 칸 */}
          <label className={styles.label}>이름</label>
          {/* 성 */}
          <div className={styles.nameinput}>
          <input
            type="text"
            name="lastname"
            className={styles.name}
            value={form.lastname}
            onChange={handleChange}
          />
          {/* 이름 */}
          <input
            type="text"
            name="firstname"
            className={styles.name}
            value={form.firstname}
            onChange={handleChange}
          />
          </div>
          {/* 전화번호 칸 */}
          <label className={styles.label}>전화번호</label>
          <div className={styles.phoneinput}>
            <input
              type="text"
              name="phone1"
              className={styles.phone}
              value={form.phone1}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone2"
              maxLength={4}
              className={styles.phone}
              value={form.phone2}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone3"
              maxLength={4}
              className={styles.phone}
              value={form.phone3}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          {/* 이메일 칸 */}
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            name="email"
            className={styles.email}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          <button type="submit" className={styles.editbtn} disabled>
            수정하기
          </button>
        </form>
      </section>
    </main>
  );
}
