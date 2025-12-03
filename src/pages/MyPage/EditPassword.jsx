import lock from "../../assets/lock.svg";
import eye from "../../assets/eye.svg";
import wrong from "../../assets/wrong.svg";
import styles from "../MyPage/EditPassword.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/auth";

export default function EditPassword() {
  const navigate = useNavigate();

  // 폼 값
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  // 비밀번호 입력 보이기/숨기기
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return "8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$*])[a-z0-9!@#$*]{8,16}$/;

    if (!passwordRegex.test(password)) {
      return "8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함";
    }

    return "";
  };

  // 비밀번호 일치 여부 확인
  const checkPasswordMatch = (pass, confirmPass) => {
    if (!pass || !confirmPass) return "";
    if (pass !== confirmPass) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
  };

  // 인풋 변경 핸들러 (세 필드 공통)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitError("");
    setSubmitSuccess("");

    // 필드별 에러 처리
    if (name === "currentPassword") {
      setErrors((prev) => ({
        ...prev,
        currentPassword: value ? "" : "현재 비밀번호를 입력해주세요.",
      }));
    }

    if (name === "newPassword") {
      const pwError = validatePassword(value);
      const matchError = form.newPasswordConfirm
        ? checkPasswordMatch(value, form.newPasswordConfirm) // 일치 체크
        : "";
      setErrors((prev) => ({
        ...prev,
        newPassword: pwError,
        newPasswordConfirm: matchError,
      }));
    }

    if (name === "newPasswordConfirm") {
      const matchError = checkPasswordMatch(form.newPassword, value);
      setErrors((prev) => ({
        ...prev,
        newPasswordConfirm: matchError,
      }));
    }
  };

  // 제출 가능 여부
  const isFormValid =
    form.currentPassword &&
    form.newPassword &&
    form.newPasswordConfirm &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.newPasswordConfirm;

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종 한 번 더 체크
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    };

    if (!form.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }

    const pwError = validatePassword(form.newPassword);
    if (pwError) {
      newErrors.newPassword = pwError;
    }

    const matchError = checkPasswordMatch(
      form.newPassword,
      form.newPasswordConfirm
    );
    if (!form.newPasswordConfirm) {
      newErrors.newPasswordConfirm = "비밀번호를 다시 입력해주세요.";
    } else if (matchError) {
      newErrors.newPasswordConfirm = matchError;
    }

    if (
      newErrors.currentPassword ||
      newErrors.newPassword ||
      newErrors.newPasswordConfirm
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      await apiClient.post("/auth/password/change", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        newPasswordConfirm: form.newPasswordConfirm,
      });

      setSubmitSuccess("비밀번호가 성공적으로 변경되었습니다.");

      // 필요하면 입력값 초기화
      setForm({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      const message =
        error?.response?.data?.message ||
        "비밀번호 변경 중 오류가 발생했습니다.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main>
      {/* 헤더 */}
      <Header
        title="비밀번호 변경"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <section className={styles.section}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 현재 비밀번호 */}
          <label className={styles.label}>현재 비밀번호</label>
          <div className={styles.inputWrapper}>
            <img src={lock} className={styles.lock} />
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              className={styles.input}
              onChange={handleChange}
              value={form.currentPassword}
              placeholder="현재 비밀번호를 입력해주세요."
            />
            <img
              src={eye}
              className={styles.eye}
              onClick={() => setShowCurrent((prev) => !prev)}
            />
          </div>
          {/* 현재 비밀번호 에러 메시지 */}
          {errors.currentPassword && (
            <p className={styles.error}>
              <img src={wrong} />
              {errors.currentPassword}
            </p>
          )}
          {/* 변경할 비밀번호 */}
          <label className={styles.label}>변경할 비밀번호</label>
          <div
            className={`${styles.inputWrapper} ${
              errors.newPassword ? styles.inputWrapperError : ""
            }`}
          >
            <img src={lock} className={styles.lock} />
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              className={`${styles.input} ${
                errors.newPassword ? styles.inputError : ""
              }`}
              onChange={handleChange}
              value={form.newPassword}
              placeholder="변경할 비밀번호를 입력해주세요."
            />
            <img
              src={eye}
              className={styles.eye}
              onClick={() => setShowNew((prev) => !prev)}
            />
          </div>
          {/* 안내문구 vs 에러문구: 둘 중 하나만 */}
          {errors.newPassword ? (
            <p className={styles.error}>
              <img src={wrong} />
              8~16자의 영문, 소문자, 숫자, 특수문자 !@#$* 를 조합하여
              입력해주세요.
            </p>
          ) : (
            <p className={styles.helper}>
              8~16자의 영문, 소문자, 숫자, 특수문자 !@#$* 를 조합하여
              입력해주세요.
            </p>
          )}
          {/* 변경할 비밀번호 확인 */}
          <label className={styles.label}>변경할 비밀번호 확인 </label>
          <div
            className={`${styles.inputWrapper} ${
              errors.newPasswordConfirm ? styles.inputWrapperError : ""
            }`}
          >
            <img src={lock} className={styles.lock} />
            <input
              type={showConfirm ? "text" : "password"}
              name="newPasswordConfirm"
              className={`${styles.input} ${
                errors.newPasswordConfirm ? styles.inputError : ""
              }`}
              onChange={handleChange}
              value={form.newPasswordConfirm}
              placeholder="비밀번호를 다시 입력해주세요."
            />
            <img
              src={eye}
              className={styles.eye}
              onClick={() => setShowConfirm((prev) => !prev)}
            />
          </div>
          {errors.newPasswordConfirm && (
            <p className={styles.error}>
              <img src={wrong} />
              {errors.newPasswordConfirm}
            </p>
          )}
          <button
            type="submit"
            className={styles.editbtn}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
        </form>
      </section>
    </main>
  );
}
