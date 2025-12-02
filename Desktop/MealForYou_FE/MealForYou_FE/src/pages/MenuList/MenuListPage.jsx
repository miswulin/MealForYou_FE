import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MenuListPage.module.css';

// 아이콘
import logo from '../../assets/mealforyou_logo.svg';
import headerHeartIcon from '../../assets/heart.svg';
import cartIcon from '../../assets/bag.svg';
import personIcon from '../../assets/person.svg';
import searchIcon from '../../assets/magnifyingglass.svg';
import heartIcon from '../../assets/heart-m.svg';
import heartFilledIcon from '../../assets/heart-menu-Icon.svg';
import bibimbap from '../../assets/images/bibimbap.png';


const MenuListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: 'default', label: '기본순' },
    { value: 'popular', label: '인기순' },
    { value: 'recommend', label: '추천순' },
    { value: 'new', label: '최신순' },
    { value: 'low_price', label: '저가순' },
  ];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/dishes?sort=${selectedSort}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        setMenuItems(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('메뉴를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedSort]);

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setIsDropdownOpen(false);
  };

  const toggleLike = async (id) => {
    try {
      // TODO: Implement like API call when available
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, interested: !item.interested } 
            : item
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
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
          <span className={styles.productCount}>전체상품 {menuItems.length}개</span>
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
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
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
              <div className={styles.noItems}>표시할 메뉴가 없습니다.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuListPage;
