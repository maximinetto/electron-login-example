// En el proceso principal
import { User } from "@prisma/client";
import { ipcMain } from "electron";
import validateUser from "./validateUser";

const session: {
  isAuthenticated: boolean;
  user: Partial<Omit<User, "password">> | null;
} = {
  isAuthenticated: false,
  user: null,
}; // Variable para rastrear el estado de autenticación

ipcMain.on(
  "login",
  async (
    event,
    { username, password }: { username: string; password: string }
  ) => {
    const isValid = await validateSession(username, password);
    if (isValid) {
      event.sender.send("login-success", {
        isAuthenticated: true,
        userData: session.user,
      });
    }
    {
      event.sender.send("login-fail", {
        isAuthenticated: session.isAuthenticated,
        message: "Usuario y/o contraseña incorrectos",
      });
    }
  }
);

ipcMain.on("check-session", (event) => {
  // Verificar la autenticación de alguna manera
  if (session.isAuthenticated) {
    // Si la sesión está autenticada, envía la información de la sesión de vuelta al proceso de renderizado
    event.sender.send("session-reply", {
      isAuthenticated: session.isAuthenticated,
      userData: session.user,
    }); // Puedes incluir datos del usuario si es necesario
  } else {
    // Si la sesión no está autenticada, envía una respuesta de no autenticado
    event.sender.send("session-reply", {
      isAuthenticated: session.isAuthenticated,
    });
  }
});

async function validateSession(username: string, password: string) {
  const invalidCredentials = () => {
    clearSession();
    return false;
  };

  const [isValid, user] = await validateUser(username, password);

  if (!isValid) return invalidCredentials();
  session.isAuthenticated = true;
  session.user = user;
  return true;
}

function clearSession() {
  session.isAuthenticated = false;
  session.user = null;
}
