import useAuth from "hooks/useAuth";
import Link from "next/link";
import { ReactElement } from "react";

export default function Logo(): ReactElement {
  const { isLogin } = useAuth();
  return (
    <>
      <Link href={isLogin ? "/dashboard" : "/"}>
        <a translate="no">Rindu</a>
      </Link>
      <style jsx>{`
        a {
          font-size: 36px;
          font-family: "Lato";
          width: 148px;
          color: #fff;
          margin: 0;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
