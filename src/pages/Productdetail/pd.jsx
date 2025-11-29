import React, { useState, useEffect }from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/StatusBar";
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
import shareIcon from "../../assets/images/share.png"

export default function Pd() {
    const [images, setImages] = useState([bibimbap, bibimbap2]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [dishName, setDishName] = useState("");
    const [basePrice, setBasePrice] = useState(0);
    const [userHealthTags, setHealthTags] = useState([]);
    const [recommendedOptions, setRecommendedOptions] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    const [baseOptions, setBaseOptions] = useState([]);
    const [extraOptions, setExtraOptions] = useState([]);
    const [sourceOptions, setSourceOptions] = useState([]);

    const [selectedRecommendId, setSelectedRecommendId] = useState(null);
    const navigate = useNavigate();

    const fetchDetail = async () => {
      try {
        const data = await dishesService.getDishDetail(dishId); 
        console.log("dish detail:", data);

        setBaseOptions(
          (data.ingredientsByCategory?.BASIC_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity,
          }))
        );

        setExtraOptions(
          (data.ingredientsByCategory?.ADDITIONAL_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity,
          }))
        );

        // 이미지도 API로 바꾸고 싶으면:
    // setImages(
    //   (data.dishImages || []).map((img) =>
    //     `${import.meta.env.VITE_API_BASE_URL}${img.imgUrl}`
    //   )
    // );

      } catch (error) {
        console.error("상품 상세 정보 조회 실패:", error);
        alert("상품 정보를 불러오는 데 실패했습니다.");
      }
    };

    // ingredients 배열을 화면에서 쓰기 편한 형태로 변환
    const mapIngredients = (arr = []) =>
      arr.map((ing) => ({
        id: ing.dishIngredientId,
        name: ing.name,
        price: ing.price,
        qty: ing.quantity ?? 0,
        category: ing.category,
      }));


    useEffect(() => {
      fetchDetail();
    }, []);

    const withBaseUrl = (path) => {
      if (!path) return "";
      const base = import.meta.env.VITE_API_BASE_URL ?? "";
      return path.startsWith("http") ? path : `${base}${path}`;
    };

    const dishId = 1; // 나중에 const { dishId } = useParams(); 로 교체 가능

    useEffect(() => {
      const fetchDetail = async () => {
        try {
          const data = await dishesService.getDishDetail(dishId);
  
          // 1) 기본 정보
          setDishName(data.dishName);
          setBasePrice(data.basePrice);
          setUserHealthTags(data.userHealthTags || []);
          setIsInterested(data.isInterested ?? data.interested ?? false);
  
          // 2) 상세 이미지 배열
          if (data.dishImages && data.dishImages.length > 0) {
            const base = import.meta.env.VITE_API_BASE_URL || "";
            setImages(
              data.dishImages.map((img) =>
                img.imgUrl.startsWith("http")
                  ? img.imgUrl
                  : `${base}${img.imgUrl}`
              )
            );
          }
          // 이미지 없으면 기존 더미 사용
          setImages(imgs.length > 0 ? imgs : [bibimbap, bibimbap2]);
  
          // 3) 추천 옵션 (저염/고단백 추천 카드)
          const recOptions = (data.recommendedIngredients || []).map((ri) => ({
            id: ri.dishIngredientId,
            label: ri.name,
            price: ri.price,
            tags: [ri.productTag], // 필요하면 "HIGH_PROTEIN" -> "고단백"으로 매핑
          }));
          
          setRecommendedOptions(
            (data.recommendedIngredients || []).map((ing) => ({
              id: ing.dishIngredientId,
          label: ing.name,
          tags: ing.productTag ? [ing.productTag] : [],
        }))
      );

          const tagKo = ri.productTag === "HIGH_PROTEIN" ? "고단백" : ri.productTag;
            tags: [tagKo];
  
          // 4) 카테고리별 옵션 → 기본/추가/소스 옵션 상태에 매핑
          const categories = data.ingredientsByCategory || {};
  
          const basic = (categories.BASIC_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity, // 기본 수량
          }));
          setBaseOptions(basic);
  
          const additional = (categories.ADDITIONAL_OPTION || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity,
          }));
          setExtraOptions(additional);
  
          const source = (categories.SOURCE || []).map((ing) => ({
            id: ing.dishIngredientId,
            name: ing.name,
            price: ing.price,
            qty: ing.quantity,
          }));
          setSourceOptions(source);
        } catch (error) {
          console.error("상품 상세 정보 조회 실패:", error);
          alert("상품 정보를 불러오는 데 실패했습니다.");
        }
      };
  
      fetchDetail();
    }, [dishId]);
  


    const changeSauceQty = (id, delta) => {
      setSauceOptions((prev) =>
        prev.map((opt) =>
          opt.id === id
            ? { ...opt, qty: Math.max(0, opt.qty + delta) }
            : opt
        )
      );
    };


    const changeBaseQty = (id, delta) => {
      setBaseOptions((prev) =>
        prev.map((opt) =>
          opt.id === id
            ? { ...opt, qty: Math.max(0, opt.qty + delta) }
            : opt
        )
      );
    };

    const changeExtraQty = (id, delta) => {
      setExtraOptions((prev) =>
        prev.map((opt) =>
          opt.id === id
            ? { ...opt, qty: Math.max(0, opt.qty + delta) }
            : opt
        )
      );
    };

    // 선택된 모든 옵션을 API 형식에 맞게 변환
    const getSelectedOptionsForApi = () => {
      const allOptions = [...baseOptions, ...extraOptions];
      return allOptions
          .filter(opt => opt.qty > 0)
          .map(opt => ({
              ingredientId: opt.id, //실제 API에서 받은 ID를 사용해야 함
              quantity: opt.qty
          }));
    };

    // 장바구니에 담기 
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
        {/* STATUS BAR */}
        <StatusBar/>

        {/* HEADER */}
        <Header
        title={dishName || "[신상품] 밀포유 소고기 비빔밥 키트"}
        onBack={() => navigate(-1)}
        onHeart={() => console.log("찜")}
        onCart={() => navigate("/cart")}
        onPerson={() => navigate("/login")}
        
        // showShare={true} showLike={true} showCart={true} // 노출 제어
      />

      {/* 메인 스크롤 영역 */}
      <main className="pd-main">
        {/* PRODUCT IMAGE */}
        <section className="pd-product-img">
        <Swiper
            className="pd-swiper"
            modules={[Pagination, Mousewheel]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            mousewheel={{ forceToAxis: true}}
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
            <span>{currentIndex} / {images.length}</span>
        </div>
     </section>

        {/* PRODUCT TITLE / PRICE */}
        <section className="pd-product-title">
        <div className="pd-title-row">
        <div className="pd-title-left">
            <span className="pd-tag">[신상품]</span>
            <h2 className="pd-title-inline">{dishName}</h2>

        </div>
          <img src={shareIcon}  alt="공유하기" className="pd-share-icon" />
        </div>
       

          <div className="pd-price-row">
            <span className="pd-origin-price">29,000원</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-discount">26%</span>
            <span className="pd-final-price">{basePrice.toLocaleString("ko-KR")}원</span>
          </div>

          <p className="pd-sub-info">
            원산지: 상품설명/상세정보 참조
          </p>
        </section>

        {/* DIVIDER */}
        <div className="pd-divider" />

        {/* DETAILS 영역 */}
        <section className="pd-details">
          <h3 className="pd-section-title">상품정보</h3>
          

          <dl className="pd-detail-list">
            <div className="pd-detail-row">
              <dt>포장타입</dt>
              <dd>냉동 (종이포장)</dd>
            </div>
            <div className="pd-detail-row">
              <dt>판매단위</dt>
              <dd>1팩</dd>
            </div>
            <div className="pd-detail-row">
              <dt>중량/용량</dt>
              <dd>1,215g</dd>
            </div>
            <div className="pd-detail-row">
              <dt>알레르기정보</dt>
              <dd>대두(간장), 참깨(참기름), 달걀</dd>
            </div>
            <div className="pd-detail-row">
              <dt>소비기한</dt>
              <dd>수령일 포함 180일</dd>
            </div>
          </dl>
        </section>

        {/* FRAME 영역 : 조리법 + 유의사항 카드처럼 */}

        <section className="pd-story">
        <img src={bibimbap} alt="소고기 비빔밥 한 그릇" className="pd-story-image" />

        <p className="pd-story-eyebrow">한국인이 사랑하는 소울푸드</p>
        <h3 className="pd-story-main-title">[밀포유]</h3>
        <h4 className="pd-story-subtitle">소고기 비빔밥 프레시박스</h4>

        <p className="pd-story-text">
          원하는 재료만 골라 담는 맞춤형 요리 재료 구성 서비스, 프레시박스로
          기본 좋은 한 끼를 준비해 보세요. 소고기, 시금치, 당근, 애호박,
          콩나물, 표고버섯 등 비빔밥 재료를 원하는 양만 자유롭게 담아보세요.
          고추장과 참기름까지 취향에 맞춰 선택 가능합니다.
        </p>
      </section>

      <section className="pd-story">
        <img src={bibimbap2} alt="소고기 비빔밥 프레시박스 구성" className="pd-story-image" />

        <h4 className="pd-story-subtitle">소고기 비빔밥 프레시박스</h4>
        <p className="pd-story-text">
          기본 중량 1팩(1,215g)<br />
          기본 구성: 소고기, 시금치, 당근, 애호박, 콩나물, 표고버섯 등
          비빔밥에 꼭 필요한 재료로 구성되어 있어 1인분부터 4인분까지
          상황에 맞게 조리할 수 있습니다.
        </p>
      </section>

        <section className="pd-frame">
          <div className="pd-card">
            <h3 className="pd-section-title">조리법</h3>
            <ol className="pd-step-list">
              <li>
                재료손질: 당근, 애호박 등은 채 썰기, 표고버섯 등 원하는
                형태로 손질하여 사용하세요.
              </li>
              <li>
                소고기 볶기: 소고기를 중불에서 볶아줍니다.
              </li>
              <li>
                달걀 프라이: 프라이팬에 식용유를 두르고 기호에 따라 반숙 또는
                완숙으로 구워줍니다.
              </li>
              <li>
                비빔밥 담기: 따뜻한 밥 위에 나물과 볶은 소고기, 달걀 프라이를
                보기 좋게 올립니다.
              </li>
              <li>
                소스 첨가: 고추장(또는 간장/된장) 소스와 참기름(또는 들기름)을
                넣고 골고루 비벼 완성합니다.
              </li>
            </ol>
          </div>

          <div className="pd-card">
            <h3 className="pd-section-title">유의사항</h3>
            <ul className="pd-bullet-list">
              <li>신선한 식재료로 제공되므로 사용 전 깨끗이 세척해 주세요.</li>
              <li>냉장 보관 시 채소는 3일 이내, 소고기는 2일 이내 사용을 권장합니다.</li>
              <li>알레르기 유발 성분: 대두(간장), 참깨(참기름), 달걀</li>
            </ul>
          </div>
        </section>


      </main>

      {/* BOTTOM SHEET */}
      <div className="pd-bottom-sheet">
        <button className="pd-like-btn" aria-label="찜하기">
            <img src={heart} alt="" />
        </button> 
        <button className="pd-buy-btn" onClick={() => setIsSheetOpen(true)}>
            구매하기
        </button>
      </div>
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
      <h3 className="pd-sheet-section-label">{userHealthTags.length > 0 ? `${userHealthTags.join("·")} 옵션 추천` : "추천 옵션"}</h3>

      {/* 추천 옵션 카드 리스트 */}
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

      {/* 소스/맵기 섹션 */}
      <div className="pd-sheet-section">
          <p className="pd-sheet-section-label">소스/맵기</p>

          {sauceOptions.map((opt) => ( 
            <div key={opt.id} className="pd-sheet-row">
              <div className="pd-sheet-row-left">
                <span className="pd-sheet-option-name">{opt.name}</span>
              </div>

              <div className="pd-sheet-row-right">
                <span className="pd-sheet-option-price">{opt.price.toLocaleString("ko-KR")}</span>

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

          {/* 기본 옵션 섹션 */}
          <div className="pd-sheet-section">
            <p className="pd-sheet-section-label">기본 옵션</p>

            {baseOptions.map((opt) => (
              <div key={opt.id} className="pd-sheet-row">
                {/* 왼쪽: 옵션 이름만 */}
                <div className="pd-sheet-row-left">
                  <span className="pd-sheet-option-name">{opt.name}</span>
                </div>

                {/* 오른쪽: 가격 + 수량박스 */}
                <div className="pd-sheet-row-right">
                  <span className="pd-sheet-option-price">{opt.price.toLocaleString("ko-KR")}원</span>

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

        {/* 추가 옵션 섹션 */}
        <div className="pd-sheet-section">
          <p className="pd-sheet-section-label">추가 옵션</p>

          {extraOptions.map((opt) => (
            <div key={opt.id} className="pd-sheet-row">
              <div className="pd-sheet-row-left">
                <span className="pd-sheet-option-name">{opt.name}</span>
              </div>

              <div className="pd-sheet-row-right">
                <span className="pd-sheet-option-price">{opt.price.toLocaleString("ko-KR")}</span>

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
          <button
            className="pd-sheet-cart-btn"
            onClick={handleAddToCart}>
            장바구니
          </button>
          <button
            className="pd-sheet-buy-btn"
            onClick={handleBuyNow}
          >
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
