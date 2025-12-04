import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate , useParams } from "react-router-dom";

import Header from "../../components/Header";
import BottomSheet from "./BottomSheet";
import CartModal from "./CartModal";
import { dishesService } from "../../api/dishes";
import { cartService } from "../../api/cart";

import "./pd.css";
import bibimbap from "../../assets/images/bibimbap.png";
import bibimbap2 from "../../assets/images/bibimbap2.png";
import heart from "../../assets/heart-m.svg";
import heartFilled from "../../assets/heart-menu-Icon.svg";
import shareIcon from "../../assets/share.svg";

export default function Pd() {
  const navigate = useNavigate();

  const { dishId } = useParams()

  // 상단 이미지 (기존 코드 유지)
  const [sliderImages, setSliderImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  const slideInterval = useRef(null);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const swipeThreshold = 50;

  useEffect(() => {
    if (sliderImages.length <= 1) return;

    slideInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sliderImages.length);
    }, 2000); 

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [sliderImages]);

  const resetAutoSlide = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }

    if (sliderImages.length > 1) {
      slideInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % sliderImages.length);
      }, 3000);
    }
  };

  const handleTouchStart = (e) => {
    touchEnd.current = 0;
    touchStart.current = e.touches[0].clientX;
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchEnd.current || Math.abs(touchStart.current - touchEnd.current) < swipeThreshold) {
      resetAutoSlide();
      return;
    }

    let newIndex = currentIndex;

    if (touchStart.current > touchEnd.current) {
      newIndex = Math.min(sliderImages.length - 1, currentIndex + 1);
    }
    if (touchStart.current < touchEnd.current) {
      newIndex = Math.max(0, currentIndex - 1);
    }
    
    setCurrentIndex(newIndex);
    resetAutoSlide();
  };

  // 상품 기본 정보 (기존 코드 유지)
  const [dishName, setDishName] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [userHealthTags, setUserHealthTags] = useState([]);
  const [isInterested, setIsInterested] = useState(false);

  // 추천 옵션(칩)
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  // [오류 수정] 초기값을 Set으로 설정
  const [selectedRecommendIds, setSelectedRecommendIds] = useState(new Set()); 

  // 바텀 시트 옵션들 (기존 코드 유지)
  const [sauceOptions, setSauceOptions] = useState([]);  
  const [baseOptions, setBaseOptions] = useState([]);     
  const [extraOptions, setExtraOptions] = useState([]);   

  // 모달 & 바텀시트 (기존 코드 유지)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // 영어 productTag -> 한글 라벨 (기존 코드 유지)
  const productTagToLabel = (tag) => {
    switch (tag) {
      case "HIGH_PROTEIN":
        return "고단백";
      case "LOW_SODIUM":
        return "저염";
      default:
        return tag || "";
    }
  };

  // 상세 정보 불러오기 (기존 코드 유지)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await dishesService.getDishDetail(dishId);
        console.log("dish detail:", data);

        // 1) 기본 정보
        setDishName(data.dishName);
        setBasePrice(data.basePrice);
        setUserHealthTags(data.userHealthTags || []);
        setIsInterested(data.isInterested ?? data.interested ?? false);

        // 2) 상세 이미지 (기존 코드 유지)
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        
        if (data.dishImages && data.dishImages.length > 0) {
            
            const allImages = data.dishImages.map((img) =>
                img.imgUrl.startsWith("http")
                  ? img.imgUrl
                  : `${baseUrl}${img.imgUrl}`
            );

            // 첫 번째 이미지를 슬라이더 이미지로 설정
            setSliderImages(allImages.slice(0, 1)); // ⭐️ 첫 번째 이미지만 슬라이더에 사용
            
            // 나머지 이미지들을 상세 이미지로 설정
            setDetailImages(allImages.slice(1)); // ⭐️ 두 번째 이미지부터 상세 이미지로 사용

        } else {
            setSliderImages([]);
            setDetailImages([]);
        }

        // 3) 추천 옵션(칩) (기존 코드 유지)
        setRecommendedOptions(
          (data.recommendedIngredients || []).map((ri) => ({
            id: ri.dishIngredientId,
            label: ri.name,
            tags: [productTagToLabel(ri.productTag)].filter(Boolean),
          }))
        );

        // 4) 카테고리별 옵션 (qty: 0으로 통일)
        const categories = data.ingredientsByCategory || {};

        setBaseOptions(
          (categories.BASIC_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity ?? 0,
          }))
        );

        setExtraOptions(
          (categories.ADDITIONAL_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity ?? 0,
          }))
        );

        setSauceOptions(
          (categories.SOURCE || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity ?? 0,
          }))
        );
      } catch (error) {
        console.error("상품 상세 정보 조회 실패:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchDetail();
  }, [dishId]);

  // 찜 토글 (관심 상품 등록/해제) (기존 코드 유지)
  const handleToggleInterest = async () => {
    try {
      const result = await dishesService.toggleInterest(dishId); 
      setIsInterested(result);
    } catch (error) {
      console.error("관심 상품 설정 실패:", error);
      alert("관심 상품 설정에 실패했습니다.");
    }
  };

  // 모든 옵션을 하나의 배열로 합치는 함수
  const getAllOptions = useCallback(() => {
    return [...baseOptions, ...extraOptions, ...sauceOptions];
  }, [baseOptions, extraOptions, sauceOptions]);

  // [수정] 총 금액 관련 로직 제거
  // const calculateTotal = () => { ... };

  // 옵션 ID를 통해 해당 옵션의 수량을 변경하고 Set을 동기화하는 헬퍼 함수
  const updateOptionQty = (id, newQty) => {
    const newQuantity = Math.max(0, newQty); // 수량은 0 미만이 될 수 없음

    const isBase = baseOptions.some(opt => opt.id === id);
    const isExtra = extraOptions.some(opt => opt.id === id);
    const isSauce = sauceOptions.some(opt => opt.id === id);

    if (isBase) {
      setBaseOptions(prev => prev.map(opt => 
        opt.id === id ? { ...opt, qty: newQuantity } : opt
      ));
    } else if (isExtra) {
      setExtraOptions(prev => prev.map(opt => 
        opt.id === id ? { ...opt, qty: newQuantity } : opt
      ));
    } else if (isSauce) {
      setSauceOptions(prev => prev.map(opt => 
        opt.id === id ? { ...opt, qty: newQuantity } : opt
      ));
    }
    
    // 수량이 0이 되면 추천 칩 Set에서도 제거 (상태 동기화)
    if (newQuantity === 0) {
        setSelectedRecommendIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    } else {
        // 수량이 1 이상이면 추천 칩 Set에 추가
        setSelectedRecommendIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    }
  };

  // 옵션 추천 칩 토글 로직 (다중 선택 및 수량 반영)
  const handleToggleRecommend = (id) => {
    const isSelected = selectedRecommendIds.has(id);
    
    if (isSelected) {
      // 선택 해제: 수량을 0으로 설정
      updateOptionQty(id, 0); 
    } else {
      // 선택: 수량을 1로 설정
      updateOptionQty(id, 1);
    }
  };

  // 수량 조절 함수들 (updateOptionQty를 사용하도록 수정)
  const changeSauceQty = (id, delta) => {
    const opt = sauceOptions.find(o => o.id === id);
    if (opt) {
        updateOptionQty(id, opt.qty + delta);
    }
  };

  const changeBaseQty = (id, delta) => {
    const opt = baseOptions.find(o => o.id === id);
    if (opt) {
        updateOptionQty(id, opt.qty + delta);
    }
  };

  const changeExtraQty = (id, delta) => {
    const opt = extraOptions.find(o => o.id === id);
    if (opt) {
        updateOptionQty(id, opt.qty + delta);
    }
  };

  // 선택한 옵션 (기존 코드 유지)
  const getSelectedOptionsForApi = () => {
    const allOptions = getAllOptions();

    return allOptions
      .filter((opt) => opt.qty > 0)
      .map((opt) => ({
        ingredientId: opt.id,
        quantity: opt.qty,
      }));
  };

  // 장바구니 담기 (기존 코드 유지)
  const handleAddToCart = async () => {
    const optionsToBuy = getSelectedOptionsForApi();
    if (optionsToBuy.length === 0) {
      alert("구매할 옵션을 1개 이상 선택해주세요.");
      return;
    }

    try {
      await dishesService.addToCart(dishId, optionsToBuy);
      setIsSheetOpen(false);
      setIsCartModalOpen(true);
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 담기에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 바로 구매 (기존 코드 유지)
  const handleBuyNow = async () => {
    const optionsToBuy = getSelectedOptionsForApi();
    if (optionsToBuy.length === 0) {
      alert("구매할 옵션을 1개 이상 선택해주세요.");
      return;
    }

    try {
      const cartItemId = await cartService.buyNow(dishId, optionsToBuy);
      setIsSheetOpen(false);
      navigate(`/order/${cartItemId}`);
    } catch (error) {
      console.error("바로 구매 실패:", error);
      alert("바로 구매 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };


  return (
    <div className="pd-root">

      <Header
        title={dishName}
        onBack={() => navigate(-1)}
        onHeart={() => navigate("/wishlist")}
        isHeartActive={isInterested}
        onCart={() => navigate("/cart")}
        onPerson={() => navigate("/mypage")}
      />

      {/* ----- 메인 영역 (기존 코드 유지) ----- */}
      <main className="pd-main">
        {/* 이미지 슬라이더 (기존 코드 유지) */}
        <section className="pd-product-img">
          <div className="pd-image-slide-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
          <div
              className="pd-image-slide-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`, // 이미지 이동
              }}
            >
              {sliderImages.map((src, i) => (
                <div key={i} className="pd-image-slide-item">
                  <img
                    src={src}
                    alt={`상품 이미지 ${i + 1}`}
                    className="pd-img"
                  />
                  </div>
              ))}
            </div>
          </div>

          <div className="pd-img-indicator">
            {sliderImages.length > 0
              ? `${currentIndex + 1} / ${sliderImages.length}` // 번호 슬라이드 표시
              : "0 / 0"}
          </div>

        
        </section>

        {/* 제목 / 가격 (기존 코드 유지) */}
        <section className="pd-product-title">
          <div className="pd-title-row">
            <div className="pd-title-left">
              <span className="pd-tag">[신상품]</span>
              <h2 className="pd-title-inline">{dishName}</h2>
            </div>
            <img src={shareIcon} alt="공유하기" className="pd-share-icon" />
          </div>

          <div className="pd-price-row">
            <span className="pd-origin-price">
              {/* TODO: 원가격 있으면 여기 넣기 */}
            </span>
          </div>

          <div className="pd-price-row">
            {/* 할인율도 API에 있으면 계산해서 넣기 */}
            
            <span className="pd-final-price">
              {basePrice.toLocaleString("ko-KR")}원
            </span>
          </div>

          <p className="pd-sub-info">원산지: 상품설명/상세정보 참조</p>
          {detailImages[0] && (
        <img
          src={detailImages[0]}
          alt="상세 이미지"
          className="pd-detail-img"
        />
      )}
        </section>

      </main>

      {/* 하단 버튼 (총 금액 표시 제거) */}
      <div className="pd-bottom-sheet">
      <button
          className={`pd-like-btn ${isInterested ? "active" : ""}`}
          aria-label="찜하기"
          onClick={handleToggleInterest}
        >
    <img src={isInterested ? heartFilled : heart} alt="찜하기" />
  </button>
  <button className="pd-buy-btn" onClick={() => setIsSheetOpen(true)}>
    구매하기 
  </button>
      </div>

      {/* 바텀 시트 - 옵션 선택 */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        {/* [수정] 총 금액 표시 제거 */}
        {/* <div className="pd-sheet-total-price"> ... </div> */}

        <h3 className="pd-sheet-section-label">
          {userHealthTags.length > 0
            ? `${userHealthTags.join("·")} 옵션 추천`
            : "추천 옵션"}
        </h3>

        {/* 추천 옵션 칩 (다중 선택 및 수량 반영 로직 유지) */}
        <div className="pd-sheet-recommend">
          <div className="pd-chip-scroll">
            {recommendedOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  "pd-chip-card" +
                  (selectedRecommendIds && selectedRecommendIds.has(opt.id) ? " active" : "")
                }
                onClick={() => handleToggleRecommend(opt.id)}
              >
                <span className="pd-chip-label">{opt.label}</span>
                <div className="pd-chip-tags">
                  {opt.tags.map((tag) => (
                    <span key={tag} className="pd-chip-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 소스/맵기 */}
        <div className="pd-sheet-section">
          <p className="pd-sheet-section-label">소스/맵기</p>
          {sauceOptions.map((opt) => (
            <div key={opt.id} className="pd-sheet-row">
              <div className="pd-sheet-row-left">
                <span className="pd-sheet-option-name">{opt.name}</span>
              </div>
              <div className="pd-sheet-row-right">
                <span className="pd-sheet-option-price">
                  {opt.price.toLocaleString("ko-KR")}원
                </span>
                <div className="pd-sheet-counter">
                  <button
                    onClick={() => changeSauceQty(opt.id, -1)}
                    disabled={opt.qty === 0}
                  >
                    −
                  </button>
                  <span>{opt.qty}</span>
                  <button onClick={() => changeSauceQty(opt.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 기본 옵션 */}
        <div className="pd-sheet-section">
          <p className="pd-sheet-section-label">기본 옵션</p>
          {baseOptions.map((opt) => (
            <div key={opt.id} className="pd-sheet-row">
              <div className="pd-sheet-row-left">
                <span className="pd-sheet-option-name">{opt.name}</span>
              </div>
              <div className="pd-sheet-row-right">
                <span className="pd-sheet-option-price">
                  {opt.price.toLocaleString("ko-KR")}원
                </span>
                <div className="pd-sheet-counter">
                  <button
                    onClick={() => changeBaseQty(opt.id, -1)}
                    disabled={opt.qty === 0}
                  >
                    −
                  </button>
                  <span>{opt.qty}</span>
                  <button onClick={() => changeBaseQty(opt.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 추가 옵션 */}
        <div className="pd-sheet-section">
          <p className="pd-sheet-section-label">추가 옵션</p>
          {extraOptions.map((opt) => (
            <div key={opt.id} className="pd-sheet-row">
              <div className="pd-sheet-row-left">
                <span className="pd-sheet-option-name">{opt.name}</span>
              </div>
              <div className="pd-sheet-row-right">
                <span className="pd-sheet-option-price">
                  {opt.price.toLocaleString("ko-KR")}원
                </span>
                <div className="pd-sheet-counter">
                  <button
                    onClick={() => changeExtraQty(opt.id, -1)}
                    disabled={opt.qty === 0}
                  >
                    −
                  </button>
                  <span>{opt.qty}</span>
                  <button onClick={() => changeExtraQty(opt.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pd-sheet-actions">
          <button className="pd-sheet-cart-btn" onClick={handleAddToCart}>
            장바구니
          </button>
          <button className="pd-sheet-buy-btn" onClick={handleBuyNow}>
            바로구매
          </button>
        </div>
      </BottomSheet>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onGoCart={() => {
          setIsCartModalOpen(false);
          navigate("/cart");
        }}
      />
    </div>
  );
}