<<<<<<< HEAD
<<<<<<< HEAD
import Pd from "./pages/Productdetail/pd";
import "./App.css";

function App() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Pd />
    </div>
=======
import { useState } from 'react'
import './App.css'

=======
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MyPage from "../src/pages/MyPage/MyPage.jsx";
import EditInfo from "../src/pages/MyPage/EditInfo.jsx";
import EditPassword from "../src/pages/MyPage/EditPassword.jsx";
import EditAddress from "../src/pages/MyPage/EditAddress.jsx";
import Wishlist from "../src/pages/Wishlist/Wishlist.jsx";
>>>>>>> 5bf09a5906fe6d2795fdb52bf36d07f34af9c4c8
function App() {
  return (
<<<<<<< HEAD
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
>>>>>>> 31763bf6fa25fb586b4e19f446c5b5624aacf1b1
  )
=======
    <Router>
      <Routes>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/editinfo" element={<EditInfo />} />
        <Route path="/editpassword" element={<EditPassword />} />
        <Route path="/editaddress" element={<EditAddress />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
>>>>>>> 5bf09a5906fe6d2795fdb52bf36d07f34af9c4c8
}

export default App;
