import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { ArrowLeft } from '@mui/icons-material';

const Container = styled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '20px',
  fontFamily: '"Noto Sans KR", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Header = styled('header')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '16px 0',
  position: 'relative',
  marginBottom: '20px',
});

const BackButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#333',
});

const Title = styled('h1')({
  fontSize: '20px',
  fontWeight: '600',
  color: '#333',
  margin: '0',
  textAlign: 'center',
  width: '100%',
  paddingRight: '40px',
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  margin: '12px 0 40px',
  lineHeight: '1.5',
});

const DietGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  width: '100%',
  maxWidth: '400px',
  marginBottom: '40px',
});

const DietButton = styled('button')({
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  fontSize: '16px',
  fontWeight: '500',
  color: '#333',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&.selected': {
    backgroundColor: '#FF6B00',
    color: 'white',
    borderColor: '#FF6B00',
  },
  '&:hover': {
    borderColor: '#FF6B00',
  },
});

const SkipText = styled('p')({
  fontSize: '14px',
  color: '#999',
  textAlign: 'center',
  margin: '20px 0',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const CompleteButton = styled('button')({
  width: '100%',
  maxWidth: '400px',
  padding: '16px',
  borderRadius: '28px',
  backgroundColor: '#FF6B00',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  marginTop: 'auto',
  marginBottom: '24px',
  '&:disabled': {
    backgroundColor: '#e5e7eb',
    cursor: 'not-allowed',
  },
});

const diets = [
  { id: 'highProtein', label: '고단백' },
  { id: 'lowCarb', label: '저탄수' },
  { id: 'glutenFree', label: '글루텐프리' },
  { id: 'lowSodium', label: '저염' },
  { id: 'lowGlycemic', label: '저혈당' },
  { id: 'vegan', label: '비건' },
];

function OnboardingTestPage() {
  const navigate = useNavigate();
  const [selectedDiets, setSelectedDiets] = useState([]);
  const maxSelection = 3;

  const handleDietSelect = (diet) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(item => item !== diet));
    } else {
      if (selectedDiets.length < maxSelection) {
        setSelectedDiets([...selectedDiets, diet]);
      }
    }
  };

  const handleComplete = () => {
    // TODO: 선택한 식단을 상태나 API에 저장
    navigate('/'); // 홈으로 이동
  };

  const handleSkip = () => {
    navigate('/'); // 건너뛰기 시 홈으로 이동
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft />
        </BackButton>
        <Title>어떤 식단을 선호하세요?</Title>
      </Header>
      
      <Subtitle>
        관심있는 식단 최대 3가지 선택 가능해요.<br />
        식단에 맞는 대체 옵션을 추천해드려요!
      </Subtitle>
      
      <DietGrid>
        {diets.map((diet) => (
          <DietButton
            key={diet.id}
            className={selectedDiets.includes(diet.id) ? 'selected' : ''}
            onClick={() => handleDietSelect(diet.id)}
          >
            {diet.label}
          </DietButton>
        ))}
      </DietGrid>
      
      <SkipText onClick={handleSkip}>
        선호 식단은 나중에 다시 수정할 수 있어요! <u>건너뛰기</u>
      </SkipText>
      
      <CompleteButton 
        onClick={handleComplete}
        disabled={selectedDiets.length === 0}
      >
        선택 완료 ({selectedDiets.length}/3)
      </CompleteButton>
    </Container>
  );
}

export default OnboardingTestPage;