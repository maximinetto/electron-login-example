import { User } from "@prisma/client";

export default function checkSession() {
  return new Promise((resolve, reject) => {
    window.ipcRenderer.send("check-session"); // Envía una solicitud al proceso principal
    window.ipcRenderer.once(
      "session-reply",
      (
        _event,
        sessionData: { isAuthenticated: boolean; user: Omit<User, "password"> }
      ) => {
        if (sessionData && sessionData.isAuthenticated) {
          resolve(sessionData); // La sesión está autenticada
        } else {
          reject(new Error("La sesión no está autenticada")); // La sesión no está autenticada
        }
      }
    );
  });
}
