import LoginButton from "../components/login";
import Dashboard from "../components/dashboard";
import useAuth from "../hooks/useAuth";
export default function Home() {
  const { accessToken } = useAuth();

  return (
    <div>
      {!accessToken ? <LoginButton /> : <Dashboard />}
      <style jsx>{`
        div {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
