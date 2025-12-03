import styles from "../MyPage/OrderHistory.module.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../api/order";

const dummyOrders = [
  {
    orderId: 4,
    orderNumber: "479255373180",
    orderDate: "2025-11-23 21:29:34",
    shortDate: "25.11.23",
    status: "ORDERED",
    receiverName: "김슈니",
    receiverPhone: "010-0000-0000",
    address: "(01797) 서울 노원구 화랑로 621, 50주년기념관 306호",
    items: [
      {
        dishName: "돼지고기 김치찌개",
        optionDescription: "기본 야채 (2개), 돼지 고기 (200g) (2개)",
        price: "10,000원",
        count: "1개",
        imageUrl: "/images/a_main.jpg",
      },
      {
        dishName: "소고기 버섯전골",
        optionDescription: "돼지 고기 (200g) (1개), 소 고기 (200g) (2개)",
        price: "16,000원",
        count: "1개",
        imageUrl: "/images/b_main.jpg",
      },
    ],
    totalProductPrice: "26,000원",
    shippingFee: "2,500원",
    totalAmount: "28,500원",
  },
  {
    orderId: 3,
    orderNumber: "033977843912",
    orderDate: "2025-11-23 21:15:39",
    shortDate: "25.11.23",
    status: "DELIVERED",
    receiverName: "김슈니",
    receiverPhone: "010-0000-0000",
    address: "(01797) 서울 노원구 화랑로 621, 50주년기념관 306호",
    items: [
      {
        dishName: "소고기 버섯전골",
        optionDescription: "기본 야채 (1개), 소 고기 (200g) (2개)",
        price: "13,000원",
        count: "1개",
        imageUrl: "/images/b_main.jpg",
      },
    ],
    totalProductPrice: "13,000원",
    shippingFee: "2,500원",
    totalAmount: "15,500원",
  },
];

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await orderService.getOrderHistory();
      setOrders(data?.length ? data : dummyOrders);
      //응답이 빌 경우 더미데이터 사용
    };
    fetchOrders();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "ORDERED":
        return "주문완료";
      case "DELIVERING":
        return "배송중";
      case "DELIVERED":
        return "배송완료";
      default:
        return "주문상태";
    }
  };

  return (
    <main>
      {/* 헤더 */}
      <Header
        title="주문 내역"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <section className={styles.section}>
        {orders.map((order, idx) => (
          <React.Fragment key={order.orderId}>
            <div className={styles.wrapper}>
              <div className={styles.textWrapper}>
                <h5 className={styles.orderDate}>{order.shortDate}</h5>
                <h5 className={styles.orderNum}>{order.orderNumber}</h5>
              </div>

              <div className={styles.listBox}>
                {/* 상태 텍스트 */}
                <h5
                  className={
                    order.status === "DELIVERED"
                      ? styles.deliveryStatus
                      : styles.orderStatus
                  }
                >
                  {order.status === "ORDERED"
                    ? "주문완료"
                    : order.status === "DELIVERING"
                    ? "배송중"
                    : "배송완료"}
                </h5>

                {/* 상품 목록 */}
                <div className={styles.itemBox}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.item}>
                      <div
                        className={styles.imgBox}
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      ></div>

                      <div className={styles.textBox}>
                        <div>
                          <p>{item.dishName}</p>
                          <p className={styles.quantity}>{item.count}</p>
                        </div>

                        <p className={styles.option}>
                          {item.optionDescription}
                        </p>
                        <p className={styles.price}>{item.price}</p>
                      </div>
                    </div>
                  ))}

                  {/* 배송완료일 때만 추가 버튼 */}
                  {order.status === "DELIVERED" && (
                    <div className={styles.reorder}>
                      <p>문의하기</p>
                      <p className={styles.line}>|</p>
                      <p>재주문하기</p>
                    </div>
                  )}
                </div>

                {/* ORDERED / DELIVERING 상태일 때만 상태바 */}
                {(order.status === "ORDERED" ||
                  order.status === "DELIVERING") && (
                  <div className={styles.statusContainer}>
                    <div className={`${styles.step} ${styles.active}`}>
                      <div className={styles.bar}></div>
                      <span className={styles.label}>주문완료</span>
                    </div>

                    <div
                      className={`${styles.step} ${
                        order.status === "DELIVERING" ? styles.active : ""
                      }`}
                    >
                      <div className={styles.bar}></div>
                      <span className={styles.label}>배송중</span>
                    </div>

                    <div className={styles.step}>
                      <div className={styles.bar}></div>
                      <span className={styles.label}>배송완료</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {idx !== orders.length - 1 && <hr className={styles.hr} />}
          </React.Fragment>
        ))}
      </section>
    </main>
  );
}
