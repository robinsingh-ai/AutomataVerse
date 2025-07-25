'use client';

import { useRef, useCallback, useEffect } from 'react';

interface TouchGestureState {
  scale: number;
  x: number;
  y: number;
}

interface UseTouchGesturesProps {
  onUpdate: (state: TouchGestureState) => void;
  initialState?: TouchGestureState;
  minScale?: number;
  maxScale?: number;
  panEnabled?: boolean;
  zoomEnabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
}

export const useTouchGestures = ({
  onUpdate,
  initialState = { scale: 1, x: 0, y: 0 },
  minScale = 0.1,
  maxScale = 5,
  panEnabled = true,
  zoomEnabled = true,
}: UseTouchGesturesProps) => {
  const stateRef = useRef<TouchGestureState>(initialState);
  const lastTouchesRef = useRef<TouchPoint[]>([]);
  const lastDistanceRef = useRef<number>(0);
  const lastCenterRef = useRef<TouchPoint>({ x: 0, y: 0 });
  const isPinchingRef = useRef<boolean>(false);
  const isPanningRef = useRef<boolean>(false);

  const getDistance = useCallback((touches: TouchPoint[]): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].x - touches[1].x;
    const dy = touches[0].y - touches[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getCenter = useCallback((touches: TouchPoint[]): TouchPoint => {
    if (touches.length === 0) return { x: 0, y: 0 };
    if (touches.length === 1) return touches[0];
    
    const x = touches.reduce((sum, touch) => sum + touch.x, 0) / touches.length;
    const y = touches.reduce((sum, touch) => sum + touch.y, 0) / touches.length;
    return { x, y };
  }, []);

  const getTouchPoints = useCallback((event: TouchEvent): TouchPoint[] => {
    return Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
    }));
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const touches = getTouchPoints(event);
    lastTouchesRef.current = touches;
    
    if (touches.length === 2 && zoomEnabled) {
      // Start pinch gesture
      isPinchingRef.current = true;
      isPanningRef.current = false;
      lastDistanceRef.current = getDistance(touches);
      lastCenterRef.current = getCenter(touches);
    } else if (touches.length === 1 && panEnabled) {
      // Start pan gesture
      isPanningRef.current = true;
      isPinchingRef.current = false;
      lastCenterRef.current = touches[0];
    }
  }, [getTouchPoints, getDistance, getCenter, zoomEnabled, panEnabled]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const touches = getTouchPoints(event);
    
    if (touches.length === 2 && isPinchingRef.current && zoomEnabled) {
      // Handle pinch-to-zoom
      const distance = getDistance(touches);
      const center = getCenter(touches);
      
      if (lastDistanceRef.current > 0) {
        const scaleChange = distance / lastDistanceRef.current;
        const newScale = Math.max(minScale, Math.min(maxScale, stateRef.current.scale * scaleChange));
        
        // Calculate pan offset to keep zoom centered
        const deltaX = center.x - lastCenterRef.current.x;
        const deltaY = center.y - lastCenterRef.current.y;
        
        stateRef.current = {
          scale: newScale,
          x: stateRef.current.x + deltaX,
          y: stateRef.current.y + deltaY,
        };
        
        onUpdate(stateRef.current);
      }
      
      lastDistanceRef.current = distance;
      lastCenterRef.current = center;
    } else if (touches.length === 1 && isPanningRef.current && panEnabled) {
      // Handle single-finger pan
      const touch = touches[0];
      const deltaX = touch.x - lastCenterRef.current.x;
      const deltaY = touch.y - lastCenterRef.current.y;
      
      stateRef.current = {
        ...stateRef.current,
        x: stateRef.current.x + deltaX,
        y: stateRef.current.y + deltaY,
      };
      
      onUpdate(stateRef.current);
      lastCenterRef.current = touch;
    }
  }, [getTouchPoints, getDistance, getCenter, onUpdate, minScale, maxScale, zoomEnabled, panEnabled]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    const touches = getTouchPoints(event);
    
    if (touches.length < 2) {
      isPinchingRef.current = false;
    }
    
    if (touches.length === 0) {
      isPanningRef.current = false;
    }
    
    lastTouchesRef.current = touches;
    
    if (touches.length > 0) {
      lastCenterRef.current = getCenter(touches);
      if (touches.length === 2) {
        lastDistanceRef.current = getDistance(touches);
      }
    }
  }, [getTouchPoints, getDistance, getCenter]);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!zoomEnabled) return;
    
    event.preventDefault();
    
    const scaleChange = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(minScale, Math.min(maxScale, stateRef.current.scale * scaleChange));
    
    // Calculate zoom center based on mouse position
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    // Adjust pan to zoom towards mouse position
    const scaleRatio = newScale / stateRef.current.scale;
    const deltaX = (centerX - stateRef.current.x) * (1 - scaleRatio);
    const deltaY = (centerY - stateRef.current.y) * (1 - scaleRatio);
    
    stateRef.current = {
      scale: newScale,
      x: stateRef.current.x + deltaX,
      y: stateRef.current.y + deltaY,
    };
    
    onUpdate(stateRef.current);
  }, [onUpdate, minScale, maxScale, zoomEnabled]);

  const attachToElement = useCallback((element: HTMLElement | null) => {
    if (!element) return () => {};
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  const reset = useCallback(() => {
    stateRef.current = initialState;
    onUpdate(stateRef.current);
  }, [initialState, onUpdate]);

  const updateState = useCallback((newState: Partial<TouchGestureState>) => {
    stateRef.current = { ...stateRef.current, ...newState };
    onUpdate(stateRef.current);
  }, [onUpdate]);

  return {
    attachToElement,
    reset,
    updateState,
    currentState: stateRef.current,
  };
};
