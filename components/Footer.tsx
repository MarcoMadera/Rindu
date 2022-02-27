const Footer: React.FC = () => {
  return (
    <footer>
      <p>
        Hecho por{" "}
        <a
          href="https://marcomadera.com"
          rel="noreferrer noopener"
          target="_blank"
          translate="no"
        >
          Marco Madera
        </a>
      </p>
      <style jsx>{`
        footer {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 40px;
          background-color: #010101;
          color: #e5e5e5;
          padding: 10px;
        }
        p {
          margin: 0;
          text-align: center;
          text-align: center;
          color: #e5e5e5;
        }
        a {
          color: #e5e5e5;
          text-decoration: none;
        }
        a:hover {
          color: #1ed760;
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
