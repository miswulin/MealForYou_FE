import React from "react";
import "./BottomSheet.css";

export default function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`bs-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* 시트 본체 */}
      <div className={`bs-container ${isOpen ? "open" : ""}`}>
        <div className="bs-handle" />
        <div className="bs-content">{children}</div>
      </div>
    </>
  );
}
