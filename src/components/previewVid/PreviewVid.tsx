import { memo, RefObject } from "react";
import "./previewVid.scss";
import { VideoSvg } from "../../common/svgs";

interface PreviewVidParams {
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  isPreview: boolean;
}

function PreviewVid(props: PreviewVidParams) {
  return (
    <div className="previewVid">
      {props.isPreview ? (
        <canvas className="prevCanvas" ref={props.previewCanvasRef} />
      ) : (
        <div className="flex col verHorCenter hFull wFull">
          <VideoSvg className={"flex"} />
          <p>
            <b className="previewNotAvailableTxt">Preview not available</b>
          </p>
          <p className="previewNotAvailableTxt">Please click on “Start Cropper” and then play video</p>
        </div>
      )}
    </div>
  );
}

export default memo(PreviewVid);
