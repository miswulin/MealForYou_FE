import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Link,
  Paper,
  AppBar,
  Toolbar,
  InputAdornment,
  IconButton
} from '@mui/material';
import EnvelopeIcon from '../../assets/envelope.svg';
import LockIcon from '../../assets/lock.svg';
import EyeIcon from '../../assets/eye.svg';
import EyeOffIcon from '../../assets/eye-hide-line.svg';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logo from '../../assets/logo.svg';
import logoSmall from '../../assets/mealforyou_logo.svg';

// 이 컴포넌트에 영향을 줄 수 있는 전역 스타일 초기화
const GlobalStyleReset = styled('div')({
  '& *': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  // 일반 링크 스타일 (MUI 링크 제외)
  'a:not([class*="Mui"])': {
    color: 'inherit',
  },
  'button': {
    fontFamily: '"Noto Sans KR", sans-serif',
  },
});

// 스타일드 컴포넌트 정의
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3, 3, 3, 3), // 상단 패딩을 0으로 설정
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 400,
  margin: '0 auto',
  marginTop: 0, // 상단 마진 제거
  borderRadius: 16, // 더 둥글게 조정
  boxShadow: 'none',
  backgroundColor: 'white',
  border: 'none' // 테두리 제거
}));

const Logo = styled('img')({
  width: 120, // 로고 크기 조정
  marginBottom: 16,
});

const LoginButton = styled(Button)({
  //marginTop: 16,  24px → 16px
  width: '100%',
  padding: '12px 0',
  borderRadius: 25, // 더 둥글게 조정 (20 → 25)
  fontWeight: 'bold',
  fontSize: '1rem',
  backgroundColor: '#FF6B00',
  '&:hover': {
    backgroundColor: '#e65100',
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState({
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // 비밀번호 표시/숨김 토글 핸들러
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 로그인 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', formData);
    // 로그인 성공 후 온보딩 테스트 페이지로 이동
    navigate('/onboarding-test');
  };

  // 회원가입 페이지로 이동 핸들러
  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <GlobalStyleReset>
    <Box sx={{ 
      backgroundColor: 'white', 
      minHeight: '100vh',
      '& *': {
        boxSizing: 'border-box',
      },
      '& a': {
        textDecoration: 'none',
      },
    }}>
      {/* 상단 바 */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'black', py: 1 }}>
        <Toolbar>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              height: '32px'
            }}
          >
            <img src={logoSmall} alt="밀포유" style={{ height: '100%' }} />
          </button>
        </Toolbar>
      </AppBar>

      {/* 메인 콘텐츠 */}
      <Container component="main" maxWidth="xs" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 메인 로고 */}
          <Logo src={logo} alt="밀포유" />
          
          {/* 로그인 제목 */}
          <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            로그인
          </Typography>
          
          {/* 회원가입 링크 */}
          <Typography variant="body2" sx={{ mb: 3, color: '#6D7882' }}>
            신규 사용자이신가요?{' '}
            <Link href="/signup" onClick={handleSignupClick} sx={{ color: '#2098F3', textDecoration: 'underline !important' }}>
              회원가입하기
            </Link>
          </Typography>
          
          {/* 로그인 폼 */}
          <StyledPaper>
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              className="login-form"
              sx={{ 
                width: '100%',
                '&.login-form': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px' 
                }
              }}
            >
              {/* 이메일 입력 필드 */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label=""
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(prev => ({...prev, email: true}))}
                  onBlur={() => setFocusedField(prev => ({...prev, email: false}))}
                  placeholder="이메일을 입력해주세요"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ marginLeft: '8px' }}>
                        {!formData.email && (
                          <img src={EnvelopeIcon} alt="이메일" style={{ width: 20, height: 20, marginRight: '12px' }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: 5,
                      },
                      //paddingLeft: '8px',
                    },
                    '& .MuiFormControl-marginNormal': {
                      marginTop: '0 !important',
                      marginBottom: '0 !important'
                    },
                    '& .MuiInputBase-input::placeholder': {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      color: 'text.disabled',
                      opacity: 1
                    }
                  }}
                />
              </Box>
              
              {/* 비밀번호 입력 필드 */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label=""
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(prev => ({...prev, password: true}))}
                  onBlur={() => setFocusedField(prev => ({...prev, password: false}))}
                  placeholder="비밀번호를 입력해주세요"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ marginLeft: '8px' }}>
                        {!formData.password && (
                          <img src={LockIcon} alt="비밀번호" style={{ width: 20, height: 20, marginRight: '12px' }} />
                        )}
                      </InputAdornment>
                    ),
                    endAdornment: formData.password && (
                      <InputAdornment position="end" sx={{ marginRight: '16px' }}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{
                            padding: '4px',
                            '&:hover': {
                              backgroundColor: 'transparent'
                            }
                          }}
                        >
                          {showPassword ? (
                            <img src={EyeOffIcon} alt="비밀번호 숨기기" style={{ width: 20, height: 20 }} />
                          ) : (
                            <img src={EyeIcon} alt="비밀번호 표시" style={{ width: 20, height: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: 5,
                      },
                      //paddingLeft: '8px',
                    },
                    '& .MuiFormControl-marginNormal': {
                      marginTop: '0 !important',
                      marginBottom: '0 !important'
                    },
                    '& .MuiInputBase-input::placeholder': {
                      fontFamily: '"Noto Sans KR", sans-serif',
                      color: 'text.disabled',
                      opacity: 1
                    }
                  }}
                />
              </Box>

              {/* 로그인 버튼 */}
              <LoginButton
                type="submit"
                variant="contained"
                size="large"
              >
                로그인
              </LoginButton>

              {/* 하단 링크 */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ display: 'inline', color: '#6D7882', mr: 2, verticalAlign: 'middle', fontFamily: '"Noto Sans KR", sans-serif' }}>
                  비밀번호를 잊으셨나요?
                </Typography>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/find-password')}
                  sx={{ color: '#6D7882', textDecoration: 'underline', verticalAlign: 'middle', fontFamily: '"Noto Sans KR", sans-serif' }}
                >
                  비밀번호 찾기
                </Link>
              </Box>
            </Box>
          </StyledPaper>
        </Box>
      </Container>
    </Box>
    </GlobalStyleReset>
  );
};

export default LoginPage;