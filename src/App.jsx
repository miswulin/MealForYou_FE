import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyPage from "../src/pages/MyPage/MyPage.jsx";
import EditInfo from "../src/pages/MyPage/EditInfo.jsx";
import EditPassword from "../src/pages/MyPage/EditPassword.jsx";
import EditAddress from "../src/pages/MyPage/EditAddress.jsx";
import Wishlist from "../src/pages/Wishlist/Wishlist.jsx";
import Pd from "./pages/Productdetail/pd.jsx"
import Cart from "./pages/Cart/Cart.jsx";

function App() {
  return (
  
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/editinfo" element={<EditInfo />} />
        <Route path="/editpassword" element={<EditPassword />} />
        <Route path="/editaddress" element={<EditAddress />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/" element={<Pd />} />
        <Route path="/product-detail" element={<Pd />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
   
  );
}

export default App;
