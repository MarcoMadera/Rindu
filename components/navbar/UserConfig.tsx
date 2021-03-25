interface UserConfigProps {
  name: string | undefined;
  img: string | undefined;
  href: string;
}

const UserConfig: React.FC<UserConfigProps> = ({ name, img, href }) => {
  function handleClick() {
    console.log(href);
  }
  return (
    <button onClick={handleClick}>
      <img src={img} alt={name} />
      <p>{name}</p>
      <style jsx>{`
        button {
          display: flex;
          align-items: center;
          background-color: #161616;
          padding: 6px 6px;
          border: none;
          cursor: pointer;
          border-radius: 30px;
          text-decoration: none;
          padding: 3px 4px;
          color: #e5e5e5;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        p {
          margin: 0;
          padding: 8px 17px 8px 4px;
          font-family: "Lato";
        }
      `}</style>
    </button>
  );
};

export default UserConfig;
