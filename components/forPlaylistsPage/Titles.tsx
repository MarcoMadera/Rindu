import Clock from "components/icons/Clock";
import {
  Dispatch,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

export default function Titles({
  setIsPin,
}: {
  setIsPin: Dispatch<SetStateAction<boolean>>;
}): ReactElement {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const cachedRef = ref.current,
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRect.top >= 60) {
            setIsPin(true);
          } else {
            setIsPin(false);
          }
        },
        {
          rootMargin: `0px 0px -${window.innerHeight - 60}px 0px`,
        }
      );

    observer.observe(cachedRef as Element);

    return function () {
      observer.unobserve(cachedRef as Element);
    };
  });

  return (
    <div
      id="titlesObserver"
      className="titles"
      ref={ref as MutableRefObject<HTMLDivElement>}
    >
      <span>#</span>
      <span>TITLE</span>
      <span>ALBUM</span>
      <span>DATE ADDED</span>
      <span>
        <Clock />
      </span>
    </div>
  );
}
