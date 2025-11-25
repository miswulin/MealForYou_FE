import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import logo from '../../assets/images/logo_small.png';
// Header heart icon
import headerHeartIcon from '../../assets/images/heart.png';
// Product card heart icons
import heartIcon from '../../assets/images/heart-m.png';
import heartFilledIcon from '../../assets/images/heart-menu-Icon.png';
import cartIcon from '../../assets/images/cart.png';
import personIcon from '../../assets/images/person.png';
import searchIcon from '../../assets/images/magnifyingglass.png';
import bibimbap from '../../assets/images/bibimbap.png';
import bannerImg from '../../assets/images/banner_img.png';

// CSS Modules are now in HomePage.module.css

// 샘플 데이터
const banners = [
  { id: 1, title: '배너 1' },
  { id: 2, title: '배너 2' },
  { id: 3, title: '배너 3' },
  { id: 4, title: '배너 4' },
  { id: 5, title: '배너 5' },
];

const popularProducts = [
  { id: 1, name: '비빔밥', originalPrice: 12000, discountRate: 15, isLiked: false, image: bibimbap },
  { id: 2, name: '김치찌개', originalPrice: 10000, discountRate: 10, isLiked: false, image: bibimbap },
  { id: 3, name: '된장찌개', originalPrice: 9000, discountRate: 5, isLiked: false, image: bibimbap },
  { id: 4, name: '제육볶음', originalPrice: 11000, discountRate: 8, isLiked: false, image: bibimbap },
  { id: 5, name: '불고기', originalPrice: 13000, discountRate: 12, isLiked: false, image: bibimbap },
];

const newProducts = [
  { id: 6, name: '새로 나온 메뉴 1', originalPrice: 15000, discountRate: 20, isLiked: false, image: bibimbap },
  { id: 7, name: '새로 나온 메뉴 2', originalPrice: 16000, discountRate: 15, isLiked: false, image: bibimbap },
  { id: 8, name: '새로 나온 메뉴 3', originalPrice: 14000, discountRate: 10, isLiked: false, image: bibimbap },
  { id: 9, name: '새로 나온 메뉴 4', originalPrice: 17000, discountRate: 12, isLiked: false, image: bibimbap },
  { id: 10, name: '새로 나온 메뉴 5', originalPrice: 18000, discountRate: 8, isLiked: false, image: bibimbap },
];

const allMenu = [
  { id: 11, name: '전체 메뉴 1', originalPrice: 8000, discountRate: 5, isLiked: false, image: bibimbap },
  { id: 12, name: '전체 메뉴 2', originalPrice: 9000, discountRate: 10, isLiked: false, image: bibimbap },
  { id: 13, name: '전체 메뉴 3', originalPrice: 10000, discountRate: 15, isLiked: false, image: bibimbap },
  { id: 14, name: '전체 메뉴 4', originalPrice: 11000, discountRate: 8, isLiked: false, image: bibimbap },
  { id: 15, name: '전체 메뉴 5', originalPrice: 12000, discountRate: 12, isLiked: false, image: bibimbap },
];

const HomePage = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [products, setProducts] = useState({
    popular: popularProducts,
    new: newProducts,
    all: allMenu
  });
  const navigate = useNavigate();
  const bannerInterval = useRef(null);

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
        <input type="text" className={styles.searchInput} placeholder="어떤 메뉴를 찾고 계신가요?" />
        <img className={styles.icon} src={searchIcon} alt="검색" />
      </div>

      <div className={styles.bannerContainer}>
        <div 
          className={styles.bannerSlide} 
          style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className={styles.banner}>
              <img 
                src={bannerImg} 
                alt={`배너 ${banner.id}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <div className={styles.bannerPagination}>
          {banners.map((_, index) => (
            <span 
              key={index}
              className={`${styles.pageDot} ${index === currentBannerIndex ? styles.pageDotActive : ''}`}
              onClick={() => handleBannerDotClick(index)}
            />
          ))}
        </div>
      </div>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>오늘의 인기상품</h2>
          <span className={styles.viewMore}>더보기 &gt;</span>
        </div>
        <div className={styles.productList}>
          {products.popular.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
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
                    <span className={styles.discountRate}>{product.discountRate}%</span>
                    <span className={styles.salePrice}>{formatPrice(salePrice)}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>따끈따끈한 신상품</h2>
          <span className={styles.viewMore}>더보기 &gt;</span>
        </div>
        <div className={styles.productList}>
          {products.new.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
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
                    <span className={styles.discountRate}>{product.discountRate}%</span>
                    <span className={styles.salePrice}>{formatPrice(salePrice)}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>밀포유 전체 메뉴</h2>
          <span className={styles.viewMore}>전체보기 &gt;</span>
        </div>
        <div className={styles.productList}>
          {products.all.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
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
                    <span className={styles.discountRate}>{product.discountRate}%</span>
                    <span className={styles.salePrice}>{formatPrice(salePrice)}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;