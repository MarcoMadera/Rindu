import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

interface PanelGroupProps {
  direction: "column" | "row";
}

export function Group({
  direction,
  children,
}: PropsWithChildren<PanelGroupProps>): ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: direction, width: "100%" }}>
      {children}
    </div>
  );
}

interface PanelProps {
  defaultSize: string;
  id: string;
  minWidth?: string;
  maxWidth?: string;
}

export function Item({
  defaultSize,
  minWidth,
  maxWidth,
  id,
  children,
}: PropsWithChildren<PanelProps>): ReactElement {
  return (
    <div
      style={{
        flex: "0 0 auto",
        width: defaultSize,
        height: "100%",
        position: "relative",
        minWidth,
        maxWidth,
      }}
      id={id}
    >
      {children}
    </div>
  );
}

interface PanelResizeHandleProps {
  onResize: (delta: number) => void;
}

export function Handle({ onResize }: PanelResizeHandleProps): ReactElement {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isPressingMouse, setIsPressingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isPressingMouse) {
      return;
    }

    function handleDrag(e: globalThis.MouseEvent) {
      e.preventDefault();
      setIsDragging(true);
      if (isResizing) {
        onResize(e.pageX);
      }
    }

    function handleDragEnd() {
      setIsPressingMouse(false);
      setIsDragging(false);
      setIsResizing(false);
    }

    if (!isDragging) {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      return;
    }

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isPressingMouse, isDragging, isResizing, onResize]);

  return (
    <div
      ref={handleRef}
      className="resize-handle"
      role="button"
      tabIndex={0}
      onMouseMove={() => {
        if (isPressingMouse) {
          setIsDragging(true);
        }
      }}
      onMouseDown={() => {
        setIsPressingMouse(true);
      }}
      onMouseLeave={() => {
        if (isPressingMouse) {
          setIsDragging(true);
          setIsResizing(true);
        }
      }}
      onMouseUp={() => {
        setIsPressingMouse(false);
        setIsResizing(false);
      }}
    >
      <div className="resize-handle-line"></div>
      <style jsx>{`
        .resize-handle {
          cursor: col-resize;
          background: transparent;
          position: absolute;
          right: -6px;
          top: 0;
          bottom: 0;
          width: 12px;
          z-index: 1;
        }
        .resize-handle:hover .resize-handle-line {
          background: rgba(255, 255, 255, 0.3);
        }
        .resize-handle-line {
          background: ${isResizing ? "rgba(255, 255, 255, 0.3)" : "trasparent"};
          position: absolute;
          right: 6px;
          top: 0;
          bottom: 0;
          width: 1px;
          transition: background 0.2s ease;
        }
      `}</style>
    </div>
  );
}

const ResizablePanel = {
  Group,
  Item,
  Handle,
};

export default ResizablePanel;
