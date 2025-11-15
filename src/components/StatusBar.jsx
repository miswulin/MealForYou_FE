import React from "react";
import "./StatusBar.css";
import cellular from "../assets/images/cellular.png"
import wifi from "../assets/images/wifi.png"
import battery from "../assets/images/battery.png"

export default function StatusBar({
  time = "9:41",
  rightContent,
}) {
  return (
    <div className="status-bar">
      <span className="status-time">{time}</span>
      <div className="status-icons">
        <img src={cellular} alt="셀룰러" className="status-icon-c" />
        <img src={wifi} alt="와이파이" className="status-icon-w" />
        <img src={battery} alt="배터리" className="status-icon-b" />
      </div>
    </div>
  );
}