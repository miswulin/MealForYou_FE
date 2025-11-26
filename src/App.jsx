import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyPage from "../src/pages/MyPage/MyPage.jsx";
import EditInfo from "../src/pages/MyPage/EditInfo.jsx";
import EditPassword from "../src/pages/MyPage/EditPassword.jsx";
import EditAddress from "../src/pages/MyPage/EditAddress.jsx";
import Wishlist from "../src/pages/Wishlist/Wishlist.jsx";
import Pd from "./pages/Productdetail/pd.jsx"
import OnboardingTestPage from './pages/OnboardingTest/OnboardingTestPage';
import Cart from "./pages/Cart/Cart.jsx";
import Order from "./pages/Order/Order.jsx";
import OrderComplete from "./pages/Order/OrderComplete.jsx";

import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import FindPasswordPage from './pages/Login/FindPasswordPage';
import HomePage from './pages/Home/HomePage';
import SearchResultsPage from './pages/Search/SearchResultsPage';
import MenuListPage from './pages/MenuList/MenuListPage';

function App() {
  return (
  
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/editinfo" element={<EditInfo />} />
        <Route path="/editpassword" element={<EditPassword />} />
        <Route path="/editaddress" element={<EditAddress />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/product-detail" element={<Pd />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/ordercomplete" element={<OrderComplete />} />
        <Route path="/onboarding-test" element={<OnboardingTestPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/menu-list" element={<MenuListPage />} />
      </Routes>
   
  );
}

export default App;
