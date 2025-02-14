import React, { useEffect, useState } from "react";
import { LoginContext } from "./LoginContext";
import { getLogin } from "../backend/api"; 
import { LoginResource } from "../Resources";

export function LoginManager({ children }: { children: React.ReactNode }) {
  const [loginInfo, setLoginInfo] = useState<LoginResource | false | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const loginStatus = await getLogin();
        setLoginInfo(loginStatus); 
      } catch (error) {
        console.error("Login-Status:", error);
        setLoginInfo(false);
      }
    })();
  }, []);

  return (
    <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
      {children}
    </LoginContext.Provider>
  );
}
