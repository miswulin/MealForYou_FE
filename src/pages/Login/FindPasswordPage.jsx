import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import styles from './FindPasswordPage.module.css';
import lockIcon from '../../assets/lock.svg';
import eyeIcon from '../../assets/eye.svg';
import eyeHideIcon from '../../assets/eye-hide-line.svg';
import correctIcon from '../../assets/correct.svg';
import wrongIcon from '../../assets/wrong.svg';

function FindPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setVerificationSent(false);
    }
  }, [timeLeft]);

  const startTimer = () => {
    setVerificationSent(true);
    setTimeLeft(300);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    setIsVerified(true);
    clearInterval(timerRef.current);
  };

  const handleSendVerification = () => {
    setVerificationSent(true);
    startTimer();
  };

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset submitted');
    
    setIsPasswordReset(true);
    
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    
    setIsPasswordReset(false);
    navigate('/login');
  };

  const validatePassword = (pass) => {
    const regex = /^[A-Za-z\d!@#$*]{8,16}$/;
    if (!regex.test(pass)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자(!@#$*) 포함';
    }
    return '';
  };

  const checkPasswordMatch = (pass, confirmPass) => {
    if (pass && confirmPass && pass !== confirmPass) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordError(validatePassword(newPass));
    setPasswordMatchError(checkPasswordMatch(newPass, confirmPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    setPasswordMatchError(checkPasswordMatch(newPassword, confirmPass));
  };

  const isFormValid = email && verificationCode && newPassword && confirmPassword && 
                     !passwordError && !passwordMatchError && newPassword === confirmPassword;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1>비밀번호 찾기</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>이메일 인증</label>
          <div className={styles.inputContainer}>
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={verificationSent}
              className={styles.emailInputWrapper}
            />
            <button 
              onClick={handleSendVerification}
              disabled={!email || verificationSent}
              className={styles.sendButton}
              type="button"
            >
              {verificationSent ? '재전송' : '인증받기'}
            </button>
          </div>
          <div className={styles.verificationWrapper}>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
              disabled={!verificationSent}
              className={styles.verificationInput}
            />
            {verificationSent && (
              <div className={styles.verificationSuccessMessage}>
                <img 
                  src={correctIcon} 
                  alt="인증완료" 
                  className={styles.verificationSuccessIcon}
                />
                인증번호가 전송되었습니다.
              </div>
            )}
            {verificationSent && timeLeft > 0 && (
              <div className={styles.timerDisplay}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>변경할 비밀번호</label>
          <div className={`${styles.inputContainer} ${styles.passwordInputWrapper}`}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="변경할 비밀번호를 입력해주세요."
              value={newPassword}
              onChange={handlePasswordChange}
              className={`${styles.inputField} ${styles.passwordInputField} ${
                passwordError ? styles.passwordErrorBorder : 
                newPassword && !passwordError ? styles.passwordSuccessBorder : ''
              }`}
            />
            <img src={lockIcon} alt="" className={styles.inputIcon} />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.toggleButton}
            >
              <img 
                src={showPassword ? eyeHideIcon : eyeIcon} 
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"} 
              />
            </button>
          </div>
          <div className={styles.passwordValidationWrapper}>
            {passwordError ? (
              <div className={styles.errorMessageWrapper}>
                <img src={wrongIcon} alt="오류" className={styles.errorIcon} />
                <span className={styles.errorText}>{passwordError}</span>
              </div>
            ) : !newPassword ? (
              <span className={styles.hintText}>
                8~16자의 영문, 소문자, 숫자, 특수문자(!@#$*) 포함
              </span>
            ) : null}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>변경할 비밀번호 확인</label>
          <div className={`${styles.inputContainer} ${styles.passwordInputWrapper}`}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`${styles.inputField} ${styles.passwordInputField} ${
                passwordMatchError ? styles.passwordErrorBorder : 
                confirmPassword && !passwordMatchError ? styles.passwordSuccessBorder : ''
              }`}
            />
            <img src={lockIcon} alt="" className={styles.inputIcon} />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.toggleButton}
            >
              <img 
                src={showConfirmPassword ? eyeHideIcon : eyeIcon} 
                alt={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"} 
              />
            </button>
          </div>
          <div className={styles.confirmPasswordWrapper}>
            {passwordMatchError ? (
              <div className={styles.successMessageWrapper}>
                <img src={wrongIcon} alt="오류" className={styles.errorIcon} />
                <span className={styles.errorText}>{passwordMatchError}</span>
              </div>
            ) : confirmPassword && !passwordMatchError ? (
              <div className={styles.successMessageWrapper}>
                <img src={correctIcon} alt="확인" className={styles.successIcon} />
                <span className={styles.successText}>비밀번호가 일치합니다.</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.fixedButtonContainer}>
          <button 
            type="submit" 
            disabled={!isFormValid}
            className={`${styles.submitButton} ${styles.fullWidthButton}`}
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default FindPasswordPage;