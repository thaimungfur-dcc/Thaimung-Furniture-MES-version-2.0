import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

interface DraggableWrapperProps {
  children: React.ReactElement;
  disabled?: boolean;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ 
  children, 
  disabled = false
}) => {
  const nodeRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (nodeRef.current && !disabled) {
      // Find the header to use as drag handle. It's usually the first div.
      const header = nodeRef.current.firstElementChild as HTMLElement;
      if (header) {
         header.classList.add('drag-handle', 'cursor-move');
         handleRef.current = header;
      }
    }
    return () => {
       if (handleRef.current) {
          handleRef.current.classList.remove('drag-handle', 'cursor-move');
       }
    };
  }, [disabled]);

  if (disabled) return children;

  if (!React.isValidElement(children)) {
    return children;
  }

  // Clone element to inject ref
  const childWithRef = React.cloneElement(children as any, { 
    ref: nodeRef 
  });

  return (
    <Draggable nodeRef={nodeRef as React.RefObject<HTMLElement>} handle=".drag-handle" bounds="parent">
      {childWithRef}
    </Draggable>
  );
};
