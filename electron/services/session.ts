// En el proceso principal
import { User } from "@prisma/client";
import { ipcMain } from "electron";
import prisma from "../db/client";
import compareStrings from "./compareStrings";

const session: {
  isAuthenticated: boolean;
  user: Omit<User, "password"> | null;
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
    const isValid = await validateUser(username, password);
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

async function validateUser(username: string, password: string) {
  const invalidCredentials = () => {
    clearSession();
    return false;
  };

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return invalidCredentials();

  const matches = await compareStrings(password, user.password);
  if (!matches) return invalidCredentials();

  const userWithoutPassword: Partial<User> = { ...user };
  delete userWithoutPassword.password;
  session.isAuthenticated = true;
  session.user = user;
  return true;
}

function clearSession() {
  session.isAuthenticated = false;
  session.user = null;
}
