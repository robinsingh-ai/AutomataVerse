import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  className = '',
  style = {},
  onDragStart,
  onDragEnd
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).className.includes('drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      onDragStart?.();
    }
  }, [onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '300px',
    zIndex: 1000,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...style
  };

  return (
    <div
      ref={panelRef}
      className={`draggable-panel ${className}`}
      style={panelStyle}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="drag-handle panel-header" 
        style={{
          padding: '12px 16px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
          borderRadius: '8px 8px 0 0',
          fontWeight: 'bold',
          cursor: 'grab'
        }}
      >
        {title}
      </div>
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;
