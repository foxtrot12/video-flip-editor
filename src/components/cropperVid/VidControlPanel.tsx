import {
  ChangeEventHandler,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fromEvent } from "rxjs";
import { PauseSvg, PlaySvg, SoundSvg } from "../../common/svgs";
import Dropdown from "../../common/dropdown/Dropdown";
import Slider from "../../common/slider/Slider";

interface VidControlParams {
  videoRef: RefObject<HTMLVideoElement>;
  classes: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<number>>;
  aspectRatio: number;
}
function formatTime(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
function VidControlPanel(props: VidControlParams) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [totalTime, setTotalTime] = useState("00:00:00");

  const playbackSpeeds = [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];

  const aspectRatios = [
    { value: 9 / 16, label: "9:16" },
    { value: 9 / 18, label: "9:18" },
    { value: 4 / 3, label: "4:3" },
    { value: 3 / 4, label: "3:4" },
    { value: 1 / 1, label: "1:1" },
    { value: 4 / 5, label: "4:5" },
  ];

  const currentTime = useMemo(() => {
    if (!props.videoRef.current) {
      return "00:00:00";
    }
    return formatTime(props.videoRef.current.currentTime);
  }, [props.videoRef?.current?.currentTime, progress]);

  const handleProgress = () => {
    if (!props.videoRef.current) return;
    const currentTime = props.videoRef.current.currentTime;
    const duration = props.videoRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  const handlePlayPause = useCallback(() => {
    if (!props.videoRef.current) return;

    if (isPlaying) {
      props.videoRef.current.pause();
    } else {
      props.videoRef.current.play();
    }
  }, [props.videoRef, isPlaying]);

  const handleSeek = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!props.videoRef.current) return;

      const newTime =
        (parseFloat(event.target.value) / 100) *
        props.videoRef.current.duration;
      props.videoRef.current.currentTime = newTime;
      setProgress(parseFloat(event.target.value));
    },
    [props.videoRef]
  );

  const handlePlaybackRateChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!props.videoRef.current) return;
      const newRate = parseFloat(event.target.value);
      setPlaybackRate(newRate);
      if (props.videoRef.current) {
        props.videoRef.current.playbackRate = newRate;
      }
    },
    [props.videoRef]
  );

  const handleAspectRatioChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!props.videoRef.current) return;
      const newRatio = parseFloat(event.target.value);
      props.setAspectRatio(newRatio);
    },
    [props.setAspectRatio]
  );

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
      if (props.videoRef.current) {
        props.videoRef.current.volume = newVolume;
      }
    },
    [props.videoRef]
  );

  useEffect(() => {
    if (!props.videoRef.current) return;

    const videoSubs = fromEvent(props.videoRef.current, "play").subscribe(() =>
      setIsPlaying(true)
    );

    videoSubs.add(
      fromEvent(props.videoRef.current, "pause").subscribe(() =>
        setIsPlaying(false)
      )
    );

    videoSubs.add(
      fromEvent(props.videoRef.current, "timeupdate").subscribe(handleProgress)
    );

    videoSubs.add(
      fromEvent(props.videoRef.current, "loadedmetadata").subscribe(() => {
        setTotalTime(
          props.videoRef.current?.duration
            ? formatTime(props.videoRef.current.duration)
            : "00:00:00"
        );
      })
    );

    return () => {
      videoSubs?.unsubscribe();
    };
  }, [props.videoRef]);

  return (
    <div className={`${props.classes} vidControlPanel flex col`}>
      <div className="flex col">
        <Slider
          min={0}
          max={100}
          step={0.1}
          buttonIcon={
            isPlaying ? (
              <PauseSvg className="hFull" />
            ) : (
              <PlaySvg className="hFull" />
            )
          }
          value={progress}
          onButtonClick={handlePlayPause}
          handleSlide={handleSeek}
        />
        <div className="flex alignItemsCenter justifySpaceBw">
          <div className="flex timeDisplay">
            <p className="currentTime">{currentTime}</p>
            <p className="timeDiv"></p>
            <p className="totalTime">{totalTime}</p>
          </div>
          <Slider
            step={0.01}
            min={0}
            max={1}
            handleSlide={handleVolumeChange}
            value={volume}
            classes="volumeSlider"
            buttonIcon={<SoundSvg className={"hFull"} />}
          />
        </div>
      </div>

      <div className="flex  wFull">
        <Dropdown
          options={playbackSpeeds}
          value={playbackRate}
          onChange={handlePlaybackRateChange}
          id="playbackDD"
          labelInner={
            <div className="flex ddLabel">
              <p className="ddLabelStatic">Playback Speed</p>
              <p className="ddLabelVal">{`${playbackRate}x`}</p>
            </div>
          }
        />
        <Dropdown
          options={aspectRatios}
          labelInner={
            <div className="flex ddLabel">
              <p className="ddLabelStatic">Cropper Aspect Ratio</p>
              <p className="ddLabelVal">{`${
                aspectRatios.find((val) => val.value === props.aspectRatio)
                  ?.label
              }`}</p>
            </div>
          }
          value={props.aspectRatio}
          onChange={handleAspectRatioChange}
          id={"aspectRatioDD"}
        />
      </div>
    </div>
  );
}

export default memo(VidControlPanel);
