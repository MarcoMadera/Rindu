const PlaylistCard = ({ images, name, noPrivate, tracks, description }) => {
  return (
    <article>
      <img src={images[1]?.url ?? images[0]?.url} alt={name} />
      <h2>{name}</h2>
      {description ? <p>{description}</p> : null}
      <span>canciones: {tracks.total}</span>
      <p>{noPrivate ? "Pública" : "Privada"}</p>
      <style jsx>{`
        article {
          border-radius: 6px;
          padding: 20px;
          background-color: #111111;
        }
        img {
          width: 100%;
        }
      `}</style>
    </article>
  );
};

export default PlaylistCard;
