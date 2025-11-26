import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MenuListPage.module.css';

// 아이콘
import logo from '../../assets/mealforyou_logo.svg';
import headerHeartIcon from '../../assets/heart.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';

const MenuListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('인기순');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['전체', '한식', '중식', '일식', '양식', '분식', '디저트'];
  const sortOptions = ['인기순', '추천순', '최신순', '저가순'];

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
        {/* 카테고리 필터 */}
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

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

        {/* 상품 목록 */}
        <div className={styles.productList}>
          {/* 상품 아이템들이 여기에 표시됩니다 */}
          <div className={styles.noResults}>
            <p className={styles.noResultsText}>상품이 없습니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuListPage;
