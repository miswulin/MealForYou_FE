import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../api/auth"; 

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // 로컬스토리지 기반 로그인 여부
  const isLoggedIn = authService.isAuthenticated();
 
  if (!isLoggedIn) {
    // 비로그인 시 로그인 페이지로 보내기
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
}
