import React from 'react';
import './App.css';

function App() {
  const morning = '아침';
  const lunch = '점심';
  const evening = '저녁';

  const handleClick = () => {
    alert('오늘도 해냈다아 💪');
  };

  return (
    <div className="container">
      <h1 className="title">Jiwon's Daily Routine</h1>

      {/* ✅ 아침 루틴 */}
      <div className="card">
        <h2>{morning} | 08:00</h2>
        <h3>🧃 독서하기</h3>
        <p>종이책 / 밀리의서재</p>
      </div>

      {/* ✅ 점심 루틴 (조건부 메시지 포함) */}
      <div className="card">
        <h2>{lunch} | 12:30</h2>
        <h3>🏖️ 점심 약속 !</h3>
        <p>성수에서 만나기</p>
        <p className="highlight">⭐ 점심은 일반식 먹어도 괜찮움</p> {/* 조건부 렌더링처럼 강조 문구 */}
      </div>

      {/* ✅ 저녁 루틴 */}
      <div className="card">
        <h2>{evening} | 20:00</h2>
        <h3>💊 홈트</h3>
        <p>다리 옆구리 팔 유산소</p>
      </div>

      {/* ✅ 버튼 이벤트 처리 */}
      <button className="btn" onClick={handleClick}>
        오늘 루틴 응원하기 💪
      </button>
    </div>
  );
}

export default App;
