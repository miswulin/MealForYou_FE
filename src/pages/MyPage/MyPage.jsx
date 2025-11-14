import profileIcon from "../../assets/profile.svg";
import arrow from "../../assets/right_arrow.svg";
import styles from "../MyPage/MyPage.module.css";
export default function MyPage() {
  return (
    <main>
      {/* 추후 헤더추가 */}
      <header></header>
      <section>
        <div className={styles.profile}>
          <img src={profileIcon} alt="Profile Icon" />
          <h3>김멋사</h3>
          <p>likelion13th@swu.ac.kr</p>
        </div>
        <div className={styles.userSettings}>
          <p>회원정보 수정</p>
          <p>비밀 번호 변경</p>
          <p>배송지 관리</p>
        </div>
        <hr className={styles.hr1} />
        <div className={styles.container}>
          <h3>선호 식단 유형 수정</h3>
          <img src={arrow} alt="arrow Icon" style={{ cursor: "pointer" }} />
        </div>
        <hr className={styles.hr1} />

        <div className={styles.container}>
          <h3>주문내역</h3>
          <img src={arrow} alt="arrow Icon" style={{ cursor: "pointer" }} />
        </div>
        <hr />
        <div className={styles.wrapper}>
          <div className={styles.textWrapper}>
            <h5>25.00.00</h5>
            <h5 className={styles.orderStatus}>주문완료</h5>
          </div>
          <div className={styles.item}>
            <div className={styles.imgBox} />
            <div className={styles.textBox}>
              <div>
                <p>밀키트 메뉴 이름</p>
                <p className={styles.quantity}>1개</p>
              </div>
              <p className={styles.option}>
                옵션1(100g) 1개, 옵션2(00g)1개, 옵션3(00g)1개,
              </p>
              <p className={styles.price}>00,000원</p>
            </div>
          </div>
          {/* 주문 상태 표시 */}
          <div className={styles.statusContainer}>
            <div className={`${styles.step} ${styles.active}`}>
              <div className={styles.bar}></div>
              <span className={styles.label}>주문완료</span>
            </div>

            <div className={styles.step}>
              <div className={styles.bar}></div>
              <span className={styles.label}>배송중</span>
            </div>

            <div className={styles.step}>
              <div className={styles.bar}></div>
              <span className={styles.label}>배송완료</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
