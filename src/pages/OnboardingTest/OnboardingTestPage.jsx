import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/auth';
import styles from './OnboardingTestPage.module.css';
import backIcon from '../../assets/images/back.png';
import highProteinIcon from '../../assets/images/highProtein_img.png';
import lowCarbIcon from '../../assets/images/lowCarb_img.png';
import glutenFreeIcon from '../../assets/images/glutenFree_img.png';
import lowSodiumIcon from '../../assets/images/lowSodium_img.png';
import lowGlycemicIcon from '../../assets/images/lowGlycemic_img.png';
import veganIcon from '../../assets/images/vegan_img.png';

const HEALTH_TAGS = {
  highProtein: 'HIGH_PROTEIN',
  lowCarb: 'LOW_CARB',
  glutenFree: 'GLUTEN_FREE',
  lowSodium: 'LOW_SODIUM',
  lowGlycemic: 'LOW_GLYCEMIC',
  vegan: 'VEGAN'
};

const diets = [
  { id: 'highProtein', label: '고단백', icon: highProteinIcon },
  { id: 'lowCarb', label: '저탄수', icon: lowCarbIcon },
  { id: 'glutenFree', label: '글루텐프리', icon: glutenFreeIcon },
  { id: 'lowSodium', label: '저염', icon: lowSodiumIcon },
  { id: 'lowGlycemic', label: '저혈당', icon: lowGlycemicIcon },
  { id: 'vegan', label: '비건', icon: veganIcon },
];

function OnboardingTestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [signupData, setSignupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  // 컴포넌트 마운트 시 로케이션에서 signupData 가져오기
  useEffect(() => {
    if (location.state?.signupData) {
      setSignupData(location.state.signupData);
    } else {
      // signupData가 없으면 회원가입 페이지로 리다이렉트
      navigate('/signup', { replace: true });
    }
  }, [location, navigate]);

  const handleComplete = async () => {
    if (!signupData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 디버깅을 위해 signupData 출력
      console.log('signupData:', JSON.stringify(signupData, null, 2));
      
      // 선택한 건강 태그 매핑
      const healthTags = selectedDiets.map(diet => HEALTH_TAGS[diet]);
      
      // 회원가입 요청 데이터 준비
      const userData = {
        email: signupData.email,
        name: signupData.name,
        password: signupData.password,
        passwordConfirm: signupData.passwordConfirm,
        phoneRaw: signupData.phoneRaw || signupData.phoneNumber,
        address: signupData.address,
        healthTags: healthTags
      };
      
      // 디버깅을 위해 userData 출력
      console.log('userData:', JSON.stringify(userData, null, 2));
      
      if (!userData.address.zipCode || !userData.address.roadAddress) {
        console.error('주소 정보가 올바르지 않습니다:', {
          zipCode: userData.address.zipCode,
          roadAddress: userData.address.roadAddress,
          originalData: signupData.address
        });
        throw new Error('주소를 정확히 입력해주세요.');
      }
      
      // 회원가입 API 호출
      await authService.signup(userData);
      
      // 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!signupData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 건강 태그 없이 회원가입 요청
      const userData = {
        ...signupData,
        healthTags: []
      };
      
      // 회원가입 API 호출
      await authService.signup(userData);
      
      // 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/signup')}
          disabled={isLoading}
        >
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
            className={`${styles.dietButton} ${
              selectedDiets.includes(diet.id) ? styles.selected : ''
            }`}
            onClick={() => handleDietSelect(diet.id)}
            disabled={isLoading}
            type="button"
          >
            <img src={diet.icon} alt={diet.label} className={styles.dietIcon} />
            <span className={styles.dietLabel}>{diet.label}</span>
          </button>
        ))}
      </div>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      <div className={styles.buttonContainer}>
        <p className={styles.skipText}>
          선호 식단은 나중에 다시 수정할 수 있어요!{' '}
          <span className={styles.skipLink} onClick={handleSkip}>
            건너뛰기
          </span>
        </p>
        
        <button 
          className={`${styles.completeButton} ${
            selectedDiets.length > 0 ? styles.active : ''
          }`}
          onClick={handleComplete}
          disabled={selectedDiets.length === 0 || isLoading}
        >
          {isLoading ? '처리 중...' : '완료하기'}
        </button>
      </div>
    </div>
  );
}

export default OnboardingTestPage;