import React, { useRef, useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const spinAudio = new Audio("../../public/spin.mp3");
type Color = { r: number; g: number; b: number };
type ItemDegs = { [key: string]: { startDeg: number; endDeg: number } };

interface WheelProps {
  items: string[];
  setWinner: (winner: string) => void;
  wheelSize?: number;
  spinDuration?: number;
  spinSpeed?: number;
}

const randomColor = (): Color => {
  const r = Math.floor(Math.random() * 100) + 120;
  const g = Math.floor(Math.random() * 100) + 120;
  const b = Math.floor(Math.random() * 100) + 120;
  return { r, g, b };
};

const Wheel: React.FC<WheelProps> = ({
  items,
  setWinner,
  wheelSize = 500,
  spinDuration = 5000,
  spinSpeed = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const confettiRef = useRef<any>(null);

  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = wheelSize / 2;
  const step = 360 / items.length;
  const colors = items.map(() => randomColor());
  const [itemDegs, setItemDegs] = useState<ItemDegs>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setLocalWinner] = useState<string | null>(null);
  const [isStop, setIsStop] = useState(false);

  const currentDeg = useRef(0);
  const speed = useRef(0);
  const maxRotation = useRef(0);
  const pause = useRef(false);

  const toRad = (deg: number): number => deg * (Math.PI / 180);

  const easeOutSine = (x: number): number => Math.sin((x * Math.PI) / 2);

  const getPercent = (input: number, min: number, max: number): number =>
    ((input - min) * 100) / (max - min) / 100;

  const drawWheel = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, wheelSize, wheelSize);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#888";
    ctx.fill();

    let startDeg = currentDeg.current;
    const newItemDegs: ItemDegs = {};

    items.forEach((item, i) => {
      const endDeg = startDeg + step;
      const color = colors[i];
      const colorStyle = `rgb(${color.r},${color.g},${color.b})`;

      // Draw outer segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
      ctx.fillStyle = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw inner segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
      ctx.fillStyle = colorStyle;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(toRad((startDeg + endDeg) / 2));
      ctx.textAlign = "center";
      ctx.fillStyle =
        color.r > 150 || color.g > 150 || color.b > 150 ? "#000" : "#fff";
      ctx.font = "bold 16px serif";
      ctx.fillText(item, radius * 0.5, 10); // Adjust text position based on radius
      ctx.restore();

      newItemDegs[item] = { startDeg, endDeg };

      // Check winner
      if (
        startDeg % 360 < 360 &&
        startDeg % 360 > 270 &&
        endDeg % 360 > 0 &&
        endDeg % 360 < 90
      ) {
        setLocalWinner(item);
        setWinner(item);
      }

      startDeg += step;
    });

    setItemDegs(newItemDegs);
  };

  const animate = () => {
    if (pause.current) return;

    speed.current =
      easeOutSine(getPercent(currentDeg.current, maxRotation.current, 0)) *
      spinSpeed;
    if (speed.current < 0.01) {
      speed.current = 0;
      pause.current = true;
      setIsSpinning(false);
    }
    currentDeg.current += speed.current;
    drawWheel(canvasRef.current!.getContext("2d")!);
    requestAnimationFrame(animate);
  };

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    // Pick a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const itemDeg = itemDegs[randomItem];

    if (itemDeg) {
      // Calculate the target degree to stop at the random item
      const targetDeg = 360 - itemDeg.startDeg + 270; // Adjust to stop at the desired item
      maxRotation.current = (360 * spinDuration) / 1000 + targetDeg; // Add targetDeg to ensure it stops at the random item
    }

    spinAudio.play();
    setIsSpinning(true);
    setLocalWinner(null);
    currentDeg.current = 0;
    pause.current = false;
    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) drawWheel(ctx);
    }
  }, [items]);

  useEffect(() => {
    if (!isSpinning && winner) {
      setIsStop(true);
      spinAudio.pause();
    }
  }, [isSpinning, winner]);

  return (
    <div className="flex justify-center relative">
      <div className="w-fit relative">
        <canvas ref={canvasRef} width={wheelSize} height={wheelSize}></canvas>
        <div className="triangle"></div>
        <div
          className={`center-circle ${
            isSpinning || isStop ? "pointer-events-none" : "pointer-events-auto"
          }`}
          onClick={spin} // No need to pass any argument, it will stop randomly
        ></div>

        {isStop ? (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="">
              <div className="title bg-white p-4 text-center rounded">
                <span className="mb-2 flex items-center justify-center gap-2">
                  <span> الف مبروك</span>
                  <img src="icon.svg" width={"50"} alt="" />
                </span>
                <h2 className="text-5xl  mb-1">
                  <span>لقد فزت معنا ب </span>
                  <span>{winner}</span>
                </h2>
                <span className="mb-2 inline-block">
                  سيتم التواصل معك عبر الهاتف المحمول
                </span>
                <p className="text-3xl">ايه ي قصير😜😜</p>
              </div>
              <Fireworks autorun={{ speed: 3 }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Wheel;
