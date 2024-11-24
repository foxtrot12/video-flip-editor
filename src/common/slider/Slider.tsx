import {
  ChangeEventHandler,
  memo,
  MouseEventHandler,
  ReactNode,
  useMemo,
} from "react";
import "./slider.scss";

interface SliderParams {
  step: number;
  value: number;
  handleSlide: ChangeEventHandler<HTMLInputElement>;
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  buttonIcon: ReactNode;
  min: number;
  max: number;
  classes?: string;
}

function Slider(props: SliderParams) {
  const progressPerc = useMemo(() => {
    return ((props.value * 100) / props.max);
  }, [props.value]);

  return (
    <div className={`flex slider ${props.classes}`}>
      <button
        className={`sliderBtn hFull flex ${props.onButtonClick ? 'cursorPtr' : ''}`}
        onClick={props.onButtonClick}
        disabled={!(props.onButtonClick)}
        aria-hidden={!(props.onButtonClick)}
      >
        {props.buttonIcon}
      </button>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        style={{
          background: `linear-gradient(to right, #ffffff ${progressPerc}%, #ffffff3B ${progressPerc}%)`,
        }}
        value={props.value}
        onChange={props.handleSlide}
        className="flex grow cursorPtr seeker"
      ></input>{" "}
    </div>
  );
}

export default memo(Slider);
