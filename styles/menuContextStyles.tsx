import css from "styled-jsx/css";

export const menuContextStyles = css`
  li :global(svg) {
    margin-left: 16px;
  }
  li :global(a),
  li :global(button) {
    text-decoration: none;
    color: #fff;
    cursor: default;
  }
  li {
    background-color: transparent;
    width: max-content;
    min-width: 100%;
    height: 40px;
    border: none;
    display: flex;
    align-content: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #ffffffe6;
    cursor: pointer;
    text-align: start;
    text-decoration: none;
    cursor: default;
    border-radius: 3px;
    align-items: center;
    width: 100%;
  }
  li > :global(:first-child) {
    background: none;
    border: none;
    padding: 8px 10px;
    width: 100%;
    text-align: start;
    display: flex;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    width: 100%;
    -webkit-box-orient: vertical;
    height: fit-content;
  }
  li:hover,
  li:focus {
    outline: none;
    background-color: #ffffff1a;
  }
`;
