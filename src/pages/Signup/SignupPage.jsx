import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/auth';
import styles from './SignupPage.module.css';
import TermsModal from '../../components/TermsModal/TermsModal';
import { SERVICE_TERMS, PRIVACY_POLICY, FINANCIAL_TERMS } from '../../constants/terms';
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
  // 컴포넌트 마운트 시 Daum Postcode 스크립트 로드
  useEffect(() => {
    loadDaumPostcodeScript().catch(error => {
      console.error('Failed to load Daum Postcode script:', error);
    });
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      // Daum Postcode 팝업이 열려있을 경우 닫기
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
  const [timeLeft, setTimeLeft] = useState(300); // 5분(초 단위)
  const [verificationExpiry, setVerificationExpiry] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: ''
  });
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

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return '이메일을 입력해주세요.';
    if (!regex.test(email)) return '유효한 이메일 주소를 입력해주세요.';
    return '';
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    // 길이 체크
    if (password.length < 8 || password.length > 16) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
    }
    
    // 모든 조건을 한 번에 검사
    // ^(?=.*[a-z]): 적어도 하나의 소문자 포함
    // (?=.*[0-9]): 적어도 하나의 숫자 포함
    // (?=.*[!@#$*]): 적어도 하나의 특수문자(!@#$*) 포함
    // [a-zA-Z0-9!@#$*]{8,16}$: 허용된 문자들로 8~16자
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$*])[a-z0-9!@#$*]{8,16}$/;
    
    if (!passwordRegex.test(password)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
    }
    
    return ''; // 모든 조건 만족
  };

  // 비밀번호 일치 여부 확인
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

  // 폼 입력 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword) || checkPasswordMatch(newPassword, confirmPassword));
  };

  // 비밀번호 확인 변경 처리
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordError(checkPasswordMatch(password, newConfirmPassword));
  };

  // 주소 검색 핸들러
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
          
          // 상세주소 입력 필드로 포커스 이동
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

  // 주소 입력 변경 핸들러
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 인증 코드 전송 처리
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
    setTimeLeft(300);// 5분으로 초기화
    setVerificationExpiry(Date.now() + 24 * 60 * 60 * 1000);// 24시간으로 초기화
    
    try {
      // 이메일 인증 코드 발송 API 호출
      await authService.sendVerificationCode(formData.email);
      // 성공적으로 전송된 경우
      setVerificationSent(true);
    } catch (error) {
      console.error('인증코드 발송 실패:', error);
      setEmailError(error.response?.data?.message || '인증코드 발송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async (code) => {
    if (!code || code.length !== 4) {
      setEmailError('유효한 인증번호를 입력해주세요.');
      setIsVerified(false);
      return;
    }
    
    try {
      // 이메일 인증 코드 검증 API 호출
      const response = await authService.verifyEmailCode(formData.email, code);
      
      // 인증 성공 (백엔드에서 인증 성공 시 200 OK 응답)
      if (response) {
        setIsVerified(true);
        setTimeLeft(0);
        setEmailError('');
        
        // 24시간 후 인증 만료 설정
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

  // 인증번호 입력 변경 핸들러
  const handleVerificationInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setVerificationInput(value);
    
    // 입력이 완료되면 자동으로 검증 시도
    if (value.length === 4) {
      handleVerifyCode(value);
    } else if (isVerified) {
      // 입력이 변경되면 인증 상태 초기화
      setIsVerified(false);
    }
  };

  // 폼 제출 처리
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
      
      // 회원가입 API 호출
      await authService.signup(userData);
      
      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 폼 유효성 검사
  useEffect(() => {
    const isAllFieldsFilled = 
      formData.firstName && 
      formData.lastName && 
      formData.phone1 && 
      formData.phone2 && 
      formData.phone3 &&
      formData.email &&
      isVerified && // 이메일 인증 완료 여부 확인
      password && 
      confirmPassword &&
      !passwordError &&
      !emailError &&
      address.postcode &&
      address.roadAddress &&
      address.detailAddress;
    
    setIsFormValid(!!isAllFieldsFilled);
  }, [formData, isVerified, password, confirmPassword, passwordError, emailError, address]);

  // 타이머 효과
  useEffect(() => {
    // 인증이 완료되었고, 만료 시간이 지나지 않았는지 확인
    if (isVerified && verificationExpiry && Date.now() > verificationExpiry) {
      setIsVerified(false);
      setVerificationSent(false);
      setEmailError('인증 유효기간이 만료되었습니다. 다시 인증해주세요.');
      return;
    }

    // 인증 대기 중이고, 아직 시간이 남아있는 경우 타이머 감소
    if (verificationSent && timeLeft > 0 && !isVerified) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && verificationSent && !isVerified) {
      // 시간 초과 처리 (인증 실패)
      setVerificationSent(false);
      setEmailError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      setIsVerified(false);
    }
    
    return () => clearTimeout(timerRef.current);
  }, [verificationSent, timeLeft, isVerified, verificationExpiry]);

  // 시간을 MM:SS 형식으로 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 약관 모달 열기
  const openTermsModal = (type) => {
    let title = '';
    let content = '';
    
    switch(type) {
      case 'service':
        title = '서비스 이용약관';
        content = <div dangerouslySetInnerHTML={{ __html: SERVICE_TERMS }} />;
        break;
      case 'privacy':
        title = '개인정보 처리방침';
        content = <div dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY }} />;
        break;
      case 'finance':
        title = '전자금융거래 이용약관';
        content = <div dangerouslySetInnerHTML={{ __html: FINANCIAL_TERMS }} />;
        break;
      default:
        return;
    }
    
    setModalState({
      isOpen: true,
      title,
      content
    });
  };

  // 약관 모달 닫기
  const closeTermsModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <div className={styles.container} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.logoButton}>
          <img src={logoSmall} alt="밀포유" />
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
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">서비스 이용약관 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink} onClick={() => openTermsModal('service')}>자세히 보기</span>
        </div>
        
        <div className={styles.checkboxRow}>
          <input type="checkbox" id="privacy" required />
          <label htmlFor="privacy">개인정보 처리방침 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink} onClick={() => openTermsModal('privacy')}>자세히 보기</span>
        </div>
        
        <div className={styles.checkboxRow}>
          <input type="checkbox" id="finance" required />
          <label htmlFor="finance">전자금융거래 이용약관 <span className={styles.required}>(필수)</span></label>
          <span className={styles.detailLink} onClick={() => openTermsModal('finance')}>자세히 보기</span>
        </div>
      </div>
      
      <TermsModal
        isOpen={modalState.isOpen}
        onClose={closeTermsModal}
        title={modalState.title}
        content={modalState.content}
      />

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