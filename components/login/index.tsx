import LoginContainer from "./LoginContainer";

const Login: React.FC = () => {
  return (
    <main>
      <section>
        <div>
          <h2>En qué casos te ayuda Rindu:</h2>
          <ul>
            <li>
              Si tu playlist tiene tracks duplicados:
              <p>
                Ya sea si tienes un bot que añade track y te ha estado añadiendo
                los mismos, Rindu elimina esos tracks que están de más y deja
                solo uno.
              </p>
            </li>
            <li>
              Si tienes canciones invisibles:
              <p>
                Al agregar canciones a una playlist, puede que falle en
                agregarse, por lo que queda un espacio guardado sin datos. Esto
                lo identificas si el total de canciones de una playlist no
                concuerda con el último número de la lista. En Spotify versión
                esto puede causar una duplicación visual de un track.
              </p>
            </li>
          </ul>
          <video
            src="https://res.cloudinary.com/marcomadera/video/upload/c_scale,w_650/v1615173210/Blog/Code%20Snippets%20en%20VSCode/generalSnippet_peoxlp.mp4"
            title="Snippet general"
            muted
            loop
            autoPlay
            playsInline
          >
            Tu navegador no soporta videos
          </video>
        </div>
      </section>
      <section>
        <LoginContainer />
      </section>
      <style jsx>
        {`
          main {
            min-height: calc(100vh - 174px);
            width: 100vw;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-gap: 20px;
            padding: 0 100px;
          }
          section {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          div {
            padding: 24px;
            background-color: #111111;
            border-radius: 10px;
            width: 100%;
          }
          li {
            font-size: 24px;
            list-style-type: circle;
          }
          p {
            font-size: 18px;
            line-height: 1.6;
          }
          h2 {
            font-size: 36px;
            font-weight: 400;
            margin-top: 0;
          }
          ul {
            padding-left: 20px;
          }
          video {
            width: 100%;
          }
        `}
      </style>
    </main>
  );
};

export default Login;
