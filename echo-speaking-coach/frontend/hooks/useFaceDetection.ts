import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export function useFaceDetection() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);
        setModelsLoaded(true);
        console.log('Face detection models loaded');
      } catch (error) {
        console.error('Failed to load face detection models:', error);
      }
    };

    loadModels();
  }, []);

  const detectFace = async (video: HTMLVideoElement): Promise<{
    faceDetected: boolean;
    eyeContact: number;
    lookingDirection: string;
  }> => {
    if (!modelsLoaded || !video) {
      return { faceDetected: false, eyeContact: 0, lookingDirection: 'unknown' };
    }

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detections) {
        const landmarks = detections.landmarks;
        
        // Get eye positions
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();
        
        // Calculate if person is looking at camera based on eye and nose alignment
        const leftEyeCenter = {
          x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
          y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
        };
        
        const rightEyeCenter = {
          x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
          y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
        };
        
        const noseCenter = {
          x: nose.reduce((sum, point) => sum + point.x, 0) / nose.length,
          y: nose.reduce((sum, point) => sum + point.y, 0) / nose.length
        };
        
        // Calculate face center position relative to frame
        const faceBox = detections.detection.box;
        const frameCenterX = video.videoWidth / 2;
        const faceCenterX = faceBox.x + faceBox.width / 2;
        
        // Calculate how centered the face is (0-100 score)
        const centerOffset = Math.abs(faceCenterX - frameCenterX) / frameCenterX;
        const centerScore = Math.max(0, 100 - (centerOffset * 100));
        
        // Check if eyes are level (person looking straight)
        const eyeLevelDiff = Math.abs(leftEyeCenter.y - rightEyeCenter.y);
        const eyeLevelScore = Math.max(0, 100 - (eyeLevelDiff * 2));
        
        // Combine scores for eye contact rating
        const eyeContactScore = (centerScore * 0.6 + eyeLevelScore * 0.4);
        
        // Determine looking direction
        let lookingDirection = 'center';
        if (centerOffset > 0.3) {
          lookingDirection = faceCenterX < frameCenterX ? 'left' : 'right';
        }
        if (eyeLevelDiff > 20) {
          lookingDirection = 'away';
        }
        
        return {
          faceDetected: true,
          eyeContact: Math.round(eyeContactScore),
          lookingDirection
        };
      }
      
      return { faceDetected: false, eyeContact: 0, lookingDirection: 'no_face' };
    } catch (error) {
      console.error('Face detection error:', error);
      return { faceDetected: false, eyeContact: 0, lookingDirection: 'error' };
    }
  };

  return {
    modelsLoaded,
    detectFace,
    isDetecting,
    setIsDetecting
  };
}