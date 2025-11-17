import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/images/logo_small.png';
import heartIcon from '../../assets/images/heart.png';
import heartFilledIcon from '../../assets/images/heart-m.png';
import cartIcon from '../../assets/images/cart.png';
import personIcon from '../../assets/images/person.png';
import searchIcon from '../../assets/images/magnifyingglass.png';
import bibimbap from '../../assets/images/bibimbap.png';

// 스타일드 컴포넌트
const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0 16px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const Logo = styled.img`
  height: 24px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
  margin: 16px 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  margin-left: 8px;
`;

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin: 16px 0;
`;

const BannerSlide = styled.div`
  display: flex;
  width: 500%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${props => -props.currentIndex * 100}%);
`;

const Banner = styled.div`
  width: 20%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
`;

const BannerPagination = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const PageDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#FF6B6B' : '#fff'};
  opacity: ${props => props.active ? 1 : 0.5};
  cursor: pointer;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 16px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const ViewMore = styled.span`
  font-size: 14px;
  color: #666;
  cursor: pointer;
`;

const ProductList = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductCard = styled.div`
  min-width: 160px;
  position: relative;
  cursor: pointer;
`;

const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeartButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const ProductInfo = styled.div`
  padding: 0 4px;
`;

const ProductName = styled.h3`
  font-size: 14px;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountRate = styled.span`
  font-size: 12px;
  color: #FF6B6B;
  font-weight: bold;
`;

const SalePrice = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

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
    <Container>
      <Header>
        <Logo src={logo} alt="MealForYou" />
        <IconContainer>
          <Icon src={heartIcon} alt="찜" onClick={() => navigate('/wishlist')} />
          <Icon src={cartIcon} alt="장바구니" onClick={() => navigate('/cart')} />
          <Icon src={personIcon} alt="마이페이지" onClick={() => navigate('/mypage')} />
        </IconContainer>
      </Header>

      <SearchBar>
        <Icon src={searchIcon} alt="검색" />
        <SearchInput type="text" placeholder="어떤 메뉴를 찾고 계신가요?" />
      </SearchBar>

      <BannerContainer>
        <BannerSlide currentIndex={currentBannerIndex}>
          {banners.map((banner, index) => (
            <Banner key={banner.id}>
              {banner.title}
            </Banner>
          ))}
        </BannerSlide>
        <BannerPagination>
          {banners.map((_, index) => (
            <PageDot 
              key={index} 
              active={index === currentBannerIndex} 
              onClick={() => handleBannerDotClick(index)}
            />
          ))}
        </BannerPagination>
      </BannerContainer>

      <section>
        <SectionHeader>
          <SectionTitle>오늘의 인기상품</SectionTitle>
          <ViewMore>더보기 &gt;</ViewMore>
        </SectionHeader>
        <ProductList>
          {products.popular.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <ProductCard key={product.id}>
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                  <HeartButton onClick={(e) => {
                    e.stopPropagation();
                    toggleLike('popular', product.id);
                  }}>
                    <img 
                      src={product.isLiked ? heartFilledIcon : heartIcon} 
                      alt={product.isLiked ? '찜 해제' : '찜하기'} 
                    />
                  </HeartButton>
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <PriceContainer>
                    <DiscountRate>{product.discountRate}%</DiscountRate>
                    <SalePrice>{formatPrice(salePrice)}원</SalePrice>
                  </PriceContainer>
                  <OriginalPrice>{formatPrice(product.originalPrice)}원</OriginalPrice>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductList>
      </section>

      <section>
        <SectionHeader>
          <SectionTitle>따끈따끈한 신상품</SectionTitle>
          <ViewMore>더보기 &gt;</ViewMore>
        </SectionHeader>
        <ProductList>
          {products.new.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <ProductCard key={product.id}>
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                  <HeartButton onClick={(e) => {
                    e.stopPropagation();
                    toggleLike('new', product.id);
                  }}>
                    <img 
                      src={product.isLiked ? heartFilledIcon : heartIcon} 
                      alt={product.isLiked ? '찜 해제' : '찜하기'} 
                    />
                  </HeartButton>
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <PriceContainer>
                    <DiscountRate>{product.discountRate}%</DiscountRate>
                    <SalePrice>{formatPrice(salePrice)}원</SalePrice>
                  </PriceContainer>
                  <OriginalPrice>{formatPrice(product.originalPrice)}원</OriginalPrice>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductList>
      </section>

      <section>
        <SectionHeader>
          <SectionTitle>밀포유 전체메뉴</SectionTitle>
          <ViewMore>더보기 &gt;</ViewMore>
        </SectionHeader>
        <ProductList>
          {products.all.map(product => {
            const salePrice = calculateSalePrice(product.originalPrice, product.discountRate);
            return (
              <ProductCard key={product.id}>
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                  <HeartButton onClick={(e) => {
                    e.stopPropagation();
                    toggleLike('all', product.id);
                  }}>
                    <img 
                      src={product.isLiked ? heartFilledIcon : heartIcon} 
                      alt={product.isLiked ? '찜 해제' : '찜하기'} 
                    />
                  </HeartButton>
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <PriceContainer>
                    <DiscountRate>{product.discountRate}%</DiscountRate>
                    <SalePrice>{formatPrice(salePrice)}원</SalePrice>
                  </PriceContainer>
                  <OriginalPrice>{formatPrice(product.originalPrice)}원</OriginalPrice>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductList>
      </section>
    </Container>
  );
};

export default HomePage;