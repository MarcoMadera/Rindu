import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { __isServer__ } from "utils/constants";

export default function RouterButtons(): ReactElement {
  const router = useRouter();
  const [backRoutes, setBackRoutes] = useState<string[]>([]);
  // const [forwardRoutes, setForwardRoutes] = useState<string[]>([]);
  const [clickback, setclickback] = useState(false);
  const [disableButtons, setDisableButtons] = useState(
    __isServer__ || !window.history.length
  );

  useEffect(() => {
    if (!backRoutes.includes(router.asPath) && !clickback) {
      setBackRoutes([]);
    }
    setclickback(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  useEffect(() => {
    setDisableButtons(!window.history.length);
  }, []);

  console.log(backRoutes);

  return (
    <div className="routerButtons">
      <button
        onClick={() => {
          console.log("click back", router);
          setclickback(true);
          router.back();
          setBackRoutes((routes) => [...routes, router.asPath]);
        }}
        disabled={disableButtons}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          if (backRoutes[0]) {
            router.push(backRoutes[0]);
          }
          setBackRoutes((routes) => {
            const allbackroutes = [...routes];
            console.log("routes in forward", allbackroutes);
            allbackroutes.shift();
            return allbackroutes;
          });
        }}
        disabled={!backRoutes[0]}
      >
        {">"}
      </button>
    </div>
  );
}
