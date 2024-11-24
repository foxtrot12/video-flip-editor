import { useRef, useState, useEffect } from "react";
import "./App.scss";
import CropperVid from "./components/cropperVid/CropperVid";
import Header from "./components/header/Header";
import PreviewVid from "./components/previewVid/PreviewVid";

function App() {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <main className="videoFlipEditor">
      {" "}
      <div className="hFull wFull flex col">
        {" "}
        <Header />
        <div className="flex wFull justifySpaceBw">
          <CropperVid previewCanvasRef={previewCanvasRef} />
          <PreviewVid previewCanvasRef={previewCanvasRef}/>
        </div>
      </div>
    </main>
  );
}


export default App;
