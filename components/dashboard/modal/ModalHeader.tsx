import { Dispatch, SetStateAction } from "react";

interface ModalHeaderProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ setIsModalOpen }) => {
  return (
    <header>
      <div></div>
      <h2>Encontramos los siguientes Tracks</h2>
      <button onClick={() => setIsModalOpen(false)}>
        <span></span>
      </button>
      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }
        button {
          border: none;
          border-radius: 50%;
          background-color: #151414;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          cursor: pointer;
        }
        span {
          background: #d2d2d2;
          height: 40px;
          position: relative;
          width: 2px;
          transform: rotate(45deg);
        }
        span:after {
          content: "";
          background: #d2d2d2;
          height: 2px;
          left: -20px;
          position: absolute;
          top: 20px;
          width: 40px;
        }
      `}</style>
    </header>
  );
};

export default ModalHeader;
