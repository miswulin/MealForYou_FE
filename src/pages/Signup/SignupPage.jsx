import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { authService } from '../../api/auth';
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


const SignupContainer = styled('div')({
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '0 20px',
  fontFamily: '"Noto Sans KR", sans-serif',
  textAlign: 'left',
  '& *': {
    boxSizing: 'border-box',
    margin: 0,
    //padding: 0,
  },
  'a': {
    textDecoration: 'none',
    color: 'inherit',
  },
  'input, button': {
    fontFamily: '"Noto Sans KR", sans-serif',
    border: 'none',
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
});

const Header = styled('header')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 0',
  position: 'sticky',
  top: 0,
  backgroundColor: '#fff',
  zIndex: 1000,
  '& img': {
    height: '32px',
  },
});

const Title = styled('h2')({
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '8px',
  width: '100%',
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  marginBottom: '24px',
  width: '100%',
  '& span': {
    color: '#2098F3',
    fontWeight: '500',
  },
});

const FormGroup = styled('div')({
  width: '100%',
  marginBottom: '16px',
  '& label': {
    display: 'block',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333',
    paddingLeft: '12px',
  },
});

const InputGroup = styled('div')({
  display: 'flex',
  gap: '12px',
  marginBottom: '16px',
  '& input': {
    flex: 1,
    height: '48px',
    borderRadius: '24px',
    border: '1px solid #d1d5db',
    padding: '0 16px',
    fontSize: '14px',
    '&::placeholder': {
      color: '#9ca3af',
    },
  },
  '& button': {
    padding: '0 16px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: '#CDD1D5',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
});

const CheckboxContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  margin: '24px 0',
  '& input': {
    marginRight: '8px',
  },
  '& span': {
    marginLeft: 'auto',
    color: '#666',
  },
});

const SubmitButton = styled('button')(({ theme }) => ({
  width: '100%',
  height: '56px',
  borderRadius: '28px',
  backgroundColor: '#FF6B00',
  color: 'white',
  fontSize: '17px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#e65100',
  },
  '&:disabled': {
    backgroundColor: '#e5e7eb',
    cursor: 'not-allowed',
    transform: 'none !important',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(0.98)',
  }
}));

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
    // 영어 소문자 1개 이상 필수, 숫자와 특수문자(!@#$*)는 선택사항
    const passwordRegex = /^(?=.*[a-z])[a-z0-9!@#$*]{8,16}$/i;
    if (!passwordRegex.test(password)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
    }
    if (!/[!@#$*]/.test(pass)) {
      return '특수문자(!@#$*)를 최소 하나 포함해주세요.';
    }
    return '';
  };

  // 비밀번호 일치 여부 확인
  const checkPasswordMatch = (pass, confirmPass) => {
    if (pass && confirmPass && pass !== confirmPass) {
      return '비밀번호가 일치하지 않습니다.';
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
    setTimeLeft(300); // 5분으로 초기화
    setVerificationExpiry(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후 만료
    
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

  return (
    <SignupContainer>
      <Header>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <img src={logoSmall} alt="밀포유" />
        </button>
      </Header>

      <Title>회원가입</Title>
      <Subtitle style={{ textAlign: 'center' }}>
        이미 회원이신가요? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>로그인하기</span>
      </Subtitle>

      <FormGroup>
        <label>이름</label>
        <InputGroup>
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
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <label>전화번호</label>
        <InputGroup>
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
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <label>주소</label>
        <InputGroup>
          <input 
            type="text" 
            placeholder="우편번호" 
            value={address.postcode}
            readOnly
            style={{ backgroundColor: '#FFFFFF' }}
          />
          <button 
            type="button"
            onClick={handleAddressSearch}
            style={{ 
              backgroundColor: '#CDD1D5',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              padding: '0 16px',
              borderRadius: '24px'
            }}
          >
            우편번호 찾기
          </button>
        </InputGroup>
        <InputGroup>
          <input 
            type="text" 
            placeholder="도로명주소" 
            value={address.roadAddress}
            readOnly
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </InputGroup>
        <InputGroup>
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
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <label>이메일 인증</label>
        <InputGroup>
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
            style={{
              borderColor: emailError ? '#EF4444' : '#d1d5db',
              backgroundColor: isVerified ? '#f3f4f6' : '#fff'
            }}
          />
          <button 
            onClick={handleSendVerification}
            disabled={isVerified || !formData.email}
            style={{
              backgroundColor: isVerified ? '#10B981' : (!formData.email ? '#CDD1D5' : '#2098F3'),
              color: '#FFFFFF',
              cursor: isVerified || !formData.email ? 'not-allowed' : 'pointer',
              width: '90px',
              textAlign: 'center',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: isVerified ? '#10B981' : '#1a7bbd'
              }
            }}
          >
            {isVerified ? '인증완료' : (verificationSent ? '재전송' : '인증받기')}
          </button>
        </InputGroup>
        
        {emailError && !verificationSent && (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px', 
            color: '#EF4444',
            marginTop: '4px',
            marginLeft: '12px'
          }}>
            <img 
              src={wrongIcon} 
              alt="" 
              style={{
                width: '14px',
                height: '14px',
                marginRight: '4px',
                flexShrink: 0
              }}
            />
            {emailError}
          </div>
        )}
        
        {verificationSent && !isVerified && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={verificationInput}
                onChange={handleVerificationInputChange}
                placeholder="인증번호 4자리 입력" 
                maxLength={4}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '24px',
                  border: emailError ? '1px solid #EF4444' : '1px solid #d1d5db',
                  padding: '0 100px 0 16px',
                  fontSize: '14px',
                  //letterSpacing: '4px',
                  //textAlign: 'center',
                  '&:focus': {
                    borderColor: '#2098F3',
                    boxShadow: '0 0 0 2px rgba(32, 152, 243, 0.2)'
                  }
                }}
              />
              {timeLeft > 0 && (
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: timeLeft < 60 ? '#EF4444' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontVariantNumeric: 'tabular-nums',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: '4px',
              marginLeft: '12px',
              fontSize: '12px',
              color: emailError ? '#EF4444' : '#6B7280'
            }}>
              {emailError ? (
                <>
                  <img 
                    src={wrongIcon} 
                    alt="오류" 
                    style={{ 
                      width: '14px', 
                      height: '14px', 
                      marginRight: '4px',
                      flexShrink: 0
                    }} 
                  />
                  {emailError}
                </>
              ) : (
                <>
                  <img 
                    src={correctIcon} 
                    alt="안내" 
                    style={{ 
                      width: '14px', 
                      height: '14px', 
                      marginRight: '4px',
                      flexShrink: 0
                    }} 
                  />
                  {verificationInput.length === 4 
                    ? '인증번호를 확인 중입니다...'
                    : `인증번호가 이메일로 전송되었습니다. ${formatTime(timeLeft)} 내에 입력해주세요.`}
                </>
              )}
            </div>
          </div>
        )}
        
        {isVerified && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '8px',
            marginLeft: '12px',
            fontSize: '14px',
            color: '#10B981',
            fontWeight: '500'
          }}>
            <img 
              src={correctIcon} 
              alt="인증완료" 
              style={{ 
                width: '16px', 
                height: '16px', 
                marginRight: '6px',
                flexShrink: 0
              }} 
            />
            이메일 인증이 완료되었습니다. (24시간 동안 유효)
          </div>
        )}
      </FormGroup>

      <FormGroup>
        <label>비밀번호</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요." 
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '24px',
              border: passwordError ? '1px solid #EF4444' : '1px solid #d1d5db',
              padding: '0 16px 0 16px',
              paddingLeft: password ? '16px' : '44px',
              fontSize: '14px',
            }}
          />
          {passwordError && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px', 
              color: '#EF4444',
              marginTop: '4px',
              marginLeft: '8px'
            }}>
              <img 
                src={wrongIcon} 
                alt="" 
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '4px',
                  flexShrink: 0
                }}
              />
              {passwordError}
            </div>
          )}
          {!password && (
            <img 
              src={lockIcon} 
              alt="" 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            right: '16px',
            top: 0,
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={showPassword ? eyeHideIcon : eyeIcon} 
              alt={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
            />
          </div>
        </div>
      </FormGroup>

      <FormGroup>
        <label>비밀번호 확인</label>
        <div style={{ position: 'relative' }}>
          <input 
            type={showConfirmPassword ? 'text' : 'password'} 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="비밀번호를 다시 입력해주세요." 
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '24px',
              border: password && confirmPassword && password !== confirmPassword ? '1px solid #EF4444' : '1px solid #d1d5db',
              padding: '0 16px 0 16px',
              paddingLeft: confirmPassword ? '16px' : '44px',
              fontSize: '14px',
            }}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px', 
              color: '#EF4444',
              marginTop: '4px',
              marginLeft: '8px'
            }}>
              <img 
                src={wrongIcon} 
                alt="" 
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '4px'
                }}
              />
              비밀번호가 일치하지 않습니다.
            </div>
          )}
          {!confirmPassword && (
            <img 
              src={lockIcon} 
              alt="" 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            right: '16px',
            top: 0,
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={showConfirmPassword ? eyeHideIcon : eyeIcon} 
              alt={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
            />
          </div>
        </div>
      </FormGroup>

      <div style={{ margin: '24px 16px', width: 'calc(100% - 32px)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          fontSize: '14px'
        }}>
          <input 
            type="checkbox" 
            id="terms" 
            style={{
              marginRight: '8px',
              width: '18px',
              height: '18px',
              accentColor: '#464C53'
            }} 
          />
          <label htmlFor="terms" style={{ flex: 1, paddingLeft: 0, marginLeft: 0 }}>서비스 이용약관 <span style={{ color: '#FF6B00' }}>(필수)</span></label>
          <span style={{ color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>자세히 보기</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          fontSize: '14px'
        }}>
          <input 
            type="checkbox" 
            id="privacy" 
            style={{
              marginRight: '8px',
              width: '18px',
              height: '18px',
              accentColor: '#464C53'
            }} 
          />
          <label htmlFor="privacy" style={{ flex: 1, paddingLeft: 0, marginLeft: 0 }}>개인정보 처리방침 <span style={{ color: '#FF6B00' }}>(필수)</span></label>
          <span style={{ color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>자세히 보기</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          <input 
            type="checkbox" 
            id="finance" 
            style={{
              marginRight: '8px',
              width: '18px',
              height: '18px',
              accentColor: '#464C53'
            }} 
          />
          <label htmlFor="finance" style={{ flex: 1, paddingLeft: 0, marginLeft: 0 }}>전자금융거래 이용약관 <span style={{ color: '#FF6B00' }}>(필수)</span></label>
          <span style={{ color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>자세히 보기</span>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <SubmitButton 
          style={{
            backgroundColor: isFormValid ? '#FE4F1A' : '#CDD1D5',
            color: '#FFFFFF',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
          disabled={!isFormValid}
          onClick={() => navigate('/login')}
        >
          가입하기
        </SubmitButton>
      </div>
    </SignupContainer>
  );
}