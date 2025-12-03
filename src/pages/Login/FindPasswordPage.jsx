import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import { resetPassword, authService } from '../../api/auth';
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

  const handleVerificationCodeChange = async (e) => {
    const code = e.target.value.replace(/\D/g, '').slice(0, 4); // 숫자만 허용하고 4자리로 제한
    setVerificationCode(code);
    
    // 4자리 입력 시 자동으로 인증 시도
    if (code.length === 4) {
      try {
        await authService.verifyEmailCode(email, code);
        setIsVerified(true);
        clearInterval(timerRef.current);
        // alert는 사용자 경험을 위해 제거하고, UI로만 표시
      } catch (error) {
        console.error('인증코드 검증 오류:', error);
        // 오류 메시지는 UI에 표시되므로 alert 제거
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return '이메일을 입력해주세요.';
    if (!regex.test(email)) return '유효한 이메일 주소를 입력해주세요.';
    return '';
  };

  const handleSendVerification = async () => {
    try {
      const emailError = validateEmail(email);
      if (emailError) {
        alert(emailError);
        return;
      }

      const response = await authService.sendVerificationCode(email);
      startTimer();
      alert('인증코드가 이메일로 전송되었습니다.');
      
      // In development, log the verification code to console
      if (process.env.NODE_ENV === 'development' && response.devCode) {
        console.log('Dev Verification Code:', response.devCode);
      }
    } catch (error) {
      console.error('인증코드 전송 오류:', error);
      alert(error.message || '인증코드 전송 중 오류가 발생했습니다.');
    }
  };

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordError || passwordMatchError) {
      alert('입력 정보를 확인해주세요.');
      return;
    }
    
    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    
    try {
      await resetPassword(email, newPassword, confirmPassword);
      alert('비밀번호가 성공적으로 변경되었습니다.\n새 비밀번호로 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      const errorMessage = error.message || '비밀번호 재설정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const validatePassword = (password) => {
    // 길이 체크
    if (password.length < 8 || password.length > 16) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
    }
    
    // 모든 조건을 한 번에 검사
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$*])[a-z0-9!@#$*]{8,16}$/;
    
    if (!passwordRegex.test(password)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
    }
    
    return ''; // 모든 조건 만족
  };

  const checkPasswordMatch = (pass, confirmPass) => {
    if (!pass || !confirmPass) return '';
    if (pass !== confirmPass) {
      return '비밀번호가 일치하지 않습니다.';
    }
    // 비밀번호 유효성 검사도 함께 수행
    const passwordError = validatePassword(pass);
    if (passwordError) {
      return passwordError;
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
            <div className={styles.verificationInputContainer}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="인증번호 4자리 입력"
                disabled={!verificationSent || isVerified}
                className={`${styles.verificationInput} ${isVerified ? styles.verified : ''} ${
                  verificationCode.length === 4 && !isVerified ? styles.verifying : ''
                }`}
                maxLength={4}
              />
              {isVerified && (
                <div className={styles.verificationSuccessMessage}>
                  <img 
                    src={correctIcon} 
                    alt="인증완료" 
                    className={styles.verificationSuccessIcon}
                  />
                  인증이 완료되었습니다.
                </div>
              )}
            </div>
            {verificationSent && !isVerified && timeLeft > 0 && (
              <div className={styles.timerDisplay}>
                {formatTime(timeLeft)}
              </div>
            )}
            {verificationSent && !isVerified && timeLeft === 0 && (
              <div className={styles.errorText}>
                인증 시간이 만료되었습니다. 다시 시도해주세요.
              </div>
            )}
            {verificationCode.length === 4 && !isVerified && (
              <div className={styles.verifyingText}>
                인증 중...
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