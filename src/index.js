import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { UserProvider } from "./Contexts/UserContext.context";

import App from "./App";

import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
   <StrictMode>
      <BrowserRouter>
         <UserProvider>
            <App />
         </UserProvider>
      </BrowserRouter>
   </StrictMode>
);