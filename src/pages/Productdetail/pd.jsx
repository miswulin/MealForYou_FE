// src/pages/Pd/Pd.jsx (예시 경로에 맞춰 수정)
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel } from "swiper/modules";
import { useNavigate /*, useParams */ } from "react-router-dom";

import Header from "../../components/Header";
import BottomSheet from "./BottomSheet";
import CartModal from "./CartModal";
import { dishesService } from "../../api/dishes";

import "swiper/css";
import "swiper/css/pagination";

import "./pd.css";
import bibimbap from "../../assets/images/bibimbap.png";
import bibimbap2 from "../../assets/images/bibimbap2.png";
import heart from "../../assets/images/heart-m.png";
import shareIcon from "../../assets/images/share.png";

export default function Pd() {
  const navigate = useNavigate();

  const dishId = 1;

  // 상단 이미지
  const [images, setImages] = useState([bibimbap, bibimbap2]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 상품 기본 정보
  const [dishName, setDishName] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [userHealthTags, setUserHealthTags] = useState([]);
  const [isInterested, setIsInterested] = useState(false);

  // 추천 옵션(칩)
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  const [selectedRecommendId, setSelectedRecommendId] = useState(null);

  // 바텀 시트 옵션들
  const [sauceOptions, setSauceOptions] = useState([]);  
  const [baseOptions, setBaseOptions] = useState([]);     
  const [extraOptions, setExtraOptions] = useState([]);   

  // 모달 & 바텀시트
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // 영어 productTag -> 한글 라벨
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

  // 상세 정보 불러오기
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

        // 2) 상세 이미지
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        if (data.dishImages && data.dishImages.length > 0) {
          setImages(
            data.dishImages.map((img) =>
              img.imgUrl.startsWith("http")
                ? img.imgUrl
                : `${baseUrl}${img.imgUrl}`
            )
          );
        }

        // 3) 추천 옵션(칩)
        setRecommendedOptions(
          (data.recommendedIngredients || []).map((ri) => ({
            id: ri.dishIngredientId,
            label: ri.name,
            tags: [productTagToLabel(ri.productTag)].filter(Boolean),
          }))
        );

        // 4) 카테고리별 옵션
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

  // 찜 토글 (관심 상품 등록/해제)
  const handleToggleInterest = async () => {
    try {
      const result = await dishesService.toggleInterest(dishId); 
      setIsInterested(result);
    } catch (error) {
      console.error("관심 상품 설정 실패:", error);
      alert("관심 상품 설정에 실패했습니다.");
    }
  };

  // 수량 조절 함수들
  const changeSauceQty = (id, delta) => {
    setSauceOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, qty: Math.max(0, opt.qty + delta) } : opt
      )
    );
  };

  const changeBaseQty = (id, delta) => {
    setBaseOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, qty: Math.max(0, opt.qty + delta) } : opt
      )
    );
  };

  const changeExtraQty = (id, delta) => {
    setExtraOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, qty: Math.max(0, opt.qty + delta) } : opt
      )
    );
  };

  // 선택한 옵션 
  const getSelectedOptionsForApi = () => {
    const allOptions = [...baseOptions, ...extraOptions, ...sauceOptions];

    return allOptions
      .filter((opt) => opt.qty > 0)
      .map((opt) => ({
        ingredientId: opt.id,
        quantity: opt.qty,
      }));
  };

  // 장바구니 담기
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

  // 바로 구매
  const handleBuyNow = async () => {
    const optionsToBuy = getSelectedOptionsForApi();
    if (optionsToBuy.length === 0) {
      alert("구매할 옵션을 1개 이상 선택해주세요.");
      return;
    }

    try {
      const cartItemId = await dishesService.buyNow(dishId, optionsToBuy);
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
        onHeart={handleToggleInterest}
        isHeartActive={isInterested}
        onCart={() => navigate("/cart")}
        onPerson={() => navigate("/login")}
      />

      {/* ----- 메인 영역 ----- */}
      <main className="pd-main">
        {/* 이미지 슬라이더 */}
        <section className="pd-product-img">
          <Swiper
            className="pd-swiper"
            modules={[Pagination, Mousewheel]}
            spaceBetween={0}
            slidesPerView={1}
            
            mousewheel={{ forceToAxis: true }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`상품 이미지 ${i + 1}`}
                  className="pd-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="pd-img-indicator">
            {images.length > 0
              ? `${currentIndex + 1} / ${images.length}`
              : "0 / 0"}
          </div>
        
        </section>

        {/* 제목 / 가격 */}
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
            <span className="pd-discount">26%</span>
            <span className="pd-final-price">
              {basePrice.toLocaleString("ko-KR")}원
            </span>
          </div>

          <p className="pd-sub-info">원산지: 상품설명/상세정보 참조</p>
        </section>

        {/* 아래 상세 설명 부분은 기존 더미 그대로 둬도 됨 */}
        {/* ... (pd-details, pd-story, pd-frame) ... */}
      </main>

      {/* 하단 버튼 */}
      <div className="pd-bottom-sheet">
        <button className={`pd-like-btn ${isInterested ? 'active' : ''}`} aria-label="찜하기" onClick={handleToggleInterest}>
          <img src={heart} alt="" />
        </button>
        <button className="pd-buy-btn" onClick={() => setIsSheetOpen(true)}>
          구매하기
        </button>
      </div>

      {/* 바텀 시트 - 옵션 선택 */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <h3 className="pd-sheet-section-label">
          {userHealthTags.length > 0
            ? `${userHealthTags.join("·")} 옵션 추천`
            : "추천 옵션"}
        </h3>

        {/* 추천 옵션 칩 */}
        <div className="pd-sheet-recommend">
          <div className="pd-chip-scroll">
            {recommendedOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  "pd-chip-card" +
                  (selectedRecommendId === opt.id ? " active" : "")
                }
                onClick={() => setSelectedRecommendId(opt.id)}
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
