import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { orderService } from "../../api/order";
import { paymentService } from "../../api/payment";

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

  


  useEffect(() => {
    // 1. 장바구니에서 넘어오는 cartItemIds 배열 또는 바로구매의 단일 cartItemId 추출
    const itemIdsFromState = state?.cartItemIds || [];
    const itemIdsToFetch = cartItemId ? [cartItemId] : itemIdsFromState; // ⭐️ 통합 처리 ⭐️

    // 주문할 상품 ID가 없으면 함수 종료 (상품 0원 문제 해결)
    if (itemIdsToFetch.length === 0) return;
    
    // API 호출 로직은 하나로 통합 (장바구니/바로구매 공통)
    const fetchOrderSheet = async () => {
      
        try {
            // itemIdsToFetch는 단일 ID 배열이거나 복수 ID 배열이 됩니다.
            const data = await orderService.getOrderSheet(itemIdsToFetch);
            console.log("order sheet:", data);
            
            // cartItems → 화면용 selectedItems 로 변환 
            const mappedItems = (data.orderItems || []).map((item) => {
              const qtyNum = parseQuantityNumber(item.quantity);   
              const basePriceNum = parsePriceNumber(
                item.basePrice ?? data.totalProductPrice
              ); 
             
              return {
                id: item.cartItemId,
                cartItemId: item.cartItemId,
                name: item.dishName,
                price: basePriceNum,
                qty: qtyNum,
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
    
    // 장바구니에서 넘어온 deliveryFee가 있다면 (state 유실 방지)
    if (state?.deliveryFee != null) {
        setDeliveryFee(parsePriceNumber(state.deliveryFee));
    }

}, [cartItemId, state]);


  const formatPrice = (n) => n.toLocaleString("ko-KR");

  const productsTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems]
  );

  const finalTotal = productsTotal + deliveryFee;

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

    const handlePay = async () => {
      if (!shipping.address) {
        alert("배송지 정보가 유효하지 않습니다.");
        return;
      }
    
      const cartItemIds = selectedItems.map((item) => item.cartItemId);
      const merchantUid = `ORD_${new Date().getTime()}`;
      const merchantId = "imp36122872";
      const pgChannel = "html5_inicis.INIpayTest";
      const orderName =
        selectedItems[0]?.name +
        (selectedItems.length > 1 ? ` 외 ${selectedItems.length - 1}개` : "");
    
      const payParams = {
        pg: pgChannel,
        pay_method: "card",
        merchant_uid: merchantUid,
        name: orderName,
        amount: finalTotal,
        buyer_email: "test@meal.co.kr",
        buyer_name: shipping.name,
        buyer_tel: shipping.phone,
        buyer_addr: shipping.address,
        m_redirect_url: window.location.origin + "/ordercomplete",
      };
    
      const { IMP } = window;
      if (!IMP) {
        alert("결제 모듈 (아임포트) 로딩에 실패했습니다.");
        return;
      }
    
      IMP.init(merchantId);
    
      IMP.request_pay(payParams, async function (rsp) {
        if (rsp.success) {
          const completeData = {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            cartItemIds: cartItemIds,
            paymentType: getPaymentType(selectedMethod),
          };
    
          try {
            // 🔹 1) 정상 플로우: 백엔드 검증 + 주문 생성
            const finalOrderId = await paymentService.completePayment(completeData);
            const completeRes = await orderService.getOrderComplete(finalOrderId);
    
            const parsePriceNumber = (priceStr) => {
              if (!priceStr) return 0;
              if (typeof priceStr === "number") return priceStr;
              const numeric = String(priceStr).replace(/[^0-9]/g, "");
              return Number(numeric) || 0;
            };
    
            const parseQuantityNumber = (qtyStr) => {
              if (!qtyStr) return 1;
              if (typeof qtyStr === "number") return qtyStr;
              const numeric = String(qtyStr).replace(/[^0-9]/g, "");
              return Number(numeric) || 1;
            };
    
            const orderForView = {
              orderNumber: completeRes.orderNumber,
              paidAt: completeRes.orderDate,
              items: (completeRes.items || []).map((item, idx) => ({
                id: idx + 1,
                name: item.dishName,
                optionsSummary: item.optionDescription,
                price: parsePriceNumber(item.price),
                qty: parseQuantityNumber(item.count),
                imageUrl: item.imageUrl,
              })),
              deliveryFee: parsePriceNumber(completeRes.shippingFee),
              shipping: {
                name: completeRes.receiverName,
                phone: completeRes.receiverPhone,
                address: completeRes.address,
              },
              totalPrice: parsePriceNumber(completeRes.totalAmount),
            };
    
            navigate("/ordercomplete", {
              state: { order: orderForView },
            });
          } catch (error) {
            console.error("결제 검증 및 주문 생성 실패 (백엔드 오류, fallback 사용):", error);
    
            // 🔹 2) 실패 플로우: 프론트 상태만으로 주문완료 화면 구성 (임시)
            const now = new Date();
            const paidAt = `${now.getFullYear()}-${String(
              now.getMonth() + 1
            ).padStart(2, "0")}-${String(now.getDate()).padStart(
              2,
              "0"
            )} ${String(now.getHours()).padStart(2, "0")}:${String(
              now.getMinutes()
            ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    
            const orderForViewFallback = {
              orderNumber: merchantUid,           // 임시로 PG 주문번호 사용
              paidAt,                             // 현재 시간
              items: selectedItems.map((item, idx) => ({
                id: idx + 1,
                name: item.name,
                optionsSummary: item.optionsSummary,
                price: item.price,
                qty: item.qty,
              })),
              deliveryFee,
              shipping: {
                ...shipping,
              },
              totalPrice: finalTotal,
            };
    
            // ❗ 사용자에게 에러 알림 없이 그냥 주문완료 페이지로 이동
            navigate("/ordercomplete", {
              state: { order: orderForViewFallback },
            });
          }
        } else {
          alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
        }
      });
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
