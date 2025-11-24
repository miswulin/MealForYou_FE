import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowLeft from '@mui/icons-material/ArrowBackIosNew';
import lockIcon from '../../assets/lock.svg';
import eyeIcon from '../../assets/eye.svg';
import eyeHideIcon from '../../assets/eye-hide-line.svg';
import correctIcon from '../../assets/correct.svg';
import wrongIcon from '../../assets/wrong.svg';

const PageContainer = styled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '0 20px 100px',
  fontFamily: '"Noto Sans KR", sans-serif',
  position: 'relative',
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
  display: 'flex',
  gap: '12px',
  '&:focus-within': {
    'input': {
      borderColor: '#FF6B00',
      boxShadow: '0 0 0 1px #FF6B00',
    }
  },
  '& input': {
    flex: 1,
    height: '48px',
    borderRadius: '24px',
    border: '1px solid #d1d5db',
    padding: '0 16px',
    fontSize: '14px',
    '&:focus': {
      borderColor: '#FF6B00',
      boxShadow: '0 0 0 1px #FF6B00',
      outline: 'none',
    },
    '&:disabled': {
      //backgroundColor: '#f9fafb', //이메일입력칸
      borderColor: '#e5e7eb',
    },
    '&::placeholder': {
      color: '#9ca3af',
    },
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
    //backgroundColor: '#f9fafb',
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
  backgroundColor: '#CDD1D5',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '20px',
  fontWeight: '500',
  cursor: 'pointer',
  '&:disabled': {
    backgroundColor: '#CDD1D5',
    color: '#FFFFFF',
    cursor: 'not-allowed',
    opacity: 0.7,
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
  //margin: '-16px 0 16px',
  textAlign: 'left',
});

const PasswordRuleText = styled('p')({
  fontSize: '12px',
  color: '#6b7280',
  margin: '8px 0 24px 16px',
  textAlign: 'left',
  fontWeight: '400',
  lineHeight: '1.5',
});

const SubmitButton = styled('button')({
  width: '100%',
  height: '56px',
  backgroundColor: '#FE4F1A',
  color: 'white',
  border: 'none',
  borderRadius: '28px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:disabled': {
    backgroundColor: '#CDD1D5',
    color: '#FFFFFF',
    cursor: 'not-allowed',
  },
  '&:not(:disabled):hover': {
    backgroundColor: '#E5460A',
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
    
    // 기존 타이머가 있으면 정리
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
    // TODO: 인증 로직 구현 필요
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
    // TODO: 비밀번호 재설정 로직 구현 필요
    console.log('Password reset submitted');
    
    // 성공 메시지 표시
    setIsPasswordReset(true);
    
    // 폼 초기화
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    
    // 로그인 페이지로 바로 이동
    setIsPasswordReset(false);
    navigate('/login');
  };

  // 비밀번호 유효성 검사
  const validatePassword = (pass) => {
    const regex = /^[A-Za-z\d!@#$*]{8,16}$/;
    if (!regex.test(pass)) {
      return '8~16자 이내 영문, 소문자, 숫자, 특수문자(!@#$*) 포함';
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

  // 비밀번호 변경 처리
  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordError(validatePassword(newPass));
    setPasswordMatchError(checkPasswordMatch(newPass, confirmPassword));
  };

  // 비밀번호 확인 변경 처리
  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    setPasswordMatchError(checkPasswordMatch(newPassword, confirmPass));
  };

  const isFormValid = email && verificationCode && newPassword && confirmPassword && 
                     !passwordError && !passwordMatchError && newPassword === confirmPassword;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft />
        </BackButton>
        <h1>비밀번호 찾기</h1>
      </Header>

      <form onSubmit={handleSubmit}>
        <FormGroup style={{ textAlign: 'left' }}>
          <label>이메일 인증</label>
          <InputContainer>
            <InputField
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={verificationSent}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '24px',
                border: '1px solid #d1d5db',
                padding: '0 16px',
                fontSize: '14px',
                '&:focus': {
                  borderColor: '#FF6B00',
                  boxShadow: '0 0 0 1px #FF6B00',
                },
                '&:disabled': {
                  //backgroundColor: '#f9fafb',
                  borderColor: '#e5e7eb',
                },
              }}
            />
            <button 
              onClick={handleSendVerification}
              disabled={!email || verificationSent}
              style={{
                padding: '0 16px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: verificationSent ? '#CDD1D5' : '#CDD1D5',
                color: '#FFFFFF',
                cursor: verificationSent ? 'not-allowed' : 'pointer',
                width: '90px',
                textAlign: 'center',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {verificationSent ? '재전송' : '인증받기'}
            </button>
          </InputContainer>
          <div style={{ position: 'relative', marginTop: '16px', marginBottom: '24px' }}>
            <InputField
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
              disabled={!verificationSent}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '24px',
                border: '1px solid #d1d5db',
                padding: '0 100px 0 16px',
                fontSize: '14px',
                '&:focus': {
                  borderColor: '#FF6B00',
                  boxShadow: '0 0 0 1px #FF6B00',
                },
                '&:disabled': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#e5e7eb',
                },
              }}
            />
            {verificationSent && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginTop: '4px', 
                fontSize: '12px', 
                color: '#10B981',
                marginLeft: '10px'
              }}>
                <img 
                  src={correctIcon} 
                  alt="인증완료" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    marginRight: '4px' 
                  }} 
                />
                인증번호가 전송되었습니다.
              </div>
            )}
            {verificationSent && timeLeft > 0 && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '12px',
                color: '#EF4444',
                fontSize: '14px',
                fontWeight: '500',
                height: '24px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup style={{ textAlign: 'left' }}>
          <label>변경할 비밀번호</label>
          <InputContainer style={{ marginBottom: '4px' }}>
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="변경할 비밀번호를 입력해주세요."
              value={newPassword}
              onChange={handlePasswordChange}
              style={{
                paddingLeft: '50px',
                borderColor: passwordError ? '#ef4444' : newPassword && !passwordError ? '#10B981' : '#d1d5db'
              }}
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
          <div style={{ marginBottom: '24px', minHeight: '20px' }}>
            {passwordError ? (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                <img src={wrongIcon} alt="오류" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                <span style={{ color: '#ef4444', fontSize: '12px' }}>{passwordError}</span>
              </div>
            ) : !newPassword ? (
              <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: '20px' }}>
                8~16자의 영문, 소문자, 숫자, 특수문자(!@#$*) 포함
              </span>
            ) : null}
          </div>
        </FormGroup>

        <FormGroup style={{ textAlign: 'left' }}>
          <label>변경할 비밀번호 확인</label>
          <InputContainer style={{ marginBottom: '4px' }}>
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              style={{
                paddingLeft: '50px',
                borderColor: passwordMatchError ? '#ef4444' : 
                            confirmPassword && !passwordMatchError ? '#10B981' : '#d1d5db'
              }}
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
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', minHeight: '20px' }}>
            {passwordMatchError ? (
              <div style={{ display: 'flex', alignItems: 'center', minHeight: '20px', marginLeft: '10px' }}>
                <img src={wrongIcon} alt="오류" style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                <span style={{ color: '#ef4444', fontSize: '12px' }}>{passwordMatchError}</span>
              </div>
            ) : confirmPassword && !passwordMatchError ? (
              <>
                <img src={correctIcon} alt="확인" style={{ width: '16px', height: '16px', marginRight: '4px', marginLeft: '10px' }} />
                <span style={{ color: '#10B981', fontSize: '12px' }}>비밀번호가 일치합니다.</span>
              </>
            ) : null}
          </div>
        </FormGroup>

        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '16px 20px 24px',
          //backgroundColor: '#fff'
          //boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <SubmitButton 
            type="submit" 
            disabled={!isFormValid}
            style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            수정하기
          </SubmitButton>
        </div>
      </form>
    </PageContainer>
  );
}

export default FindPasswordPage;