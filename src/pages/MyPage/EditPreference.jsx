import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditPreference.module.css";
import backIcon from "../../assets/images/back.png";
import highProteinIcon from "../../assets/images/highProtein_img.png";
import lowCarbIcon from "../../assets/images/lowCarb_img.png";
import glutenFreeIcon from "../../assets/images/glutenFree_img.png";
import lowSodiumIcon from "../../assets/images/lowSodium_img.png";
import lowGlycemicIcon from "../../assets/images/lowGlycemic_img.png";
import veganIcon from "../../assets/images/vegan_img.png";
import { memberInfo } from "../../api/member";
import Header from "../../components/Header";

const diets = [
  { id: "HIGH_PROTEIN", label: "고단백", icon: highProteinIcon },
  { id: "LOW_CARB", label: "저탄수", icon: lowCarbIcon },
  { id: "GLUTEN_FREE", label: "글루텐프리", icon: glutenFreeIcon },
  { id: "LOW_SODIUM", label: "저염", icon: lowSodiumIcon },
  { id: "LOW_GLYCEMIC", label: "저혈당", icon: lowGlycemicIcon },
  { id: "VEGAN", label: "비건", icon: veganIcon },
];

function EditPreference() {
  const navigate = useNavigate();
  const [selectedDiets, setSelectedDiets] = useState([]);
  const maxSelection = 3;

  // 기존 선호 식단 태그 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tags = await memberInfo.getMyHealthTags();

        // 무조건 배열만 상태에 넣기
        setSelectedDiets(Array.isArray(tags) ? tags : []);
      } catch (e) {
        console.error(e);
        setSelectedDiets([]);
      }
    };

    fetchData();
  }, []);

  //선호 식단 선택
  const handleDietSelect = (diet) => {
    //이미 선택되어있으면 해제
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((item) => item !== diet));
    } else {
      //3개 이상 선택 못하게 막기
      if (selectedDiets.length < maxSelection) {
        setSelectedDiets([...selectedDiets, diet]);
      }
    }
  };

  const handleComplete = async () => {
    try {
      await memberInfo.updateMyHealthTags(selectedDiets);
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("선호 식단 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // 변경 없이 나가기
  };

  return (
    <div className={styles.container}>
      {/* 헤더*/}
      <Header
        title="선호 식단 유형 수정"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <div className={styles.section}>
        <h1 className={styles.title}>선호 식단 유형 수정</h1>

        <p className={styles.subtitle}>
          기존에 선택한 식단을 포함해서{" "}
          <span className={styles.highlight}>최대 3가지</span>까지 선택할 수
          있어요.
        </p>

        <div className={styles.dietGrid}>
          {diets.map((diet) => (
            <button
              key={diet.id}
              className={`${styles.dietButton} ${
                Array.isArray(selectedDiets) && selectedDiets.includes(diet.id)
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleDietSelect(diet.id)}
            >
              <img
                src={diet.icon}
                alt={diet.label}
                className={styles.dietIcon}
              />
              {diet.label}
            </button>
          ))}
        </div>
      </div>
      <button
        className={styles.completeButton}
        onClick={handleComplete}
        disabled={selectedDiets.length === 0}
      >
        변경 저장 ({selectedDiets.length}/3)
      </button>
    </div>
  );
}

export default EditPreference;
