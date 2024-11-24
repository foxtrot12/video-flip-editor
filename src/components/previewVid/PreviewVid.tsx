import { memo, RefObject } from "react";
import "./previewVid.scss"

interface PreviewVidParams{
    previewCanvasRef:RefObject<HTMLCanvasElement>
  }
  

function PreviewVid(props:PreviewVidParams) {
  return (
    <div className="flex previewVid">
      <canvas ref={props.previewCanvasRef}/>
    </div>
  );
}

export default memo(PreviewVid);
