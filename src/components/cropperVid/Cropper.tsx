import { useRef, useState, useEffect, memo, RefObject, useMemo } from "react";
import { fromEvent, Subscription } from "rxjs";
import { CropFrameData } from "../../App";

interface CropperParams {
  aspectRatio: number;
  videoRef: RefObject<HTMLVideoElement>;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  cropDataArrRef: RefObject<CropFrameData[]>;
}

function Cropper(props: CropperParams) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [overlayPosition, setOverlayPosition] = useState({
    absX: 0,
    absY: 0,
    relX: 0,
    relY: 0,
  });
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const initialRelX = useRef(0);

  const updateCanvas = () => {
    if (
      props.videoRef.current &&
      props.previewCanvasRef.current &&
      overlayRef.current
    ) {
      const canvas = props.previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { relX, relY } = overlayPosition;
      const { width, height } = overlaySize;

      canvas.width = width;
      canvas.height = height;

      const naturalWidth = props.videoRef.current.videoWidth;
      const naturalHeight = props.videoRef.current.videoHeight;
      const clientWidth = props.videoRef.current.clientWidth;
      const clientHeight = props.videoRef.current.clientHeight;

      ctx.drawImage(
        props.videoRef.current,
        (relX * naturalWidth) / clientWidth,
        (relY * naturalHeight) / clientHeight,
        (width * naturalWidth) / clientWidth,
        (height * naturalHeight) / clientHeight,
        0,
        0,
        width,
        height
      );
    }
  };

  const setOverlaySizeAndPosition = () => {
    if (!props.videoRef.current) return;

    const videoRect = props.videoRef.current.getBoundingClientRect();

    setOverlayPosition({
      absX: videoRect.left,
      absY: videoRect.top + 2, //to count for padding
      relX: 0,
      relY: 0,
    });

    setOverlaySize({
      height: videoRect.height,
      width: videoRect.height * props.aspectRatio,
    });
  };

  useEffect(() => {
    updateCanvas();
    const interval = setInterval(() => {
      updateCanvas();
    }, 30);
    return () => clearInterval(interval);
  }, [props.videoRef, overlayPosition, overlaySize]);

  useEffect(() => {
    if (!props.videoRef.current) return;
    setOverlaySizeAndPosition();

    const videoLoadedSubs = fromEvent(
      props.videoRef.current,
      "loadeddata"
    ).subscribe(() => {
      setOverlaySizeAndPosition();
    });

    return () => {
      videoLoadedSubs?.unsubscribe();
    };
  }, [props.previewCanvasRef, props.videoRef, props.aspectRatio]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = event.clientX;
    initialRelX.current = overlayPosition.relX;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current && props.videoRef.current) {
      const videoRect = props.videoRef.current.getBoundingClientRect();
      let deltaX = event.clientX - dragStartX.current;
      let newRelX = initialRelX.current + deltaX;

      // Constrain the overlay within the video bounds
      newRelX = Math.max(
        0,
        Math.min(newRelX, videoRect.width - overlaySize.width)
      );

      setOverlayPosition((prev) => ({
        ...prev,
        absX: videoRect.left + newRelX,
        relX: newRelX,
      }));
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    const newCropFrame: CropFrameData = {
      timeStamp: props.videoRef.current?.currentTime ?? 0,
      coordinates: [
        overlayPosition.relX,
        overlayPosition.relY,
        overlaySize.width,
        overlaySize.height,
      ],
      volume: props.videoRef.current?.volume ?? 0,
      playbackRate: props.videoRef.current?.playbackRate ?? 0,
    };
    props.cropDataArrRef.current?.push(newCropFrame);

  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        top: overlayPosition.absY,
        left: overlayPosition.absX,
        width: overlaySize.width,
        height: overlaySize.height,

      }}
      className="cropper"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp} // In case the pointer leaves the overlay while dragging
    >
      {[0,1,2,3,4,5,6,7,8].map((x)=><div className="cropperGrid" key='x'></div>)}
    </div>
  );
}

export default memo(Cropper);
