import css from "styled-jsx/css";

interface ButtonProps {
  type?: "link" | "normal";
  variant: "submit" | "cancel" | "normal";
  [x: string]: unknown;
}
const Button: React.FC<ButtonProps> = ({
  variant,
  type,
  children,
  ...atbr
}) => {
  const backgroundColor =
    variant === "cancel" ? "red" : variant === "submit" ? "#1db954" : "#1db954";
  const borderRadius = variant === "normal" ? "500px" : "6px";
  const minWidth = variant === "normal" ? "160px" : "60px";

  if (type === "link") {
    return (
      <a {...atbr}>
        <style jsx>{styleButton}</style>
        <style jsx>{`
          button {
            border-radius: ${borderRadius};
            background-color: ${backgroundColor};
            min-width: ${minWidth};
          }
        `}</style>
      </a>
    );
  }
  return (
    <button {...atbr}>
      {children}
      <style jsx>{styleButton}</style>
      <style jsx>{`
        button {
          border-radius: ${borderRadius};
          background-color: ${backgroundColor};
          min-width: ${minWidth};
        }
      `}</style>
    </button>
  );
};

export default Button;

const styleButton = css`
  button {
    display: inline-block;
    color: #fff;
    font-family: sans-serif;
    font-size: 14px;
    line-height: 1;
    padding: 9px 12px 8px;
    transition-property: background-color, border-color, color, box-shadow,
      filter;
    transition-duration: 0.3s;
    border-width: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: normal;
    text-decoration: none;
    width: max-content;
    margin: 0 auto;
    cursor: pointer;
  }
`;
