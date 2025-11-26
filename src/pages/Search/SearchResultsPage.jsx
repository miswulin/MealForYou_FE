import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchResultsPage.module.css';

// 헤더 컴포넌트와 아이콘 (홈페이지와 동일)
import logo from '../../assets/mealforyou_logo.svg';
import headerHeartIcon from '../../assets/heart.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('인기순');
  const [searchTerm, setSearchTerm] = useState('');
  const [productCount, setProductCount] = useState(0);
  const location = useLocation();
  
  const sortOptions = ['인기순', '추천순', '최신순', '저가순'];
  
  // 위치 상태에서 검색어 가져오기
  React.useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
    }
  }, [location.state]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 새 검색어로 검색 새로고침
      navigate('/search', { 
        state: { searchQuery: searchTerm },
        replace: true
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 - 홈페이지와 동일 */}
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

      {/* Search Bar */}
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

      <main className={styles.mainContent}>
        {/* Search Filter Bar */}
        <div className={styles.searchFilter}>
          <div className={styles.searchInfo}>
            <span className={styles.productCount}>전체상품 {productCount}개</span>
          </div>
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

        {/* No Results Message */}
        <div className={styles.noResults}>
          <div className={styles.magnifyingGlassIcon}>
            <img src={searchIcon} alt="검색" />
          </div>
          <p className={styles.noResultsText}>검색 결과 없음</p>
        </div>
      </main>
    </div>
  );
};

export default SearchResultsPage;
