import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter, redirect } from "react-router-dom";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import "./index.css";
import checkSession from "./session/check.ts";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    loader: async () => {
      try {
        await checkSession();
        return null;
      } catch (error) {
        return redirect("/login");
      }
    },
  },
  {
    path: "/login",
    element: <Login />,
    loader: async () => {
      try {
        await checkSession();
        return redirect("/");
      } catch (error) {
        return null;
      }
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
