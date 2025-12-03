import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyPage from "../src/pages/MyPage/MyPage.jsx";
import EditInfo from "../src/pages/MyPage/EditInfo.jsx";
import EditPassword from "../src/pages/MyPage/EditPassword.jsx";
import EditAddress from "../src/pages/MyPage/EditAddress.jsx";
import Wishlist from "../src/pages/Wishlist/Wishlist.jsx";
import Pd from "./pages/Productdetail/pd.jsx";
import OnboardingTestPage from "./pages/OnboardingTest/OnboardingTestPage";
import Cart from "./pages/Cart/Cart.jsx";
import Order from "./pages/Order/Order.jsx";
import OrderComplete from "./pages/Order/OrderComplete.jsx";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import FindPasswordPage from "./pages/Login/FindPasswordPage";
import HomePage from "./pages/Home/HomePage";
import SearchResultsPage from "./pages/Search/SearchResultsPage";
import MenuListPage from "./pages/MenuList/MenuListPage";
import OrderHistory from "./pages/MyPage/OrderHistory.jsx";
import EditPreference from "./pages/MyPage/EditPreference.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; //로그인 필요 페이지 보호 라우터

function App() {
  return (
    <Routes>
      {/* 로그인 필요한 페이지들 */}
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/mypage" element={<MyPage />} /> */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/editinfo" element={<EditInfo />} />
      <Route path="/editpassword" element={<EditPassword />} />
      <Route path="/editaddress" element={<EditAddress />} />
      {/* <Route path="/wishlist" element={<Wishlist />} /> */}
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

//       <Route path="/product-detail" element={<Pd />} />
      <Route path="/product-detail/:dishId" element={<Pd />} />
      <Route path="/order" element={<Order />} />
      <Route path="/order/:cartItemId" element={<Order />} />
      <Route path="/ordercomplete" element={<OrderComplete />} />
      <Route path="/onboarding-test" element={<OnboardingTestPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />
      <Route path="/menu-list" element={<MenuListPage />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/editpreference" element={<EditPreference />} />
    </Routes>
  );
}

export default App;
