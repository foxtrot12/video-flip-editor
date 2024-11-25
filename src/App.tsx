import { useRef, useState, useEffect } from "react";
import "./App.scss";
import CropperVid from "./components/cropperVid/CropperVid";
import Header from "./components/header/Header";
import PreviewVid from "./components/previewVid/PreviewVid";
import BottomBar from "./components/BottomBar";

export interface CropFrameData {
  timeStamp: number;
  coordinates: Array<number>;
  volume: number;
  playbackRate: number;
}

function App() {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isCropper, setIsCropper] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const cropFrameDataArrRef = useRef<Array<CropFrameData>>([]);

  return (
    <main className="videoFlipEditor">
      {" "}
      <div className="hFull wFull flex col">
        {" "}
        <Header />
        <div className="flex wFull justifySpaceBw">
          <CropperVid
            cropDataArrRef={cropFrameDataArrRef}
            isCropper={isCropper}
            previewCanvasRef={previewCanvasRef}
          />
          <PreviewVid
            isPreview={isPreview}
            previewCanvasRef={previewCanvasRef}
          />
        </div>
        <BottomBar
          cropDataArrRef={cropFrameDataArrRef}
          isCropper={isCropper}
          setIsCropper={setIsCropper}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
        />
      </div>
    </main>
  );
}

export default App;
