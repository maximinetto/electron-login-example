import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.ipcRenderer.on(
      "login-fail",
      (
        _event,
        {
          isAuthenticated,
          message,
        }: { isAuthenticated: boolean; message: string }
      ) => {
        if (!isAuthenticated) return setError(message);
      }
    );
  }, []);

  useEffect(() => {
    window.ipcRenderer.once("login-success", () => {
      navigate("/");
    });
  }, [navigate]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    window.ipcRenderer.send("login", { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <span className={styles.error}>{error}</span>
      </div>
      <div>
        <label htmlFor="username">Usuario:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </div>
      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
}
