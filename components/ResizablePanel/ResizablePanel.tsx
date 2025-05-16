import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

interface PanelGroupProps {
  direction: "column" | "row";
  className?: string;
}

export function Group({
  direction,
  children,
  className,
}: PropsWithChildren<PanelGroupProps>): ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        width: "100%",
        height: "100%",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

interface PanelProps {
  defaultSize?: string;
  id: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  size?: string;
  onSizeChange?: (newSize: string) => void;
  waitForImages?: boolean;
  className?: string;
  observeResize?: boolean;
}

export function Item({
  defaultSize,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  id,
  children,
  size: externalSize,
  onSizeChange,
  waitForImages = false,
  className,
  observeResize = false,
}: PropsWithChildren<PanelProps>): ReactElement {
  const itemRef = useRef<HTMLDivElement>(null);
  const [internalSize, setInternalSize] = useState(defaultSize || "auto");
  const [initialized, setInitialized] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(!waitForImages);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const size = externalSize !== undefined ? externalSize : internalSize;

  useEffect(() => {
    if (!waitForImages || initialized) return;

    const checkImagesLoaded = () => {
      if (!itemRef.current) return;

      const images = itemRef.current.querySelectorAll("img");
      if (images.length === 0) {
        setImagesLoaded(true);
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener("load", handleImageLoad);
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener("load", handleImageLoad);
        });
      };
    };

    checkImagesLoaded();
  }, [waitForImages, initialized]);

  useEffect(() => {
    if (!observeResize || !itemRef.current) return;

    const handleResize = () => {
      if (!itemRef.current || externalSize !== undefined) return;

      const rect = itemRef.current.getBoundingClientRect();
      const autoSize = `${Math.max(rect.width, 100)}px`;

      setInternalSize(autoSize);
      if (onSizeChange) {
        onSizeChange(autoSize);
      }
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(itemRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [observeResize, externalSize, onSizeChange]);

  useEffect(() => {
    if (!imagesLoaded) return;

    if (
      externalSize === undefined &&
      !defaultSize &&
      !initialized &&
      itemRef.current
    ) {
      const rect = itemRef.current.getBoundingClientRect();
      const autoSize = `${Math.max(rect.width, 100)}px`;
      setInternalSize(autoSize);
      setInitialized(true);

      if (onSizeChange) {
        onSizeChange(autoSize);
      }
    } else if (defaultSize && externalSize === undefined && !initialized) {
      setInternalSize(defaultSize);
      setInitialized(true);
    }
  }, [defaultSize, externalSize, initialized, onSizeChange, imagesLoaded]);

  return (
    <div
      ref={itemRef}
      style={{
        flex: initialized ? "0 0 auto" : "0 1 auto",
        width: size,
        height: "100%",
        position: "relative",
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
      }}
      id={id}
      className={className}
    >
      {children}
    </div>
  );
}

interface PanelResizeHandleProps {
  onResize?: (delta: number) => void;
  direction?: "horizontal" | "vertical";
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  containerRef?: React.RefObject<HTMLElement | null>;
  defaultOnResize?: (delta: number) => void;
  document?: Document;
}

export function Handle({
  onResize,
  direction = "horizontal",
  onResizeStart,
  onResizeEnd,
  containerRef,
  defaultOnResize,
  document = window.document,
}: PanelResizeHandleProps): ReactElement {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isPressingMouse, setIsPressingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const isHorizontal = direction === "horizontal";
  const cursor = isHorizontal ? "col-resize" : "row-resize";

  useEffect(() => {
    if (!isPressingMouse) {
      return;
    }

    function handleDrag(e: globalThis.MouseEvent) {
      e.preventDefault();
      setIsDragging(true);

      if (isResizing) {
        const delta = isHorizontal
          ? e.pageX - lastPositionRef.current.x
          : e.pageY - lastPositionRef.current.y;

        lastPositionRef.current = { x: e.pageX, y: e.pageY };

        if (containerRef && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const containerPos = isHorizontal ? rect.left : rect.top;
          const mousePos = isHorizontal ? e.clientX : e.clientY;
          const absolutePos = mousePos - containerPos;

          if (onResize) {
            onResize(absolutePos);
          } else if (defaultOnResize) {
            defaultOnResize(delta);
          }
        } else {
          if (onResize) {
            onResize(isHorizontal ? e.pageX : e.pageY);
          } else if (defaultOnResize) {
            defaultOnResize(delta);
          }
        }
      }
    }

    function handleDragEnd() {
      setIsPressingMouse(false);
      setIsDragging(false);
      setIsResizing(false);
      if (onResizeEnd) {
        onResizeEnd();
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPressingMouse,
    isDragging,
    isResizing,
    onResize,
    onResizeEnd,
    isHorizontal,
    defaultOnResize,
    containerRef,
  ]);

  return (
    <div
      ref={handleRef}
      className={`resize-handle ${isHorizontal ? "horizontal" : "vertical"}`}
      style={{ cursor: cursor }}
      role="button"
      tabIndex={0}
      onMouseMove={() => {
        if (isPressingMouse) {
          setIsDragging(true);
        }
      }}
      onMouseDown={(e) => {
        setIsPressingMouse(true);
        lastPositionRef.current = { x: e.pageX, y: e.pageY };
        if (onResizeStart) {
          onResizeStart();
        }
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
        if (onResizeEnd) {
          onResizeEnd();
        }
      }}
    >
      <div
        className={`resize-handle-line ${isResizing ? "resizing" : ""}`}
      ></div>
      <style jsx>{`
        .resize-handle {
          background: transparent;
          position: absolute;
          z-index: 1000000;
        }

        .resize-handle.horizontal {
          right: -6px;
          top: 0;
          bottom: 0;
          width: 12px;
        }

        .resize-handle.vertical {
          bottom: -6px;
          left: 0;
          right: 0;
          height: 12px;
        }

        .resize-handle:hover .resize-handle-line {
          background: rgba(255, 255, 255, 0.3);
        }

        .resize-handle-line {
          background: transparent;
          position: absolute;
          transition: background 0.2s ease;
        }
        .resize-handle-line.resizing {
          background: "rgba(255, 255, 255, 0.3)";
        }

        .horizontal .resize-handle-line {
          right: 6px;
          top: 0;
          bottom: 0;
          width: 1px;
        }

        .vertical .resize-handle-line {
          bottom: 6px;
          left: 0;
          right: 0;
          height: 1px;
        }
      `}</style>
    </div>
  );
}

interface ResizablePanelProps {
  id: string;
  direction?: "horizontal" | "vertical";
  defaultSize?: string;
  minSize?: string;
  maxSize?: string;
  size?: string;
  onSizeChange?: (newSize: string) => void;
  waitForImages?: boolean;
  observeResize?: boolean;
  className?: string;
  document?: Document;
}

export function Panel({
  id,
  direction = "horizontal",
  defaultSize,
  minSize,
  maxSize,
  size: externalSize,
  onSizeChange,
  waitForImages = false,
  observeResize = false,
  children,
  className,
  document = window.document,
}: PropsWithChildren<ResizablePanelProps>): ReactElement {
  const panelRef = useRef<HTMLDivElement>(null);
  const [internalSize, setInternalSize] = useState(defaultSize || "auto");
  const [initialized, setInitialized] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(!waitForImages);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const size = externalSize !== undefined ? externalSize : internalSize;
  const isHorizontal = direction === "horizontal";

  useEffect(() => {
    if (!waitForImages || initialized) return;

    const checkImagesLoaded = () => {
      if (!panelRef.current) return;

      const images = panelRef.current.querySelectorAll("img");
      if (images.length === 0) {
        setImagesLoaded(true);
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener("load", handleImageLoad);
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener("load", handleImageLoad);
        });
      };
    };

    checkImagesLoaded();
  }, [waitForImages, initialized]);

  useEffect(() => {
    if (!observeResize || !panelRef.current) return;

    const handleResize = () => {
      if (!panelRef.current || externalSize !== undefined) return;

      const rect = panelRef.current.getBoundingClientRect();
      const autoSize = isHorizontal
        ? `${Math.max(rect.width, 100)}px`
        : `${Math.max(rect.height, 100)}px`;

      setInternalSize(autoSize);
      if (onSizeChange) {
        onSizeChange(autoSize);
      }
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(panelRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [observeResize, externalSize, onSizeChange, isHorizontal]);

  useEffect(() => {
    if (!imagesLoaded) return;

    if (
      externalSize === undefined &&
      !defaultSize &&
      !initialized &&
      panelRef.current
    ) {
      const rect = panelRef.current.getBoundingClientRect();
      const autoSize = isHorizontal
        ? `${Math.max(rect.width, 100)}px`
        : `${Math.max(rect.height, 100)}px`;

      setInternalSize(autoSize);
      setInitialized(true);

      if (onSizeChange) {
        onSizeChange(autoSize);
      }
    } else if (defaultSize && externalSize === undefined && !initialized) {
      setInternalSize(defaultSize);
      setInitialized(true);
    }
  }, [
    defaultSize,
    externalSize,
    initialized,
    isHorizontal,
    onSizeChange,
    imagesLoaded,
  ]);

  const minConstraint = isHorizontal
    ? { minWidth: minSize }
    : { minHeight: minSize };
  const maxConstraint = isHorizontal
    ? { maxWidth: maxSize }
    : { maxHeight: maxSize };

  const sizeStyle = isHorizontal
    ? { width: size, height: "100%" }
    : { height: size, width: "100%" };

  const handleResize = (delta: number) => {
    if (!panelRef.current) return;

    const currentSize = isHorizontal
      ? panelRef.current.getBoundingClientRect().width
      : panelRef.current.getBoundingClientRect().height;

    let newSize = currentSize + delta;

    if (minSize && newSize < parseFloat(minSize)) {
      newSize = parseFloat(minSize);
    }

    if (maxSize && newSize > parseFloat(maxSize)) {
      newSize = parseFloat(maxSize);
    }

    const newSizeString = `${newSize}px`;

    if (onSizeChange) {
      onSizeChange(newSizeString);
    } else {
      setInternalSize(newSizeString);
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        flex: initialized ? "0 0 auto" : "0 1 auto",
        position: "relative",
        ...sizeStyle,
        ...minConstraint,
        ...maxConstraint,
      }}
      id={id}
      className={className}
    >
      {children}
      <Handle
        direction={direction}
        defaultOnResize={handleResize}
        containerRef={panelRef}
        document={document}
      />
    </div>
  );
}

const ResizablePanel = {
  Group,
  Item,
  Handle,
  Panel,
};

export default ResizablePanel;
