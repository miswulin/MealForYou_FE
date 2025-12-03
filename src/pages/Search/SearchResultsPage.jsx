import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchResultsPage.module.css';

// 헤더 컴포넌트와 아이콘 (홈페이지와 동일)
import logo from '../../assets/mealforyou_logo.svg';
import headerHeartIcon from '../../assets/heart.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';
import heartIcon from '../../assets/heart-m.svg';
import heartFilledIcon from '../../assets/heart-menu-Icon.svg';
import bibimbap from '../../assets/images/bibimbap.png';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // 쿠키에서 CSRF 토큰 가져오는 함수
  const getCsrfToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  };

  // localStorage에서 accessToken 가져오는 함수
  const getAccessToken = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.accessToken;
      }
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
    }
    return null;
  };

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }
      
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      return data.accessToken;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      localStorage.removeItem('user');
      navigate('/login');
      return null;
    }
  };

  const toggleLike = async (id) => {
    const csrfToken = getCsrfToken();
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      
      const response = await fetch(`/api/dishes/${id}/interest`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 필요한 서비스입니다.');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('관심 상품 등록/해제에 실패했습니다.');
      }

      const isLiked = await response.json();

      setSearchResults(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, interested: isLiked } 
            : item
        )
      );
    } catch (err) {
      console.error('관심 상품 등록/해제 중 오류:', err);
      alert('관심 상품 등록/해제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const calculateSalePrice = (originalPrice, discountRate) => {
    if (!discountRate) return originalPrice;
    return Math.round(originalPrice * (1 - discountRate / 100));
  };

  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0';
  };

  const getSortLabel = (value) => {
    const option = sortOptions.find(opt => opt.value === value);
    return option ? option.label : '기본순';
  };

  const sortOptions = [
    { value: 'default', label: '기본순' },
    { value: 'popular', label: '인기순' },
    { value: 'recommend', label: '추천순' },
    { value: 'new', label: '최신순' },
    { value: 'low_price', label: '저가순' },
  ];

  // 검색어가 변경될 때마다 검색 실행
  useEffect(() => {
    const searchKeyword = location.state?.searchQuery || '';
    setSearchTerm(searchKeyword);
    
    if (searchKeyword) {
      fetchSearchResults(searchKeyword);
    } else {
      setSearchResults([]);
    }
  }, [location.state, selectedSort]);

  const fetchSearchResults = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let accessToken = getAccessToken();
      let headers = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      let response = await fetch(`/api/dishes/search?keyword=${encodeURIComponent(keyword.trim())}&sort=${selectedSort}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      // 토큰 만료 시 갱신 시도
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(`/api/dishes/search?keyword=${encodeURIComponent(keyword.trim())}&sort=${selectedSort}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
          });
        } else {
          throw new Error('인증 실패');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // API 응답이 배열이 아닌 경우를 대비해 처리
      const results = Array.isArray(data) ? data : [];
      setSearchResults(results);
    } catch (err) {
      console.error('검색 중 오류가 발생했습니다:', err);
      
      if (err.code === 'ERR_NETWORK' || err.response?.status === 403) {
        setError('서버에 접근할 수 없습니다. 나중에 다시 시도해주세요.');
      } else if (err.message === '인증 실패') {
        setError('인증에 실패했습니다. 다시 로그인해주세요.');
      } else {
        setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setIsDropdownOpen(false);
  };
  
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
        {/* 정렬 및 상품 수 */}
        <div className={styles.searchFilter}>
          <div className={styles.searchInfo}>
            <span className={styles.productCount}>
              {searchResults.length > 0 && location.state?.searchQuery 
                ? `'${location.state.searchQuery}' 검색 결과 ${searchResults.length}개`
                : `전체상품 ${searchResults.length}개`
              }
            </span>
          </div>
          <div className={styles.dropdown}>
            <button 
              className={styles.dropdownButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            >
              {getSortLabel(selectedSort)}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                {sortOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`${styles.dropdownItem} ${selectedSort === option.value ? styles.selected : ''}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 로딩 및 에러 상태 */}
        {isLoading && <div className={styles.loading}>로딩 중...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {/* 상품 목록 */}
        {!isLoading && !error && (
          <div className={styles.productList}>
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div key={item.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <img 
                      src={item.imageUrl || bibimbap} 
                      alt={item.name} 
                      className={styles.productImage} 
                      onClick={() => navigate(`/product-detail/${item.id}`)}
                    />
                    <button 
                      className={styles.heartButton}
                      onClick={() => toggleLike(item.id)}
                    >
                      <img 
                        src={item.interested ? heartFilledIcon : heartIcon} 
                        alt={item.interested ? '찜 해제' : '찜하기'} 
                        className={styles.heartIcon}
                      />
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <div className={styles.priceContainer}>
                      {item.discountRate > 0 && (
                        <>
                          <span className={styles.originalPrice}>
                            {formatPrice(item.basePrice)}원
                          </span>
                          <span className={styles.discountRate}>
                            {item.discountRate}%
                          </span>
                        </>
                      )}
                      <span className={styles.salePrice}>
                        {formatPrice(item.discountRate > 0 ? calculateSalePrice(item.basePrice, item.discountRate) : item.basePrice)}<span className={styles.priceUnit}>원</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResultsContainer}>
                <div className={styles.magnifyingGlassIcon}>
                  <img src={searchIcon} alt="검색" />
                </div>
                <p className={styles.noResultsText}>검색 결과 없음</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;