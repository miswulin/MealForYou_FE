import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import backIcon from '../../assets/images/back.png';
import highProteinIcon from '../../assets/images/highProtein_img.png';
import lowCarbIcon from '../../assets/images/lowCarb_img.png';
import glutenFreeIcon from '../../assets/images/glutenFree_img.png';
import lowSodiumIcon from '../../assets/images/lowSodium_img.png';
import lowGlycemicIcon from '../../assets/images/lowGlycemic_img.png';
import veganIcon from '../../assets/images/vegan_img.png';

const Container = styled('div')({
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#fff',
  padding: '20px',
  fontFamily: '"Noto Sans KR", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  //paddingBottom: '100px',
});

const Header = styled('header')({
  width: '100%',
  padding: '16px 0',
  position: 'relative',
  marginBottom: '12px',
});

const BackButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: '0',
  top: '16px',
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: '700',
  color: '#333',
  margin: '0',
  textAlign: 'center',
  width: '100%',
  padding: '24px 0',
});

const Subtitle = styled('p')({
  fontSize: '16px',
  color: '#666',
  textAlign: 'center',
  margin: '0 0 40px',
  lineHeight: '1.5',
  padding: '0 20px',
});

const DietGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  //width: '100%',
  maxWidth: '400px',
  marginBottom: '40px',
});

const DietButton = styled('button')({
  padding: '24px 16px',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#fff',
  fontSize: '18px',
  fontWeight: '500',
  color: '#333',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  width: '160px',
  height: '140px',
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
  position: 'fixed',
  bottom: '80px',
  left: '0',
  right: '0',
  '&:hover': {
    textDecoration: 'none',
  },
});

const CompleteButton = styled('button')({
  width: '100%',
  maxWidth: 'calc(100% - 40px)',
  padding: '16px',
  borderRadius: '28px',
  backgroundColor: '#CDD1D5',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  '&:disabled': {
    backgroundColor: '#CDD1D5',
    cursor: 'not-allowed',
  },
  '&:not(:disabled)': {
    backgroundColor: '#FF6B00',
  },
});

const diets = [
  { id: 'highProtein', label: '고단백', icon: highProteinIcon },
  { id: 'lowCarb', label: '저탄수', icon: lowCarbIcon },
  { id: 'glutenFree', label: '글루텐프리', icon: glutenFreeIcon },
  { id: 'lowSodium', label: '저염', icon: lowSodiumIcon },
  { id: 'lowGlycemic', label: '저혈당', icon: lowGlycemicIcon },
  { id: 'vegan', label: '비건', icon: veganIcon },
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
          <img src={backIcon} alt="뒤로가기" />
        </BackButton>
      </Header>
      <Title>어떤 식단을 선호하세요?</Title>
      
      <Subtitle>
        관심있는 식단 <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>최대 3가지</span> 선택 가능해요.<br />
        식단에 맞는 대체 옵션을 추천해드려요!
      </Subtitle>
      
      <DietGrid>
        {diets.map((diet) => (
          <DietButton
            key={diet.id}
            className={selectedDiets.includes(diet.id) ? 'selected' : ''}
            onClick={() => handleDietSelect(diet.id)}
          >
            <img src={diet.icon} alt={diet.label} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
            {diet.label}
          </DietButton>
        ))}
      </DietGrid>
      
      <CompleteButton 
        onClick={handleComplete}
        disabled={selectedDiets.length === 0}
      >
        선택 완료 ({selectedDiets.length}/3)
      </CompleteButton>
      
      <SkipText onClick={handleSkip}>
        선호 식단은 나중에 다시 수정할 수 있어요! <span style={{ color: '#2098F3' }}>건너뛰기</span>
      </SkipText>
    </Container>
  );
}

export default OnboardingTestPage;