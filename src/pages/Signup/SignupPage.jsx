import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logoSmall from '../../assets/images/logo_small.png';
import eyeIcon from '../../assets/eye.svg';
import eyeHideIcon from '../../assets/eye-hide-line.svg';
import lockIcon from '../../assets/lock.svg';

const SignupContainer = styled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '0 20px',
  fontFamily: '"Noto Sans KR", sans-serif',
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
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  marginBottom: '24px',
  '& span': {
    color: '#2563eb',
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
    backgroundColor: '#e5e7eb',
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5분(초 단위)
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

  const timerRef = useRef();

  // 비밀번호 유효성 검사
  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$*])[A-Za-z\d!@#$*]{8,16}$/;
    if (!regex.test(pass)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자 !@#$* 포함';
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

  // 인증 코드 전송 처리
  const handleSendVerification = () => {
    setVerificationSent(true);
    setTimeLeft(300); // 5분으로 초기화
    // 일반적으로 여기서 인증 코드를 전송하는 API 호출을 수행합니다
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
      verificationCode &&
      password && 
      confirmPassword &&
      !passwordError;
    
    setIsFormValid(!!isAllFieldsFilled);
  }, [formData, verificationCode, password, confirmPassword, passwordError]);

  // 타이머 효과
  useEffect(() => {
    if (verificationSent && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 시간 초과 처리
      setVerificationSent(false);
    }
    
    return () => clearTimeout(timerRef.current);
  }, [verificationSent, timeLeft]);

  // 시간을 MM:SS 형식으로 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SignupContainer>
      <Header>
        <img src={logoSmall} alt="밀포유" />
      </Header>

      <Title>회원가입</Title>
      <Subtitle>
        이미 회원이신가요? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인하기</span>
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
          <input type="text" placeholder="우편번호" />
          <button>우편번호 찾기</button>
        </InputGroup>
        <InputGroup>
          <input type="text" placeholder="주소" />
        </InputGroup>
        <InputGroup>
          <input type="text" placeholder="상세주소" />
          <input type="text" placeholder="참고항목" />
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <label>이메일 인증</label>
        <InputGroup>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력해주세요." 
            disabled={verificationSent}
          />
          <button 
            onClick={handleSendVerification}
            disabled={!formData.email || verificationSent}
            style={{
              backgroundColor: verificationSent ? '#e5e7eb' : '#FF6B00',
              color: verificationSent ? '#9ca3af' : 'white',
              cursor: verificationSent ? 'not-allowed' : 'pointer'
            }}
          >
            {verificationSent ? '재전송' : '인증받기'}
          </button>
        </InputGroup>
        {verificationSent && (
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#10B981' }}>
            인증번호가 전송되었습니다.
          </div>
        )}
        <div style={{ position: 'relative', marginTop: '8px' }}>
          <input 
            type="text" 
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증번호 입력" 
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '24px',
              border: '1px solid #d1d5db',
              padding: '0 100px 0 16px',
              fontSize: '14px',
            }}
          />
          {verificationSent && timeLeft > 0 && (
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#EF4444',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
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
              padding: '0 44px',
              fontSize: '14px',
            }}
          />
          {passwordError && (
            <div style={{ 
              fontSize: '12px', 
              color: '#EF4444',
              marginTop: '4px',
              marginLeft: '8px'
            }}>
              {passwordError}
            </div>
          )}
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
          <img 
            src={showPassword ? eyeHideIcon : eyeIcon} 
            alt={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
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
              padding: '0 44px',
              fontSize: '14px',
            }}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div style={{ 
              fontSize: '12px', 
              color: '#EF4444',
              marginTop: '4px',
              marginLeft: '8px'
            }}>
              비밀번호가 일치하지 않습니다.
            </div>
          )}
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
          <img 
            src={showConfirmPassword ? eyeHideIcon : eyeIcon} 
            alt={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
        </div>
      </FormGroup>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '24px 0',
        //글꼴 크기: '14px'
      }}>
        <input 
          type="checkbox" 
          id="privacy" 
          style={{
            marginRight: '8px',
            width: '18px',
            height: '18px',
            accentColor: '#FF6B00'
          }} 
        />
        <label htmlFor="privacy" style={{ flex: 1 }}>개인정보 수집 동의</label>
        <span style={{ color: '#666', cursor: 'pointer' }}>자세히 보기</span>
      </div>

      <SubmitButton 
        style={{
          backgroundColor: isFormValid ? '#FF6B00' : '#e5e7eb',
          cursor: isFormValid ? 'pointer' : 'not-allowed'
        }}
        disabled={!isFormValid}
        onClick={() => navigate('/login')}
      >
        가입하기
      </SubmitButton>
    </SignupContainer>
  );
}