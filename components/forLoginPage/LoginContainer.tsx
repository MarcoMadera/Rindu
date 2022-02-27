import LoginButton from "./LoginButton";

const LoginContainer: React.FC = () => {
  return (
    <div>
      <h2>Limpia tus playlists</h2>
      <p>Remueve canciones duplicadas e invisibles</p>
      <LoginButton />
      <style jsx>{`
        div {
          width: 430px;
          text-align: center;
          padding: 24px;
          background-color: #111111;
          border-radius: 10px;
        }
        h2 {
          font-weight: bold;
          margin: 0;
        }
        p {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};
export default LoginContainer;
