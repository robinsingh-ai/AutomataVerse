'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useResponsive } from '../../app/context/ResponsiveContext';

interface MobileTouchHandlerProps {
    children: React.ReactNode;
    onTap?: (x: number, y: number) => void;
    onDoubleTap?: (x: number, y: number) => void;
    onLongPress?: (x: number, y: number) => void;
    onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
    onPinch?: (scale: number, centerX: number, centerY: number) => void;
    className?: string;
    disabled?: boolean;
}

const MobileTouchHandler: React.FC<MobileTouchHandlerProps> = ({
    children,
    onTap,
    onDoubleTap,
    onLongPress,
    onSwipe,
    onPinch,
    className = '',
    disabled = false
}) => {
    const { isMobile, isTouch } = useResponsive();
    const elementRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const doubleTapTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const touchPointsRef = useRef<{ x: number; y: number }[]>([]);

    const getTouchPoint = useCallback((event: TouchEvent): { x: number; y: number } => {
        const touch = event.touches[0];
        return { x: touch.clientX, y: touch.clientY };
    }, []);

    const getTouchCenter = useCallback((touches: TouchList): { x: number; y: number } => {
        if (touches.length === 0) return { x: 0, y: 0 };
        if (touches.length === 1) return { x: touches[0].clientX, y: touches[0].clientY };

        let x = 0, y = 0;
        for (let i = 0; i < touches.length; i++) {
            x += touches[i].clientX;
            y += touches[i].clientY;
        }
        return { x: x / touches.length, y: y / touches.length };
    }, []);

    const getTouchDistance = useCallback((touches: TouchList): number => {
        if (touches.length < 2) return 0;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }, []);

    const handleTouchStart = useCallback((event: TouchEvent) => {
        if (disabled || !isMobile) return;

        event.preventDefault();

        const touchPoint = getTouchPoint(event);
        const now = Date.now();

        touchStartRef.current = { ...touchPoint, time: now };
        touchEndRef.current = null;

        // Store touch points for pinch detection
        touchPointsRef.current = Array.from(event.touches).map(touch => ({
            x: touch.clientX,
            y: touch.clientY
        }));

        // Start long press timer
        if (onLongPress) {
            longPressTimerRef.current = setTimeout(() => {
                if (touchStartRef.current) {
                    onLongPress(touchStartRef.current.x, touchStartRef.current.y);
                }
            }, 500);
        }
    }, [disabled, isMobile, getTouchPoint, onLongPress]);

    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (disabled || !isMobile) return;

        event.preventDefault();

        // Clear long press timer if user moves finger
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        // Handle pinch gesture
        if (onPinch && event.touches.length === 2) {
            const distance = getTouchDistance(event.touches);
            const center = getTouchCenter(event.touches);

            // Calculate scale based on initial distance
            if (touchPointsRef.current.length >= 2) {
                const initialDistance = Math.sqrt(
                    Math.pow(touchPointsRef.current[0].x - touchPointsRef.current[1].x, 2) +
                    Math.pow(touchPointsRef.current[0].y - touchPointsRef.current[1].y, 2)
                );

                if (initialDistance > 0) {
                    const scale = distance / initialDistance;
                    onPinch(scale, center.x, center.y);
                }
            }
        }

        // Update touch points
        touchPointsRef.current = Array.from(event.touches).map(touch => ({
            x: touch.clientX,
            y: touch.clientY
        }));
    }, [disabled, isMobile, onPinch, getTouchDistance, getTouchCenter]);

    const handleTouchEnd = useCallback((event: TouchEvent) => {
        if (disabled || !isMobile) return;

        event.preventDefault();

        // Clear long press timer
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        const touchPoint = getTouchPoint(event);
        const now = Date.now();

        touchEndRef.current = { ...touchPoint, time: now };

        if (touchStartRef.current && touchEndRef.current) {
            const start = touchStartRef.current;
            const end = touchEndRef.current;
            const duration = end.time - start.time;
            const distance = Math.sqrt(
                Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
            );

            // Determine gesture type
            if (duration < 300 && distance < 10) {
                // Tap gesture
                if (onTap) {
                    onTap(end.x, end.y);
                }

                // Check for double tap
                if (onDoubleTap && lastTapRef.current) {
                    const timeDiff = end.time - lastTapRef.current.time;
                    const distanceDiff = Math.sqrt(
                        Math.pow(end.x - lastTapRef.current.x, 2) +
                        Math.pow(end.y - lastTapRef.current.y, 2)
                    );

                    if (timeDiff < 300 && distanceDiff < 30) {
                        onDoubleTap(end.x, end.y);
                        lastTapRef.current = null;
                        return;
                    }
                }

                lastTapRef.current = { ...end };

                // Clear double tap timer
                if (doubleTapTimerRef.current) {
                    clearTimeout(doubleTapTimerRef.current);
                }

                doubleTapTimerRef.current = setTimeout(() => {
                    lastTapRef.current = null;
                }, 300);

            } else if (duration > 300 && distance > 30 && onSwipe) {
                // Swipe gesture
                const deltaX = end.x - start.x;
                const deltaY = end.y - start.y;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);

                if (absDeltaX > absDeltaY) {
                    // Horizontal swipe
                    onSwipe(deltaX > 0 ? 'right' : 'left', absDeltaX);
                } else {
                    // Vertical swipe
                    onSwipe(deltaY > 0 ? 'down' : 'up', absDeltaY);
                }
            }
        }

        // Reset touch points
        touchPointsRef.current = [];
    }, [disabled, isMobile, getTouchPoint, onTap, onDoubleTap, onSwipe]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || !isMobile || !isTouch) return;

        const options = { passive: false };

        element.addEventListener('touchstart', handleTouchStart, options);
        element.addEventListener('touchmove', handleTouchMove, options);
        element.addEventListener('touchend', handleTouchEnd, options);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobile, isTouch, handleTouchStart, handleTouchMove, handleTouchEnd]);

    useEffect(() => {
        return () => {
            // Cleanup timers
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
            if (doubleTapTimerRef.current) {
                clearTimeout(doubleTapTimerRef.current);
            }
        };
    }, []);

    if (!isMobile) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            ref={elementRef}
            className={`mobile-touch-handler ${className}`}
            style={{ touchAction: 'none' }}
        >
            {children}
        </div>
    );
};

export default MobileTouchHandler; 