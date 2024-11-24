import { memo } from "react";
import "./header.scss"

function Header() {
  return (
    <header className="flex alignItemsCenter header justifySpaceBw wFull">
      <p className="flex headerTitle alignItemsCenter">Cropper</p>
      <div className="flex btnGrp alignItemsCenter">
        <div className="flex btnGrpInner verHorCenter">
          <button className="cursorPtr sessionBtn">Preview Session</button>
          <button className="cursorPtr sessionBtn nonSelectedBtn">
            Generate Session
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
