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
          display: block;
          padding: 1em 0;
          margin-top: 80px;
        }
        p {
          margin: 0;
          text-align: center;
          font-size: 18px;
          text-align: center;
          color: #e5e5e5;
        }
        a {
          color: #e5e5e5;
          text-decoration: none;
        }
        a:hover {
          color: #ef2c2c;
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
