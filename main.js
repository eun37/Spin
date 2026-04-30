

const canvas = document.getElementById("rouletteCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

const candidates = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];
const colors = [
  "#FF6B6B",
  "#FF9E2C",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B59B6",
  "#34495E",
  "#16A085",
  "#27AE60",
  "#2980B9",
  "#8E44AD",
  "#F1C40F",
  "#E67E22",
  "#E74C3C",
];

const numSectors = candidates.length;
const arc = (2 * Math.PI) / numSectors;
let currentRotation = 0;

// 1. 돌림판 그리기
function drawRoulette() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  candidates.forEach((name, i) => {
    const angle = i * arc;

    // 구역 그리기
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, angle, angle + arc);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 숫자 그리기
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(name, 230, 10);
    ctx.restore();
  });
}

// 2. 회전 로직
function spin() {
  spinBtn.disabled = true;

  // 무작위 회전 각도 (최소 5바퀴 이상)
  const randomSpin = Math.floor(Math.random() * 360) + 1800;
  const finalRotation = currentRotation + randomSpin;
  const duration = 4000; // 4초
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out 효과
    const easeOut = 1 - Math.pow(1 - progress, 4);
    const currentAngle = currentRotation + randomSpin * easeOut;

    canvas.style.transform = `rotate(${currentAngle}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      currentRotation = currentAngle; // 마지막 각도 저장
      calculateResult(currentRotation);
      spinBtn.disabled = false;
    }
  }
  requestAnimationFrame(animate);
}

// 3. 결과 계산 (12시 방향 화살표 기준)
function calculateResult(rotation) {
  // 캔버스 자체의 회전각을 360도로 나눈 나머지 계산
  const actualRotation = rotation % 360;

  // 화살표가 12시(270도 지점)에 있으므로, 각도를 보정하여 인덱스 찾기
  // 룰렛이 시계방향으로 돌면 데이터 인덱스는 반시계 방향으로 계산됨
  const segmentAngle = 360 / numSectors;
  const offset = 270; // 12시 방향 기준점
  const resultIndex = Math.floor(
    ((offset - actualRotation + 360 * 100) % 360) / segmentAngle,
  );

  alert(`${candidates[resultIndex]}번 당첨`);
}

drawRoulette();
spinBtn.addEventListener("click", spin);
