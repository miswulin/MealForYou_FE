import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import lockIcon from '../../assets/lock.svg';
import eyeIcon from '../../assets/eye.svg';
import eyeHideIcon from '../../assets/eye-hide-line.svg';

const PageContainer = styled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '0 20px',
  fontFamily: '"Noto Sans KR", sans-serif',
  paddingBottom: '40px',
  '& *': {
    boxSizing: 'border-box',
    margin: 0,
  },
  'a': {
    textDecoration: 'none',
    color: 'inherit',
  },
  'input, button': {
    fontFamily: '"Noto Sans KR", sans-serif',
    //border: 'none',
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
});

const FormGroup = styled('div')({
  width: '100%',
  //marginBottom: '16px',
  '& label': {
    display: 'block',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333',
    textAlign: 'left',
  },
});

const Header = styled('header')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '20px 0',
  position: 'relative',
  '& h1': {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
});

const BackButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '20px',
    height: '20px',
    color: '#333',
  },
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: '600',
  color: '#333',
  margin: '24px 0 12px',
  '&:first-of-type': {
    marginTop: '0',
  },
});

const InputContainer = styled('div')({
  position: 'relative',
  width: '100%',
  marginBottom: '8px',
  '&:focus-within': {
    'input': {
      borderColor: '#FF6B00',
      boxShadow: '0 0 0 1px #FF6B00',
    }
  },
});

const InputField = styled('input')({
  width: '100%',
  height: '48px',
  padding: '0 20px',
  border: '1px solid #d1d5db',
  borderRadius: '24px',
  //fontSize: '14px',
  backgroundColor: '#fff',
  '&:focus': {
    borderColor: '#FF6B00',
    boxShadow: '0 0 0 1px #FF6B00',
  },
  '&::placeholder': {
    color: '#9ca3af',
  },
  '&[type="password"]': {
    padding: '0 50px 0 50px',
  },
  '&[type="text"]': {
    padding: '0 20px 0 50px',
  },
  '&[name="password"], &[name="confirmPassword"]': {
    padding: '0 50px 0 50px',
  },
  '&:disabled': {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
});

const InputIcon = styled('img')({
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '20px',
  height: '20px',
});

const ToggleButton = styled('button')({
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  '& img': {
    width: '20px',
    height: '20px',
  },
});

const VerifyButton = styled('button')({
  position: 'absolute',
  right: '4px',
  top: '4px',
  width: '100px',
  height: '40px',
  backgroundColor: '#FF6B00',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  //fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  '&:disabled': {
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
});

const TimerText = styled('span')({
  position: 'absolute',
  right: '100px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#ef4444',
  //fontSize: '14px',
  fontWeight: '500',
});

const SuccessText = styled('p')({
  color: '#10b981',
  //fontSize: '12px',
  // 여백: '-16px 0 16px',
  textAlign: 'left',
});

const PasswordRuleText = styled('p')({
  //fontSize: '12px',
  color: '#6b7280',
  margin: '0px 12px 24px',
  textAlign: 'left',
});

const SubmitButton = styled('button')({
  width: '100%',
  height: '56px',
  backgroundColor: '#FF6B00',
  color: 'white',
  border: 'none',
  borderRadius: '28px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  '&:disabled': {
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  '&:not(:disabled):hover': {
    backgroundColor: '#e65100',
  },
});

function FindPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isCodeSent, setIsCodeSent] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsCodeSent(false);
    }
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(300); // Reset to 5 minutes
    setIsCodeSent(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
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
    // TODO: 인증 로직 구현 필요
    setIsVerified(true);
    clearInterval(timerRef.current);
  };

  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 비밀번호 재설정 로직 구현 필요
    console.log('Password reset submitted');
    
    // 성공 메시지 표시
    setIsPasswordReset(true);
    
    // 폼 초기화
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    
    // 5초 후 성공 메시지 숨기기
    setTimeout(() => {
      setIsPasswordReset(false);
      // 선택사항: 성공 메시지 표시 후 로그인 페이지로 이동
      // navigate('/login');
    }, 5000);
  };

  const isFormValid = email && verificationCode && newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft />
        </BackButton>
        <h1>비밀번호 찾기</h1>
      </Header>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>이메일 인증</label>
          <InputContainer>
            <InputField
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingRight: '110px' }}
            />
            <VerifyButton 
              onClick={startTimer}
              disabled={!email}
            >
              인증받기
            </VerifyButton>
          </InputContainer>
        </FormGroup>

        <FormGroup>
          <InputContainer>
            <InputField
              type="text"
              placeholder="인증번호 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ padding: '0 20px 0 20px' }}
            />
            {isCodeSent && (
              <TimerText>{formatTime(timeLeft)}</TimerText>
            )}
          </InputContainer>
          {isCodeSent && !isVerified && (
            <SuccessText>인증번호가 전송되었습니다.</SuccessText>
          )}
        </FormGroup>

        <FormGroup>
          <label>변경할 비밀번호</label>
          <InputContainer>
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="변경할 비밀번호를 입력해주세요."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputIcon src={lockIcon} alt="" />
            <ToggleButton 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img 
                src={showPassword ? eyeHideIcon : eyeIcon} 
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"} 
              />
            </ToggleButton>
          </InputContainer>
          <PasswordRuleText>
            8~16자 영문, 소문자, 숫자, 특수문자(!@#$%^&*) 조합
          </PasswordRuleText>
        </FormGroup>

        <FormGroup>
          <label>변경할 비밀번호 확인</label>
          <InputContainer>
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={confirmPassword && newPassword !== confirmPassword ? { borderColor: '#ef4444', padding: '0 50px 0 50px' } : { padding: '0 50px 0 50px' }}
            />
            <InputIcon src={lockIcon} alt="" />
            <ToggleButton 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img 
                src={showConfirmPassword ? eyeHideIcon : eyeIcon} 
                alt={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"} 
              />
            </ToggleButton>
          </InputContainer>
          {confirmPassword && newPassword !== confirmPassword && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'left' }}>
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </FormGroup>

        <div style={{ marginTop: '40px' }}>
          <SubmitButton 
            type="submit" 
            disabled={!isFormValid}
          >
            수정하기
          </SubmitButton>
        </div>
      </form>
    </PageContainer>
  );
}

export default FindPasswordPage;