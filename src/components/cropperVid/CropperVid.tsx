import { memo, RefObject, useEffect, useRef, useState } from "react";
import ControlPanel from "./VidControlPanel";
import "./cropperVid.scss";
import Cropper from "./Cropper";

interface CropperVidParams{
  previewCanvasRef:RefObject<HTMLCanvasElement>
}

function CropperVidC(props:CropperVidParams) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="cropperVid flex col">
      <video
        playsInline
        ref={videoRef}
        preload="metadata"
        className="flex videoEl"
      >
        <source src={"sampleVid.mp4"}></source>
      </video>
      <ControlPanel classes="wFull" videoRef={videoRef} />
      <Cropper aspectRatio={9/16} videoRef={videoRef} previewCanvasRef={props.previewCanvasRef}/>
    </div>
  );
}

const CropperVid = memo(CropperVidC);

export default memo(CropperVid);
