import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth';
import styles from './SignupPage.module.css';
import logoSmall from '../../assets/mealforyou_logo.svg';
import eyeIcon from '../../assets/eye.svg';
import eyeHideIcon from '../../assets/eye-hide-line.svg';
import lockIcon from '../../assets/lock.svg';
import correctIcon from '../../assets/correct.svg';
import wrongIcon from '../../assets/wrong.svg';

// Daum Postcode Script
const loadDaumPostcodeScript = () => {
  return new Promise((resolve) => {
    if (window.daum && window.daum.Postcode) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => resolve();
    script.onerror = () => console.error('Failed to load Daum Postcode script');
    document.head.appendChild(script);
  });
};

export default function SignupPage() {
  useEffect(() => {
    loadDaumPostcodeScript().catch(error => {
      console.error('Failed to load Daum Postcode script:', error);
    });
    
    return () => {
      if (window.daum && window.daum.Postcode && window.daum.Postcode.close) {
        window.daum.Postcode.close();
      }
    };
  }, []);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [verificationExpiry, setVerificationExpiry] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone1: '',
    phone2: '',
    phone3: '',
    email: ''
  });

  const [address, setAddress] = useState({
    postcode: '',
    roadAddress: '',
    detailAddress: '',
    extraAddress: ''
  });

  const timerRef = useRef();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return '이메일을 입력해주세요.';
    if (!regex.test(email)) return '유효한 이메일 주소를 입력해주세요.';
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return '비밀번호는 8자 이상 16자 이하여야 합니다.';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return '영문을 최소 하나 이상 포함해주세요.';
    }
    if (!/[0-9]/.test(password)) {
      return '숫자를 최소 하나 이상 포함해주세요.';
    }
    if (!/[!@#$*]/.test(password)) {
      return '특수문자(!@#$*)를 최소 하나 포함해주세요.';
    }
    return '';
  };

  const checkPasswordMatch = (pass, confirmPass) => {
    if (pass && confirmPass && pass !== confirmPass) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword) || checkPasswordMatch(newPassword, confirmPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordError(checkPasswordMatch(password, newConfirmPassword));
  };

  const handleAddressSearch = () => {
    loadDaumPostcodeScript().then(() => {
      new window.daum.Postcode({
        oncomplete: function(data) {
          let fullAddress = data.address;
          let extraAddress = '';
          
          if (data.addressType === 'R') {
            if (data.bname !== '') {
              extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
              extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
          }

          setAddress(prev => ({
            ...prev,
            postcode: data.zonecode,
            roadAddress: fullAddress,
            extraAddress: extraAddress
          }));
          
          document.getElementById('detailAddress')?.focus();
        },
        width: '100%',
        height: '100%',
        maxSuggestItems: 7
      }).open({
        left: (window.screen.width / 2) - 200,
        top: (window.screen.height / 2) - 300
      });
    }).catch(error => {
      console.error('Failed to load address search:', error);
      alert('주소 검색을 불러오는 데 실패했습니다. 새로고침 후 다시 시도해주세요.');
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendVerification = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }
    
    setEmailError('');
    setVerificationSent(false);
    setIsVerified(false);
    setVerificationInput('');
    setTimeLeft(300);
    setVerificationExpiry(Date.now() + 24 * 60 * 60 * 1000);
    
    try {
      await authService.sendVerificationCode(formData.email);
      setVerificationSent(true);
    } catch (error) {
      console.error('인증코드 발송 실패:', error);
      setEmailError(error.response?.data?.message || '인증코드 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyCode = async (code) => {
    if (!code || code.length !== 4) {
      setEmailError('유효한 인증번호를 입력해주세요.');
      setIsVerified(false);
      return;
    }
    
    try {
      const response = await authService.verifyEmailCode(formData.email, code);
      
      if (response) {
        setIsVerified(true);
        setTimeLeft(0);
        setEmailError('');
        
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        setVerificationExpiry(expiryTime.getTime());
      }
      
    } catch (error) {
      console.error('인증 실패:', error);
      setEmailError(error.response?.data?.message || '인증에 실패했습니다. 인증번호를 확인해주세요.');
      setIsVerified(false);
    }
  };

  const handleVerificationInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setVerificationInput(value);
    
    if (value.length === 4) {
      handleVerifyCode(value);
    } else if (isVerified) {
      setIsVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    try {
      const userData = {
        email: formData.email,
        name: `${formData.lastName}${formData.firstName}`,
        password: password,
        passwordConfirm: confirmPassword,
        phoneRaw: `${formData.phone1}${formData.phone2}${formData.phone3}`,
        address: {
          zipCode: address.postcode,
          roadAddress: address.roadAddress,
          detailAddress: address.detailAddress
        }
      };
      
      await authService.signup(userData);
      
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const isAllFieldsFilled = 
      formData.firstName && 
      formData.lastName && 
      formData.phone1 && 
      formData.phone2 && 
      formData.phone3 &&
      formData.email &&
      isVerified &&
      password && 
      confirmPassword &&
      !passwordError &&
      !emailError &&
      address.postcode &&
      address.roadAddress &&
      address.detailAddress;
    
    setIsFormValid(!!isAllFieldsFilled);
  }, [formData, isVerified, password, confirmPassword, passwordError, emailError, address]);

  useEffect(() => {
    if (isVerified && verificationExpiry && Date.now() > verificationExpiry) {
      setIsVerified(false);
      setVerificationSent(false);
      setEmailError('인증 유효기간이 만료되었습니다. 다시 인증해주세요.');
      return;
    }

    if (verificationSent && timeLeft > 0 && !isVerified) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && verificationSent && !isVerified) {
      setVerificationSent(false);
      setEmailError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      setIsVerified(false);
    }
    
    return () => clearTimeout(timerRef.current);
  }, [verificationSent, timeLeft, isVerified, verificationExpiry]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.logoButton}>
          <img src={logoSmall} alt="밀크유" />
        </button>
      </header>

      <h2 className={styles.title}>회원가입</h2>
      <p className={styles.subtitle}>
        이미 회원이신가요? <span onClick={() => navigate('/login')} className={styles.loginLink}>로그인하기</span>
      </p>

      <div className={styles.formGroup}>
        <label>이름</label>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="성" 
          />
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="이름" 
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>전화번호</label>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="phone1"
            value={formData.phone1}
            onChange={handleInputChange}
            placeholder="010" 
            maxLength={3} 
          />
          <input 
            type="text" 
            name="phone2"
            value={formData.phone2}
            onChange={handleInputChange}
            placeholder="0000" 
            maxLength={4} 
          />
          <input 
            type="text" 
            name="phone3"
            value={formData.phone3}
            onChange={handleInputChange}
            placeholder="0000" 
            maxLength={4} 
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>주소</label>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="우편번호" 
            value={address.postcode}
            readOnly
            className={styles.readonlyInput}
          />
          <button 
            type="button"
            onClick={handleAddressSearch}
            className={styles.addressButton}
          >
            우편번호 찾기
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="도로명주소" 
            value={address.roadAddress}
            readOnly
            className={styles.readonlyInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            id="detailAddress"
            name="detailAddress"
            placeholder="상세주소" 
            value={address.detailAddress}
            onChange={handleAddressChange}
          />
          <input 
            type="text" 
            placeholder="참고항목" 
            value={address.extraAddress}
            readOnly
            className={styles.readonlyInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>이메일 인증</label>
        <div className={styles.inputGroup}>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e);
              setEmailError('');
              if (verificationSent) {
                setVerificationSent(false);
                setIsVerified(false);
                setVerificationInput('');
              }
            }}
            placeholder="이메일을 입력해주세요." 
            disabled={isVerified}
            className={`${emailError ? styles.emailInputError : ''} ${isVerified ? styles.emailInputDisabled : ''}`}
          />
          <button 
            onClick={handleSendVerification}
            disabled={isVerified || !formData.email}
            className={`${styles.verificationButton} ${
              isVerified ? styles.verified : 
              (!formData.email ? '' : styles.active)
            }`}
            type="button"
          >
            {isVerified ? '인증완료' : (verificationSent ? '재전송' : '인증받기')}
          </button>
        </div>
        
        {emailError && !verificationSent && (
          <div className={styles.emailError}>
            <img src={wrongIcon} alt="" className={styles.messageIcon} />
            {emailError}
          </div>
        )}
        
        {verificationSent && !isVerified && (
          <div className={styles.verificationWrapper}>
            <div className={styles.verificationInputWrapper}>
              <input 
                type="text" 
                value={verificationInput}
                onChange={handleVerificationInputChange}
                placeholder="인증번호 4자리 입력" 
                maxLength={4}
                className={`${styles.verificationInput} ${emailError ? styles.error : ''}`}
              />
              {timeLeft > 0 && (
                <div className={`${styles.timer} ${timeLeft < 60 ? styles.warning : ''}`}>
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
            
            <div className={`${styles.verificationMessage} ${emailError ? styles.error : ''}`}>
              {emailError ? (
                <>
                  <img src={wrongIcon} alt="오류" className={styles.messageIcon} />
                  {emailError}
                </>
              ) : (
                <>
                  <img src={correctIcon} alt="안내" className={styles.messageIcon} />
                  {verificationInput.length === 4 
                    ? '인증번호를 확인 중입니다...'
                    : `인증번호가 이메일로 전송되었습니다. ${formatTime(timeLeft)} 내에 입력해주세요.`}
                </>
              )}
            </div>
          </div>
        )}
        
        {isVerified && (
          <div className={styles.verificationSuccess}>
            <img src={correctIcon} alt="인증완료" className={styles.successIcon} />
            이메일 인증이 완료되었습니다. (24시간 동안 유효)
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>비밀번호</label>
        <div className={styles.passwordWrapper}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요." 
            className={`${styles.passwordInput} ${passwordError ? styles.error : ''} ${!password ? styles.withIcon : ''}`}
          />
          {passwordError && (
            <div className={styles.passwordError}>
              <img src={wrongIcon} alt="" className={styles.errorIcon} />
              {passwordError}
            </div>
          )}
          {!password && (
            <img src={lockIcon} alt="" className={styles.lockIcon} />
          )}
          <div className={styles.eyeIconWrapper}>
            <img 
              src={showPassword ? eyeHideIcon : eyeIcon} 
              alt={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>비밀번호 확인</label>
        <div className={styles.passwordWrapper}>
          <input 
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호를 다시 입력해주세요." 
            className={`${styles.passwordInput} ${password && confirmPassword && password !== confirmPassword ? styles.error : ''} ${!confirmPassword ? styles.withIcon : ''}`}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div className={styles.passwordError}>
              <img src={wrongIcon} alt="" className={styles.errorIcon} />
              비밀번호가 일치하지 않습니다.
            </div>
          )}
          {!confirmPassword && (
            <img src={lockIcon} alt="" className={styles.lockIcon} />
          )}
          <div className={styles.eyeIconWrapper}>
            <img 
              src={showConfirmPassword ? eyeHideIcon : eyeIcon} 
              alt={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.eyeIcon}
            />
          </div>
        </div>
      </div>

      <div className={styles.checkboxContainer}>
        <div className={styles.checkboxRow}>
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">서비스 이용약관 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink}>자세히 보기</span>
        </div>
        
        <div className={styles.checkboxRow}>
          <input type="checkbox" id="privacy" />
          <label htmlFor="privacy">개인정보 처리방침 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink}>자세히 보기</span>
        </div>
        
        <div className={styles.checkboxRow}>
          <input type="checkbox" id="finance" />
          <label htmlFor="finance">전자금융거래 이용약관 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink}>자세히 보기</span>
        </div>
      </div>

      <div className={styles.submitButtonWrapper}>
        <button 
          className={`${styles.submitButton} ${isFormValid ? styles.active : ''}`}
          disabled={!isFormValid}
          onClick={handleSubmit}
          type="button"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}