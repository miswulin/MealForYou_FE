import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../MyPage/EditAddress.module.css";
import Header from "../../components/Header";
import { memberInfo } from "../../api/member";

// 도로명주소 API 로더
const loadDaumPostcodeScript = () => {
  return new Promise((resolve, reject) => {
    if (window.daum && window.daum.Postcode) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Daum Postcode script"));
    document.head.appendChild(script);
  });
};

export default function EditAddress() {
  const navigate = useNavigate();

  // 상단 표시 회원정보
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    postcode: "",
    roadAddress: "",
    detailAddress: "",
  });

  // 기존 주소
  const [originalAddress, setOriginalAddress] = useState({
    postcode: "",
    roadAddress: "",
    detailAddress: "",
    extraAddress: "",
  });

  // 폼에서 수정중인 주소
  const [address, setAddress] = useState({
    postcode: "",
    roadAddress: "",
    detailAddress: "",
    extraAddress: "",
  });

  // 회원 정보 불러오기
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await memberInfo.getMyInfo();

        // 이름
        const name = data.name || "";

        // 전화번호 +82 처리
        let phoneRaw = data.phone || "";
        if (phoneRaw.startsWith("+82")) {
          phoneRaw = "0" + phoneRaw.slice(3);
        }
        const digits = phoneRaw.replace(/\D/g, "");
        const formattedPhone = `${digits.slice(0, 3)}-${digits.slice(
          3,
          7
        )}-${digits.slice(7, 11)}`;

        // 주소
        const fetchedAddress = {
          postcode: data.address?.zipCode || "",
          roadAddress: data.address?.roadAddress || "",
          detailAddress: data.address?.detailAddress || "",
          extraAddress: "",
        };

        setUserData({
          name,
          phone: formattedPhone,
          postcode: fetchedAddress.postcode,
          roadAddress: fetchedAddress.roadAddress,
          detailAddress: fetchedAddress.detailAddress,
        });

        setAddress(fetchedAddress);
        setOriginalAddress(fetchedAddress);
      } catch (error) {
        console.error(error);
        alert("회원정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchInfo();
    loadDaumPostcodeScript();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 우편번호 검색
  const handleSearchPostcode = () => {
    loadDaumPostcodeScript().then(() => {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let fullAddress = data.address;
          let extra = "";

          if (data.addressType === "R") {
            if (data.bname) extra += data.bname;
            if (data.buildingName)
              extra += extra ? `, ${data.buildingName}` : data.buildingName;

            fullAddress += extra ? ` (${extra})` : "";
          }

          setAddress((prev) => ({
            ...prev,
            postcode: data.zonecode,
            roadAddress: fullAddress,
            extraAddress: extra,
          }));

          document.getElementById("newDetailAddress")?.focus();
        },
      }).open();
    });
  };

  // 버튼 활성화 여부
  const isAddressFilled =
    address.postcode && address.roadAddress && address.detailAddress;

  const isAddressChanged =
    originalAddress &&
    (originalAddress.postcode !== address.postcode ||
      originalAddress.roadAddress !== address.roadAddress ||
      originalAddress.detailAddress !== address.detailAddress);

  const isDisabled = !isAddressFilled || !isAddressChanged;

  // 주소 수정 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    try {
      await memberInfo.updateMyAddress({
        zipCode: address.postcode,
        roadAddress: address.roadAddress,
        detailAddress: address.detailAddress,
      });

      alert("주소가 성공적으로 수정되었습니다!");

      // 상단 표시 주소 업데이트
      setUserData((prev) => ({
        ...prev,
        postcode: address.postcode,
        roadAddress: address.roadAddress,
        detailAddress: address.detailAddress,
      }));

      setOriginalAddress(address);
    } catch (error) {
      console.error(error);
      alert("주소 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <main>
      {/* 헤더 */}
      <Header
        title="배송지 관리"
        onBack={() => navigate(-1)}
        showHeart={false}
        showCart={false}
        showPerson={false}
      />

      {/* 현재 주소정보 */}
      <section className={styles.section1}>
        <div className={styles.textwrapper}>
          <span className={styles.name}>{userData.name}</span>
          <span className={styles.badge}>기본주소</span>
        </div>
        <p className={styles.address}>
          {originalAddress.postcode && `[${originalAddress.postcode}] `}
          {originalAddress.roadAddress} {originalAddress.detailAddress}
        </p>
        <p className={styles.phone}>{userData.phone}0</p>
      </section>
      <hr />

      {/* 새로운 주소 입력 */}
      <section className={styles.newAddress}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.sectionTitle}>새로운 주소</p>

          {/* 우편번호 + 버튼 */}
          <div className={styles.zipRow}>
            <input
              type="text"
              placeholder="우편번호"
              className={styles.input}
              value={address.postcode}
              readOnly
            />
            <button
              type="button" // 폼 submit 막기
              className={styles.zipBtn}
              onClick={handleSearchPostcode}
            >
              우편번호 찾기
            </button>
          </div>

          {/* 도로명 주소 */}
          <input
            type="text"
            placeholder="도로명 주소"
            className={styles.input}
            name="roadAddress"
            value={address.roadAddress}
            readOnly // 필요하면 직접 수정 가능하게 바꾸려면 readOnly 제거
          />

          {/* 상세주소 + 참고항목 */}
          <div className={styles.zipRow}>
            <input
              id="newDetailAddress"
              name="detailAddress"
              type="text"
              placeholder="상세주소"
              className={styles.input}
              value={address.detailAddress}
              onChange={handleAddressChange}
            />
            <input
              name="extraAddress"
              type="text"
              placeholder="참고항목"
              className={styles.input}
              value={address.extraAddress}
              onChange={handleAddressChange}
            />
          </div>

          <button
            type="submit"
            className={styles.editbtn}
            disabled={isDisabled}
          >
            수정하기
          </button>
        </form>
      </section>
    </main>
  );
}
