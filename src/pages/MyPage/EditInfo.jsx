import profileIcon from "../../assets/profile.svg";
import styles from "../MyPage/EditInfo.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { memberInfo } from "../../api/member";

export default function EditInfo() {
  const navigate = useNavigate();

  // 원본 폼(백에서 가져온 값)
  const [originalForm, setOriginalForm] = useState(null);

  // 현재 입력 폼 상태
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 기존 회원정보 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await memberInfo.getMyInfo();

        // 성/이름 분리
        const rawName = (data.name || "").trim();
        const lastname = rawName.slice(0, 1);
        const firstname = rawName.slice(1);

        // 전화번호 3칸으로 분리
        let phone1 = "010";
        let phone2 = "";
        let phone3 = "";

        if (data.phone) {
          let raw = data.phone;

          // "+821012345678" → "01012345678"
          if (raw.startsWith("+82")) {
            raw = "0" + raw.slice(3); // "+82" 제거 후 앞에 "0" 붙임
          }

          const digits = raw.replace(/\D/g, ""); // 숫자만 남기기

          phone1 = digits.slice(0, 3);
          phone2 = digits.slice(3, 7);
          phone3 = digits.slice(7, 11);
        }

        const fetched = {
          lastname,
          firstname,
          phone1,
          phone2: phone2 || "",
          phone3: phone3 || "",
          email: data.email || "",
        };

        // 원본 값 & 폼 값 모두 세팅
        setOriginalForm(fetched);
        setForm(fetched);
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
        alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // 수정 여부 확인
  const isFormChanged = () => {
    if (!originalForm) return false;
    return (
      originalForm.lastname !== form.lastname ||
      originalForm.firstname !== form.firstname ||
      originalForm.phone1 !== form.phone1 ||
      originalForm.phone2 !== form.phone2 ||
      originalForm.phone3 !== form.phone3 ||
      originalForm.email !== form.email
    );
  };

  // input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 칸은 숫자만 입력
    if (name === "phone1" || name === "phone2" || name === "phone3") {
      const onlyDigits = value.replace(/\D/g, "");
      setForm((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정하기
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.lastname || !form.firstname) {
      newErrors.name = "성과 이름을 모두 입력해주세요.";
    }

    const phone = `${form.phone1}-${form.phone2}-${form.phone3}`;
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      newErrors.phone = "전화번호 형식을 확인해주세요.";
    }

    if (!form.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name: form.lastname + form.firstname, // 다시 합쳐서 name으로
      phoneRaw: phone, // 010-1234-5678 형식으로 phoneRaw
      email: form.email,
    };

    try {
      setIsSubmitting(true);
      await memberInfo.updateMyInfo(payload);
      alert("회원정보가 수정되었습니다.");
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      alert(
        error.response?.data?.message ||
          "회원 정보를 수정하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* 헤더 */}
      <Header
        title="회원정보 수정"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <section>
        <div className={styles.profile}>
          <img src={profileIcon} alt="Profile Icon" />
          <h3>
            {originalForm?.lastname}
            {originalForm?.firstname}
          </h3>
          <p>{originalForm?.email}</p>
        </div>
      </section>

      {/* 구분선 */}
      <hr className={styles.hr1} />

      {/* 수정 폼 */}
      <section>
        <form className={styles.form} onSubmit={handleSubmit}>
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
              placeholder="성"
            />
            {/* 이름 */}
            <input
              type="text"
              name="firstname"
              className={styles.name}
              value={form.firstname}
              onChange={handleChange}
              placeholder="이름"
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
              maxLength={3}
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
          <button
            type="submit"
            className={styles.editbtn}
            disabled={!isFormChanged() || isSubmitting}
          >
            수정하기
          </button>
        </form>
      </section>
    </main>
  );
}
