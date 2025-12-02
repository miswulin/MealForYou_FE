import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OnboardingTestPage.module.css';
import backIcon from '../../assets/images/back.png';
import highProteinIcon from '../../assets/images/highProtein_img.png';
import lowCarbIcon from '../../assets/images/lowCarb_img.png';
import glutenFreeIcon from '../../assets/images/glutenFree_img.png';
import lowSodiumIcon from '../../assets/images/lowSodium_img.png';
import lowGlycemicIcon from '../../assets/images/lowGlycemic_img.png';
import veganIcon from '../../assets/images/vegan_img.png';

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
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로가기" />
        </button>
      </header>
      
      <h1 className={styles.title}>어떤 식단을 선호하세요?</h1>
      
      <p className={styles.subtitle}>
        관심있는 식단 <span className={styles.highlight}>최대 3가지</span> 선택 가능해요.<br />
        식단에 맞는 대체 옵션을 추천해드려요!
      </p>
      
      <div className={styles.dietGrid}>
        {diets.map((diet) => (
          <button
            key={diet.id}
            className={`${styles.dietButton} ${selectedDiets.includes(diet.id) ? styles.selected : ''}`}
            onClick={() => handleDietSelect(diet.id)}
          >
            <img src={diet.icon} alt={diet.label} className={styles.dietIcon} />
            {diet.label}
          </button>
        ))}
      </div>
      
      <button 
        className={styles.completeButton}
        onClick={handleComplete}
        disabled={selectedDiets.length === 0}
      >
        선택 완료 ({selectedDiets.length}/3)
      </button>
      
      <p className={styles.skipText} onClick={handleSkip}>
        선호 식단은 나중에 다시 수정할 수 있어요! <span className={styles.skipLink}>건너뛰기</span>
      </p>
    </div>
  );
}

export default OnboardingTestPage;