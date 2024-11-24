import { useRef, useState, useEffect, memo, RefObject } from "react";
import { fromEvent, Subscription } from "rxjs";

interface CropperParams {
  aspectRatio: number;
  videoRef: RefObject<HTMLVideoElement>;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
}

const aspectRatios = ["9:18", "9:16", "4:3", "3:4", "1:1", "4:5"];

function Cropper(props: CropperParams) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  
  const updateCanvas = () => {
    if (
      props.videoRef.current &&
      props.previewCanvasRef.current &&
      overlayRef.current
    ) {
      const canvas = props.previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = overlayPosition;
      const { width, height } = overlaySize;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        props.videoRef.current,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
      );
    }
  };
  
  useEffect(() => {
    const interval = setInterval(updateCanvas, 30); //todo
    return () => clearInterval(interval);
  }, [props.videoRef, overlayPosition, overlaySize]);

  useEffect(() => {
    if (!props.previewCanvasRef.current || !props.videoRef.current) return;

    const videoLoadedSubs = fromEvent(props.videoRef.current, "loadeddata").subscribe(
      () => {
        if (!props.previewCanvasRef.current || !props.videoRef.current) return;

        const videoRect = props.videoRef.current.getBoundingClientRect();

        setOverlayPosition({
          x: videoRect.x,
          y: videoRect.y,
        });

        setOverlaySize({
          height: videoRect.height,
          width: videoRect.height * props.aspectRatio,
        });
      }
    );

    return () => {
      videoLoadedSubs?.unsubscribe();
    };
  }, [props.previewCanvasRef, props.videoRef, props.aspectRatio]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        top: overlayPosition.y,
        left: overlayPosition.x,
        width: overlaySize.width,
        height: overlaySize.height,
        border: "2px dashed red",
        // cursor: dragging ? "grabbing" : "grab",
        background: "rgba(255, 255, 255, 0.2)",
      }}
    ></div>
  );
}

export default memo(Cropper);
