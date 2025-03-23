import { useState } from "react";
import "./App.css";
import Wheel from "./Components/Wheel";

function App() {
  const [items] = useState([
    "200",
    "400",
    "600",
    "800",
    "1000",
    "1200",
    "1400",
    "صفر بصوت هنيدي",
  ]);
  const [winner, setWinner] = useState<null | string>(null);

  console.log(winner, items);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center cairo-play">
      <div className="">
        <div className="">
          <h1 className="text-4xl text-center font-bold mb-4 flex items-center justify-center ">
            <span>عـيدية</span>
            <img src="text-logo.png" className="max-w-40" alt="" />
          </h1>
          {/* <p className="text-center mb-2">شـاركنا بياناتك وادخل السحب على 10 ايفونات</p> */}
        </div>

        <Wheel
          items={items}
          setWinner={setWinner}
          wheelSize={300}
          spinDuration={1000}
        />
      </div>
    </div>
  );
}

export default App;
