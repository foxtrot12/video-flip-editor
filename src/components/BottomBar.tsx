import { memo, RefObject } from "react";
import { CropFrameData } from "../App";

interface BottomBarParams {
  isCropper: boolean | undefined;
  setIsCropper(arg0: boolean): void;
  isPreview: boolean;
  setIsPreview(arg0: boolean): void;
  cropDataArrRef: RefObject<CropFrameData[]>;
}

function downloadJSON(jsonObject: any, fileName: string): void {
  const jsonString = JSON.stringify(jsonObject, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });

  const link = document.createElement("a");

  link.download = `${fileName}.json`;

  link.href = URL.createObjectURL(blob);

  link.click();

  URL.revokeObjectURL(link.href);
}

function BottomBar(props: BottomBarParams) {
  return (
    <div className="flex wFull btnGrp justifySpaceBw">
      <div className="flex  prpBtnGrp justifySpaceBw">
        {" "}
        <button
          disabled={props.isCropper}
          onClick={() => props.setIsCropper(true)}
          className="cursorPtr flex prpBtn"
        >
          Start Cropper
        </button>
        <button
          disabled={!props.isCropper}
          onClick={() => props.setIsCropper(false)}
          className="cursorPtr flex prpBtn"
        >
          Remove Cropper
        </button>
        <button
          disabled={!props.isCropper || props.isPreview}
          onClick={() => props.setIsPreview(true)}
          className="cursorPtr flex prpBtn"
        >
          Generate Preview
        </button>
        <button
          disabled={!props.cropDataArrRef.current}
          onClick={() => downloadJSON(props.cropDataArrRef.current,'coordinates')}
          className="cursorPtr flex prpBtn"
        >
          Download JSON
        </button>
      </div>

      <button className="cursorPtr flex alignItemsCenter cancelBtn">
        Cancel
      </button>
    </div>
  );
}

export default memo(BottomBar);
