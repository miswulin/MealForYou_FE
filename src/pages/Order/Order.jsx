import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { orderService } from "../../api/order";

import "./Order.css";
import bibimbap from "../../assets/images/bibimbap.png";
import upIcon from "../../assets/images/up.png"

// 결제수단 목록
const PAYMENT_METHODS = [
  { id: "card-easy", label: "카드 간편결제" },
  { id: "account-easy", label: "계좌 간편결제" },
  { id: "card-normal", label: "일반결제" },
  { id: "naverpay", label: "네이버페이" },
  { id: "kakaopay", label: "카카오페이" },
  { id: "tosspay", label: "토스페이" },
];

export default function Order() {
  const location = useLocation();



  const parsePriceNumber = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === "number") {
      return priceStr;
    }
    const numeric = String(priceStr).replace(/[^0-9]/g, "");
    return Number(numeric) || 0;
  };
  
  const parseQuantityNumber = (qtyStr) => {
    if (!qtyStr) return 1;
    if (typeof qtyStr === "number") return qtyStr;
    const numeric = String(qtyStr).replace(/[^0-9]/g, "");
    return Number(numeric) || 1;
  };

  const navigate = useNavigate();
  const { state } = useLocation();
  const { cartItemId } = useParams();

  const [selectedItems, setSelectedItems] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  const [shipping, setShipping] = useState({
    name: "김수니", // 기본값 (백에서 내려주면 덮어씀)
    phone: "010-0000-0000",
    address: "(01797) 서울 노원구 화랑로 621, 50주년기념관 306호",
  });

  const initialSelectedItems =
    state?.selectedItems && state.selectedItems.length > 0
      ? state.selectedItems
      : [
          {
            id: 1,
            name: "밀키트 메뉴 이름",
            price: 10000,
            qty: 1,
            optionsSummary: "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…",
          },
          {
            id: 2,
            name: "밀키트 메뉴 이름",
            price: 10000,
            qty: 1,
            optionsSummary: "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…",
          },
        ];


        useEffect(() => {
          // ① Cart → Order 플로우
          if (state?.selectedItems && state.selectedItems.length > 0) {
            setSelectedItems(state.selectedItems);
      
            if (state.shipping) {
              setShipping(state.shipping);
            }
            if (state.deliveryFee != null) {
              setDeliveryFee(state.deliveryFee);
            }
            return; // 여기서 끝
          }
      
          // ② 바로구매 플로우 (/order/:cartItemId)
          if (!cartItemId) return;
      
          const fetchOrderSheet = async () => {
            
            try {
              const itemIdsToFetch = [cartItemId];
              // 백엔드 요구사항: /orders/sheet?items={cartItemId}
              const data = await orderService.getOrderSheet(itemIdsToFetch);
              console.log("order sheet:", data);
      
              // cartItems → 화면용 selectedItems 로 변환
              const mappedItems = (data.orderItems || []).map((item) => {
                const qtyNum = parseQuantityNumber(item.quantity);      // "2개" → 2
                const totalPriceNum = parsePriceNumber(item.totalPrice); // "20,000원" → 20000
                const unitPrice =
                  qtyNum > 0 ? Math.floor(totalPriceNum / qtyNum) : totalPriceNum;
      
                return {
                  id: item.cartItemId,
                  name: item.dishName,
                  price: unitPrice,
                  qty: qtyNum,
                  // ✅ 여기로 옵션 설명 넣어줌 → 주문 상품 리스트에서 그대로 사용
                  optionsSummary: item.optionDescription,
                };
              });
      
              setSelectedItems(mappedItems);
              setDeliveryFee(parsePriceNumber(data.shippingFee));
      
              // 백엔드에서 배송지 내려주면 여기에 매핑
              if (data.receiverName || data.receiverPhone || data.address) {
                setShipping((prev) => ({
                  name: data.receiverName ?? prev.name,
                  phone: data.receiverPhone ?? prev.phone,
                  address: data.address ?? prev.address,
                }));
              }
            } catch (error) {
              console.error("주문서 조회 실패:", error);
              alert(error.message || "주문 정보를 불러오지 못했습니다.");
            }
          };
      
          fetchOrderSheet();
        }, [cartItemId, state]);


  const formatPrice = (n) => n.toLocaleString("ko-KR");

  const productsTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems]
  );

  const finalTotal = productsTotal + deliveryFee;

  const handlePay = async () => {
    const orderNumber = Date.now().toString();

    if (!shipping.address) {
      alert("배송지 정보가 유효하지 않습니다.");
      return;
    }

    const cartItemIds = selectedItems.map(item => item.id);

    const getPaymentType = (methodId) => {
      switch(methodId) {
          case 'card-easy': return 'QUICK_CARD';
          case 'account-easy': return 'QUICK_ACCOUNT';
          case 'normal': return 'NORMALPAY';
          case 'naverpay': return 'NAVER_PAY';
          case 'kakaopay': return 'KAKAO_PAY';
          case 'tosspay': return 'TOSS_PAY';
          default: return 'QUICK_CARD'; 
          }
      };
    const orderData = {
        cartItemIds: cartItemIds,
        paymentType: getPaymentType(selectedMethod),
        receiverName: shipping.name,
        receiverPhone: shipping.phone,
        address: shipping.address,
    };

    // 2. 주문 생성 (결제) API 호출
    try {
      const orderNumberFromApi = await orderService.createOrder(orderData);
      
      // 3. 성공 처리: 주문 완료 페이지로 이동
      navigate("/ordercomplete", {
        state: {
          order: {
            // 서버에서 받은 값 사용 (서버 응답이 주문번호일 경우)
            // NOTE: 서버 응답이 '0' 등 의미없는 값이면 별도 처리 필요
            orderNumber: orderNumberFromApi !== '0' ? orderNumberFromApi : Date.now().toString(), 
            items: selectedItems,
            deliveryFee,
            shipping,
            paidAt: new Date().toLocaleString("ko-KR"),
            payMethod: selectedMethod,
            totalPrice: finalTotal,
          },
        },
      });
      
      } catch (error) {
          console.error("결제 실패:", error);
          alert('결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    };


  return (
    <div className="order-root">
      <Header
        title="주문 / 결제"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      <main className="order-main">
        {/* 배송지 */}
        <section className="order-section order-shipping">
          <div className="order-section-header">
            <h2 className="order-section-title">배송지</h2>
            <button className="order-section-toggle" type="button" onClick={() => setIsShippingOpen((v) => !v)}>
              <img src={upIcon} alt="열기" className={`toggle-icon ${isShippingOpen ? "open" : "closed"}`} />
            </button>
          </div>
          {isShippingOpen && (
          <div className="order-shipping-body">
            <dl className="order-shipping-row">
              <dt>수령인</dt>
              <dd>{shipping.name}</dd>
            </dl>
            <dl className="order-shipping-row">
              <dt>전화번호</dt>
              <dd>{shipping.phone}</dd>
            </dl>
            <dl className="order-shipping-row">
              <dt>주소</dt>
              <dd>{shipping.address}</dd>
            </dl>
          </div>
        )}
        </section>

        {/* 주문 상품 */}
        <section className="order-section order-items">
          <button
            type="button"
            className="order-section-header order-items-header"
            onClick={() => setIsItemsOpen((v) => !v)}
          >
            <h2 className="order-section-title">주문 상품</h2>
            <span className="order-section-toggle">
              {isItemsOpen ? "▴" : "▾"}
            </span>
          </button>

          {isItemsOpen && (
            <div className="order-items-list">
              {selectedItems.map((item) => (
                <article key={item.id} className="order-item">
                  <div className="order-item-thumb-wrap">
                    <img
                      src={bibimbap}
                      alt={item.name}
                      className="order-item-thumb"
                    />
                  </div>
                  <div className="order-item-info">
                    <div className="order-item-top-row">
                      <h3 className="order-item-name">{item.name}</h3>
                      <span className="order-item-qty">{item.qty}개</span>
                    </div>
                    <p className="order-item-options">
                      {item.optionsSummary ||
                        "옵션1(00g) 1개, 옵션2(00g) 1개, 옵션3(00g)…"}
                    </p>
                    <p className="order-item-price">
                      {formatPrice(item.price * item.qty)}원
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 결제 금액 */}
        <section className="order-section order-price">
          <h2 className="order-section-title">결제 금액</h2>
          <div className="order-price-body">
            <div className="order-price-row">
              <span>선택 상품 금액</span>
              <span>{formatPrice(productsTotal)}원</span>
            </div>
            <div className="order-price-row">
              <span>배송비</span>
              <span>{formatPrice(deliveryFee)}원</span>
            </div>
            <div className="order-price-row order-price-final">
              <span>최종 결제 금액</span>
              <span className="order-price-final-value">
                {formatPrice(finalTotal)}원
              </span>
            </div>
          </div>
        </section>

        {/* 결제수단 */}
        <section className="order-section order-pay-method">
          <h2 className="order-section-title">결제수단</h2>
          <div className="order-pay-method-list">
            {PAYMENT_METHODS.map((method) => (
              <label key={method.id} className="order-pay-method-row">
                <input
                  type="radio"
                  name="payMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="order-notice">
          주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
        </p>
      </main>

      {/* 하단 결제 버튼 */}
      <div className="order-bottom-bar">
        <button
            className="order-pay-btn"
            disabled={selectedItems.length === 0}
            onClick={handlePay}
        >
         <span className="order-pay-text">결제하기</span>
        </button>
        </div>
    </div>
  );
}
