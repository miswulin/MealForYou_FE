import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MenuListPage.module.css';

// 아이콘
import logo from '../../assets/mealforyou_logo.svg';
import headerHeartIcon from '../../assets/heart.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';
import heartIcon from '../../assets/images/heart-m.png';
import heartFilledIcon from '../../assets/images/heart-menu-Icon.png';
import bibimbap from '../../assets/images/bibimbap.png';

const MenuListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('인기순');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState({
    all: [
      { id: 1, name: '비빔밥', originalPrice: 12000, discountRate: 15, isLiked: false, image: bibimbap },
      { id: 2, name: '김치찌개', originalPrice: 10000, discountRate: 10, isLiked: false, image: bibimbap },
      { id: 3, name: '된장찌개', originalPrice: 9000, discountRate: 5, isLiked: false, image: bibimbap },
      { id: 4, name: '제육볶음', originalPrice: 11000, discountRate: 8, isLiked: false, image: bibimbap },
      { id: 5, name: '불고기', originalPrice: 13000, discountRate: 12, isLiked: false, image: bibimbap },
      { id: 6, name: '새로 나온 메뉴 1', originalPrice: 15000, discountRate: 20, isLiked: false, image: bibimbap },
      { id: 7, name: '새로 나온 메뉴 2', originalPrice: 16000, discountRate: 15, isLiked: false, image: bibimbap },
      { id: 8, name: '새로 나온 메뉴 3', originalPrice: 14000, discountRate: 10, isLiked: false, image: bibimbap },
    ]
  });

  const sortOptions = ['인기순', '추천순', '최신순', '저가순'];

  const toggleLike = (id) => {
    setProducts(prev => ({
      ...prev,
      all: prev.all.map(product => 
        product.id === id 
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    }));
  };

  const calculateSalePrice = (originalPrice, discountRate) => {
    return Math.round(originalPrice * (1 - discountRate / 100));
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 검색 로직 구현
      console.log('검색어:', searchTerm);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <img src={logo} alt="밀포유 로고" className={styles.logo} />
        </div>
        <div className={styles.icons}>
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

      <main className={styles.mainContent}>
        {/* 정렬 및 상품 수 */}
        <div className={styles.filterBar}>
          <span className={styles.productCount}>전체상품 0개</span>
          <div className={styles.dropdown}>
            <button 
              className={styles.dropdownButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSort}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                {sortOptions.map((option) => (
                  <div 
                    key={option}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedSort(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.productList}>
          {products.all.length > 0 ? (
            products.all.map(product => {
              const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
              return (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => navigate('/product-detail', { state: { product } })}
                >
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                    <div 
                      className={styles.heartButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(product.id);
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
            })
          ) : (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>상품이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuListPage;
