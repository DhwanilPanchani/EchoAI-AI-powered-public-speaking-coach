import { useRef, useCallback, useState } from 'react';

export function useWebcam() {
  const webcamRef = useRef<any>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  }, []);

  const onUserMedia = useCallback(() => {
    setIsWebcamReady(true);
  }, []);

  const onUserMediaError = useCallback((error: any) => {
    console.error('Webcam error:', error);
    setIsWebcamReady(false);
  }, []);

  return {
    webcamRef,
    capture,
    isWebcamReady,
    onUserMedia,
    onUserMediaError
  };
}