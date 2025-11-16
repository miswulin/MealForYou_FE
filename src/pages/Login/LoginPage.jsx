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
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logo from '../../assets/images/logo.png';
import logoSmall from '../../assets/images/logo_small.png';

// 이 컴포넌트에 영향을 줄 수 있는 전역 스타일 초기화
const GlobalStyleReset = styled('div')({
  '& *': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  'a': {
    textDecoration: 'none',
    color: 'inherit',
  },
  'button': {
    fontFamily: '"Noto Sans KR", sans-serif',
  },
});

// 스타일드 컴포넌트 정의
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3, 3, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(2),
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
  marginTop: 24,
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
          <img src={logoSmall} alt="밀포유" style={{ height: 32 }} />
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
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            신규 사용자이신가요?{' '}
            <Link href="/signup" onClick={handleSignupClick} sx={{ fontWeight: 'bold', color: '#00BFFF', textDecoration: 'none' }}>
              회원가입하기
            </Link>
          </Typography>
          
          {/* 로그인 폼 */}
          <StyledPaper>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* 이메일 입력 필드 */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="이메일을 입력해주세요"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: 5, // 둥근 정도 조정 (6 → 8)
                    },
                  },
                  mb: 1
                }}
              />
              
              {/* 비밀번호 입력 필드 */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호를 입력해주세요"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: 5, // 더 둥글게 조정
                    },
                  },
                  // borderRadius: 5, 더 둥글게 조정
                  mb: 1
                }}
              />

              {/* 로그인 버튼 */}
              <LoginButton
                type="submit"
                variant="contained"
                size="large"
              >
                로그인
              </LoginButton>

              {/* 하단 링크 */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ display: 'inline', color: '#666', mr: 2 }}>
                  비밀번호를 잊으셨나요?
                </Typography>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/find-password')}
                  sx={{ color: '#666', textDecoration: 'none' }}
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