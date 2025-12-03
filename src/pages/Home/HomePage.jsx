import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import logo from '../../assets/mealforyou_logo.svg';
// Header heart icon
import headerHeartIcon from '../../assets/heart.svg';
// Product card heart icons
import heartIcon from '../../assets/heart-m.svg';
import heartFilledIcon from '../../assets/heart-menu-Icon.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';
import bibimbap from '../../assets/images/bibimbap.png';
import bannerImg1 from '../../assets/images/banner_img.png';
import bannerImg2 from '../../assets/images/삼겹살.png';
import bannerImg3 from '../../assets/images/삼계탕.png';
import bannerImg4 from '../../assets/images/잔치국수.png';
import bannerImg5 from '../../assets/images/떡볶이.png';
import rightArrowIcon from '../../assets/right_arrow.svg';

// CSS Modules are now in HomePage.module.css

// 배너 데이터
const banners = [
  { id: 1, title: '기본 배너', image: bannerImg1 },
  { id: 2, title: '삼겹살', image: bannerImg2 },
  { id: 3, title: '삼계탕', image: bannerImg3 },
  { id: 4, title: '잔치국수', image: bannerImg4 },
  { id: 5, title: '떡볶이', image: bannerImg5 },
];

// API에서 받아온 데이터를 컴포넌트에서 사용하는 형식으로 변환
const transformDishData = (dishes) => {
  if (!dishes) return [];
  return dishes.map(dish => ({
    id: dish.id,
    name: dish.name,
    originalPrice: dish.basePrice,
    discountRate: 0, // 할인율은 API 응답에 없으므로 기본값 0으로 설정
    isLiked: dish.interested || false,
    image: bibimbap, // 기본 이미지 사용
    imageUrl: dish.imageUrl // API에서 받은 이미지 URL
  }));
};

const HomePage = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState({
    popular: [],
    new: [],
    all: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const bannerInterval = useRef(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('/api/dishes/main');
        if (!response.ok) {
          throw new Error('API 요청에 실패했습니다.');
        }
        const data = await response.json();

        setProducts({
          popular: transformDishData(data.popularDishes || []),
          new: transformDishData(data.newDishes || []),
          all: transformDishData(data.recommendedDishes || []) // 추천 상품을 all 메뉴로 사용
        });
        setError(null);
      } catch (err) {
        console.error('메뉴를 불러오는 중 오류가 발생했습니다:', err);
        setError('메뉴를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm.trim()) {
      navigate('/search', { state: { searchQuery: searchTerm } });
    }
  };

  // 배너 자동 슬라이드
  useEffect(() => {
    bannerInterval.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 3000);

    return () => {
      if (bannerInterval.current) {
        clearInterval(bannerInterval.current);
      }
    };
  }, []);

  const handleBannerDotClick = (index) => {
    setCurrentBannerIndex(index);
    // 사용자가 배너를 수동으로 변경할 때 인터벌 리셋
    if (bannerInterval.current) {
      clearInterval(bannerInterval.current);
      bannerInterval.current = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % banners.length);
      }, 3000);
    }
  };

  const toggleLike = (category, id) => {
    setProducts(prev => ({
      ...prev,
      [category]: prev[category].map(product =>
        product.id === id
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    }));
  };

  const calculateSalePrice = (originalPrice, discountRate) => {
    // 원가와 할인율을 기반으로 할인가 계산
    return Math.round(originalPrice * (1 - discountRate / 100));
  };

  const formatPrice = (price) => {
    // 가격에 쉼표 추가하여 포맷팅
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img className={styles.logo} src={logo} alt="MealForYou" />
        <div className={styles.iconContainer}>
          <img
            className={styles.icon}
            src={headerHeartIcon}
            alt="찜"
            onClick={() => navigate('/wishlist')}
          />
          <img
            className={styles.icon}
            src={cartIcon}
            alt="장바구니"
            onClick={() => navigate('/cart')}
          />
          <img
            className={styles.icon}
            src={personIcon}
            alt="마이페이지"
            onClick={() => navigate('/mypage')}
          />
        </div>
      </header>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="어떤 메뉴를 찾고 계신가요?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <img
          className={styles.icon}
          src={searchIcon}
          alt="검색"
          onClick={handleSearch}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className={styles.bannerContainer}>
        <div
          className={styles.bannerSlide}
          style={{
            transform: `translateX(-${currentBannerIndex * (100 / banners.length)}%)`,
            width: `${banners.length * 100}%`
          }}
        >
          {banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={styles.banner}
              style={{
                width: `${100 / banners.length}%`,
                height: '100%',
                flexShrink: 0
              }}
            >
              <img
                src={banner.image}
                alt={banner.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.bannerPagination}>
          <span className={styles.pageNumber}>
            <span className={styles.currentPage}>{currentBannerIndex + 1}</span>
            <span className={styles.separator} />
            <span className={styles.totalPages}>{banners.length}</span>
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>오늘의 인기상품</h2>
              <span className={styles.viewMore} onClick={() => navigate('/menu-list', { state: { title: '오늘의 인기상품' } })}>
                더보기 <img src={rightArrowIcon} alt="" className={styles.arrowIcon} />
              </span>
            </div>
            <div className={styles.productList}>
              {products.popular && products.popular.length > 0 ? products.popular.map(product => {
                const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
                return (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => navigate(`/product-detail/${dish.id}`, { state: { product } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.productImage}>
                      <img src={product.imageUrl || product.image} alt={product.name} className={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = product.image;
                        }}
                      />
                      <div
                        className={styles.heartButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike('popular', product.id);
                        }}
                      >
                        <img
                          src={product.isLiked ? heartFilledIcon : heartIcon}
                          alt={product.isLiked ? '찜 해제' : '찜하기'}
                        />
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}원</span>
                      <div className={styles.priceContainer}>
                        <span className={styles.discountRate}>{product.discountRate}<span className={styles.percentUnit}>%</span></span>
                        <span className={styles.salePrice}>{formatPrice(salePrice)}<span className={styles.priceUnit}>원</span></span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className={styles.noData}>인기 상품이 없습니다.</div>
              )}
            </div>
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>따끈따끈한 신상품</h2>
              <span className={styles.viewMore} onClick={() => navigate('/menu-list', { state: { title: '따끈따끈한 신상품' } })}>
                더보기 <img src={rightArrowIcon} alt="" className={styles.arrowIcon} />
              </span>
            </div>
            <div className={styles.productList}>
              {products.new && products.new.length > 0 ? products.new.map(product => {
                const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
                return (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => navigate(`/product-detail/${dish.id}`, { state: { product } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.productImage}>
                      <img src={product.imageUrl || product.image} alt={product.name} className={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = product.image;
                        }}
                      />
                      <div
                        className={styles.heartButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike('new', product.id);
                        }}
                      >
                        <img
                          src={product.isLiked ? heartFilledIcon : heartIcon}
                          alt={product.isLiked ? '찜 해제' : '찜하기'}
                        />
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}원</span>
                      <div className={styles.priceContainer}>
                        <span className={styles.discountRate}>{product.discountRate}<span className={styles.percentUnit}>%</span></span>
                        <span className={styles.salePrice}>{formatPrice(salePrice)}<span className={styles.priceUnit}>원</span></span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className={styles.noData}>신상품이 없습니다.</div>
              )}
            </div>
          </section>

          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>밀포유 전체 메뉴</h2>
              <span className={styles.viewMore} onClick={() => navigate('/menu-list', { state: { title: '밀포유 전체 메뉴' } })}>
                전체보기 <img src={rightArrowIcon} alt="" className={styles.arrowIcon} />
              </span>
            </div>
            <div className={styles.allMenuGrid}>
              {products.all && products.all.length > 0 ? products.all.slice(0, 6).map(product => {
                const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
                return (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => navigate(`/product-detail/${dish.id}`, { state: { product } })}
                  >
                    <div className={styles.productImage}>
                      <img src={product.imageUrl || product.image} alt={product.name} className={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = product.image;
                        }}
                      />
                      <div
                        className={styles.heartButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike('all', product.id);
                        }}
                      >
                        <img
                          src={product.isLiked ? heartFilledIcon : heartIcon}
                          alt={product.isLiked ? '찜 해제' : '찜하기'}
                        />
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}원</span>
                      <div className={styles.priceContainer}>
                        <span className={styles.discountRate}>{product.discountRate}<span className={styles.percentUnit}>%</span></span>
                        <span className={styles.salePrice}>{formatPrice(salePrice)}<span className={styles.priceUnit}>원</span></span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className={styles.noData}>전체 메뉴가 없습니다.</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;