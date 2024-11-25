import { memo, RefObject, useEffect, useRef, useState } from "react";
import ControlPanel from "./VidControlPanel";
import "./cropperVid.scss";
import Cropper from "./Cropper";
import { CropFrameData } from "../../App";

interface CropperVidParams {
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  isCropper : boolean,
  cropDataArrRef: RefObject<CropFrameData[]>;
}


function CropperVidC(props: CropperVidParams) {
  const [aspectRatio,setAspectRatio] = useState(9/16)

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
      <ControlPanel aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} classes="wFull" videoRef={videoRef} />
      {props.isCropper&&<Cropper
        aspectRatio={aspectRatio}
        videoRef={videoRef}
        cropDataArrRef={props.cropDataArrRef}
        previewCanvasRef={props.previewCanvasRef}
      />}
    </div>
  );
}

const CropperVid = memo(CropperVidC);

export default memo(CropperVid);
