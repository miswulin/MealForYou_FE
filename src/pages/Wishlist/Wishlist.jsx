import styles from "../Wishlist/Wishlist.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import checkIcon from "../../assets/images/check.png";
// 테스트용 더미데이터
const INITIAL_MEALBOXES = [
  {
    id: 1,
    name: "밀포유 소불고기 밀박스",
    originalPrice: 12000,
    discountRate: 20,
    price: 9600,
  },
  {
    id: 2,
    name: "밀포유 영양 삼계탕 밀박스",
    originalPrice: 15000,
    discountRate: 0,
    price: 12750,
  },
  {
    id: 3,
    name: "밀포유 돼지갈비찜 밀박스",
    originalPrice: 14000,
    discountRate: 0,
    price: 10500,
  },
  {
    id: 4,
    name: "밀포유 삼겹살 정식 밀박스",
    originalPrice: 16000,
    discountRate: 0,
    price: 14400,
  },
  {
    id: 5,
    name: "밀포유 돼지갈비찜 밀박스",
    originalPrice: 14000,
    discountRate: 25,
    price: 10500,
  },
  {
    id: 6,
    name: "밀포유 삼겹살 정식 밀박스",
    originalPrice: 16000,
    discountRate: 10,
    price: 14400,
  },
];

export default function Wishlist() {
  //전체 찜 목록 리스트
  const [mealboxes, setMealboxes] = useState(INITIAL_MEALBOXES);
  //선택된 상품 id 저장(배열)
  const [selectedIds, setSelectedIds] = useState([]);

  //전체 찜 상품 개수
  const totalCount = mealboxes.length;
  //선택된 상품 개수
  const selectedCount = selectedIds.length;
  //전체선택인지 판단
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

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
  const handleDeleteSelected = () => {
    // 선택된게 없을 경우 종료
    if (selectedIds.length === 0) return;

    // 선택된 상품 id를 제거하여 목록에서 삭제
    setMealboxes((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );

    // 삭제 후 선택 초기화
    setSelectedIds([]);
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
