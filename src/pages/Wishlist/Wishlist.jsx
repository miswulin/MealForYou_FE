import styles from "../Wishlist/Wishlist.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import checkIcon from "../../assets/images/check.png";
import { dishesService } from "../../api/dishes";

export default function Wishlist() {
  const navigate = useNavigate();

  //전체 찜 목록 리스트
  const [mealboxes, setMealboxes] = useState([]);
  //선택된 상품 id 저장(배열)
  const [selectedIds, setSelectedIds] = useState([]);

  //전체 찜 상품 개수
  const totalCount = mealboxes.length;
  //선택된 상품 개수
  const selectedCount = selectedIds.length;
  //전체선택인지 판단
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  // 관심상품 목록 불러오기
  useEffect(() => {
    const fetchInterestList = async () => {
      try {
        const data = await dishesService.getInterestList();
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.imageUrl,
          price: item.basePrice,
        }));
        setMealboxes(mapped);
      } catch (error) {
        console.error("관심 상품 목록 불러오기 오류:", error);
        // alert(error.message || "관심 상품 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchInterestList();
  }, []);

  // 전체 선택/ 전체 해제
  const toggleSelectAll = () => {
    // 이미 전부 선택되어 있다면 -> 전체 해제
    if (isAllSelected) {
      setSelectedIds([]); // 선택된게 없도록
    }

    // 전부 선택이 아니라면 -> 전체 선택
    else {
      //d만 추출해서 selectedIds로 저장
      setSelectedIds(mealboxes.map((item) => item.id));
    }
  };

  // 개별 상품 선택/해제 토글
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      // 이전에 이미 선택->해제
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : // 선택X->새로운 id 추가
          [...prev, id]
    );
  };

  //선택된 상품 찜 삭제
  const handleDeleteSelected = async () => {
    // 선택된게 없을 경우 종료
    if (selectedIds.length === 0) return;
    try {
      // 선택된 모든 상품에 대해 관심 토글 API 호출
      await Promise.all(
        selectedIds.map((id) => dishesService.toggleInterest(id))
      );

      // 로컬 리스트에서도 제거
      setMealboxes((prev) =>
        prev.filter((item) => !selectedIds.includes(item.id))
      );
      // 선택 초기화
      setSelectedIds([]);
    } catch (error) {
      console.error("선택 관심상품 해제 오류:", error);
      alert(
        error.message ||
          "선택한 상품을 삭제(관심 해제)하는 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <main>
      {/* 헤더 */}
      <Header
        title="관심상품 목록"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <section>
        <div className={styles.page}>
          {/* 상단 선택 영역 */}
          <div className={styles.topBar}>
            <label className={styles.checkAll}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className={styles.checkAllBtn}
              />
              <span className={styles.checkboxText}>
                전체 선택 ({selectedCount}/{totalCount})
              </span>
            </label>

            <button
              className={
                selectedCount === 0
                  ? `${styles.deleteBtn} ${styles.deleteBtnDisabled}`
                  : styles.deleteBtn
              }
              onClick={handleDeleteSelected}
              disabled={selectedCount === 0}
            >
              선택 삭제
            </button>
          </div>

          {/* 카드 그리드 */}
          <div className={styles.grid}>
            {mealboxes.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => toggleSelectOne(item.id)}
                >
                  <div className={styles.imageWrapper}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.img}
                      />
                    ) : (
                      <div className={styles.imgbox} />
                    )}

                    {/* 체크 아이콘 */}
                    <div
                      className={
                        isSelected
                          ? `${styles.cardCheck} ${styles.cardCheckOn}`
                          : styles.cardCheck
                      }
                    >
                      {isSelected && (
                        <img src={checkIcon} className={styles.checkIcon} />
                      )}
                    </div>
                  </div>

                  <div className={styles.info}>
                    <p className={styles.title}>{item.name}</p>

                    {/* 할인 있을 때 */}
                    {item.discountRate > 0 ? (
                      <>
                        {/* 원가(취소선) */}
                        <p className={styles.originalPrice}>
                          {item.originalPrice.toLocaleString()}원
                        </p>

                        {/* 할인율 + 최종 가격 */}
                        <p className={styles.discountLine}>
                          <span className={styles.discountRate}>
                            {item.discountRate}%
                          </span>
                          <span className={styles.priceText}>
                            {item.price.toLocaleString()}원
                          </span>
                        </p>
                      </>
                    ) : (
                      //할인 없을 때- 최종 가격만
                      <p className={styles.onlyPrice}>
                        {item.price.toLocaleString()}원
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
