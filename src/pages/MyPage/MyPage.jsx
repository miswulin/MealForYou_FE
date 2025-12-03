import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/right_arrow.svg";
import styles from "../MyPage/MyPage.module.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { memberInfo } from "../../api/member";
import { orderService } from "../../api/order";
import { authService } from "../../api/auth";

export default function MyPage() {
  const navigate = useNavigate();

  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [orderHistory, setOrderHistory] = useState([]);

  //모달창
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLogoutDone, setShowLogoutDone] = useState(false);
  const [showDeleteDone, setShowDeleteDone] = useState(false);

  // 회원 정보 조회
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await memberInfo.getMyInfo();
        setProfile({
          name: data.name,
          email: data.email,
        });
        const orders = await orderService.getOrderHistory();
        setOrderHistory(orders || []);
      } catch (error) {
        console.error("마이페이지 회원 정보 조회 실패:", error);
      }
    };

    fetchMyInfo();
  }, []);

  const latestOrder = orderHistory[0];

  const statusLabelMap = {
    ORDERED: "주문완료",
    SHIPPING: "배송중",
    DELIVERED: "배송완료",
  };

  const statusStepIndexMap = {
    ORDERED: 0,
    SHIPPING: 1,
    DELIVERED: 2,
  };

  const currentStepIndex =
    latestOrder && statusStepIndexMap[latestOrder.status] !== undefined
      ? statusStepIndexMap[latestOrder.status]
      : 0;

  //로그아웃 함수
  const handleLogoutConfirm = () => {
    authService.logout(); //토큰/유저 삭제
    setShowLogout(false); //로그아웃 모달 없애고
    setShowLogoutDone(true); //로그아웃 완료 창 뜨도록
  };

  //회원탈퇴 함수
  const handleDeleteConfirm = () => {
    setShowDelete(false); //회원탈퇴 모달 없애고
    setShowDeleteDone(true); //회원탈퇴 완료 창 뜨도록
  };

  // 완료 모달 3초 뒤 자동 닫기
  useEffect(() => {
    if (showLogoutDone) {
      const timer = setTimeout(() => {
        setShowLogoutDone(false);
        // 3초 뒤 로그인 화면으로 이동
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutDone]);

  useEffect(() => {
    if (showDeleteDone) {
      const timer = setTimeout(() => {
        setShowDeleteDone(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showDeleteDone]);

  return (
    <main className={styles.page}>
      {/* 헤더*/}
      <Header
        title="마이페이지"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
        className={styles.header}
      />
      <section className={styles.section}>
        <div className={styles.profile}>
          <img src={profileIcon} alt="Profile Icon" />
          <h3>{profile.name}</h3>
          <p className={styles.email}>{profile.email}</p>
        </div>
        {/* 각 페이지로 이동 */}
        <div className={styles.userSettings}>
          <p onClick={() => navigate("/editinfo")}>회원정보 수정</p>
          <p onClick={() => navigate("/editpassword")}>비밀번호 변경</p>
          <p onClick={() => navigate("/editaddress")}>배송지 관리</p>
        </div>
        <hr className={styles.hr} />
        <div className={styles.container}>
          <h3>선호 식단 유형 수정</h3>
          <img
            src={arrow}
            alt="arrow Icon"
            onClick={() => navigate("/onboarding-test")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <hr className={styles.hr} />
        <div className={styles.container}>
          <h3>주문내역</h3>
          <img
            src={arrow}
            alt="arrow Icon"
            onClick={() => navigate("/order-history")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <hr className={styles.hr2} />
        {/* 최근 주문내역 */}
        {latestOrder ? (
          <div className={styles.wrapper}>
            <div className={styles.textWrapper}>
              <h5 className={styles.orderDate}>{latestOrder.shortDate}</h5>
              <h5 className={styles.orderStatus}>
                {statusLabelMap[latestOrder.status] || "주문완료"}
              </h5>
            </div>
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className={styles.item}>
                <div
                  className={styles.imgBox}
                  style={{
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className={styles.textBox}>
                  <div>
                    <p>{item.dishName}</p>
                    <p className={styles.quantity}>{item.count}개</p>
                  </div>
                  <p className={styles.option}>{item.optionDescription}</p>
                  <p className={styles.price}>{item.price}원</p>
                </div>
              </div>
            ))}
            <hr className={styles.hr} />

            {/* 주문 상태 표시 */}
            <div className={styles.statusContainer}>
              <div
                className={`${styles.step} ${
                  currentStepIndex >= 0 ? styles.active : ""
                }`}
              >
                <div className={styles.bar}></div>
                <span className={styles.label}>주문완료</span>
              </div>

              <div
                className={`${styles.step} ${
                  currentStepIndex >= 1 ? styles.active : ""
                }`}
              >
                <div className={styles.bar}></div>
                <span className={styles.label}>배송중</span>
              </div>

              <div
                className={`${styles.step} ${
                  currentStepIndex >= 2 ? styles.active : ""
                }`}
              >
                <div className={styles.bar}></div>
                <span className={styles.label}>배송완료</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.wrapper}>
            <p className={styles.emptyOrderText}>최근 주문 내역이 없습니다.</p>
          </div>
        )}
        <hr className={styles.hr} />
        {/* 로그아웃, 회원탈퇴 */}
        <div>
          <div className={styles.btnWrapper}>
            <p onClick={() => setShowLogout(true)}>로그아웃</p>
            <p onClick={() => setShowDelete(true)}>회원탈퇴</p>
          </div>

          {/* 로그아웃 모달 */}
          {showLogout && (
            <div className={styles.modal}>
              <div className={styles.modalBox}>
                <h2 className={styles.title}>로그아웃</h2>
                <p className={styles.text}>로그아웃을 계속 하시겠습니까?</p>
                <div className={styles.btnBox}>
                  <button
                    className={styles.cancel}
                    onClick={() => setShowLogout(false)}
                  >
                    취소
                  </button>
                  <button
                    className={styles.confirm}
                    onClick={handleLogoutConfirm}
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* 로그아웃 완료 모달 */}
          {showLogoutDone && (
            <div className={styles.modal}>
              <div className={styles.modalBox}>
                <h2 className={styles.title}>로그아웃 완료</h2>
                <p className={styles.text}>로그아웃이 완료되었습니다.</p>
              </div>
            </div>
          )}
          {/* 회원탈퇴 모달 */}
          {showDelete && (
            <div className={styles.modal}>
              <div className={styles.modalBox}>
                <h2 className={styles.title}>회원탈퇴</h2>
                <p className={styles.text}>회원탈퇴를 계속 하시겠습니까?</p>
                <div className={styles.btnBox}>
                  <button
                    className={styles.cancel}
                    onClick={() => setShowDelete(false)}
                  >
                    취소
                  </button>
                  <button
                    className={styles.confirm}
                    onClick={handleDeleteConfirm}
                  >
                    회원탈퇴
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* 로그아웃 완료 모달 */}
          {showDeleteDone && (
            <div className={styles.modal}>
              <div className={styles.modalBox}>
                <h2 className={styles.title}>탈퇴 완료</h2>
                <p className={styles.text}>
                  회원탈퇴가 완료되었습니다. <br />
                  그동안 밀포유를 사용해주셔서 감사합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
