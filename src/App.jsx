import { useState } from "react";
import { BrowserRouter  as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyPage from "../src/pages/MyPage/MyPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
