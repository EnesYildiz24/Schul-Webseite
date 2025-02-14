import React from "react";
import { LoginResource } from "../Resources";

export interface LoginContextType {
 loginInfo: LoginResource | false | undefined;
  setLoginInfo: (loginInfo: LoginResource | false) => void;
}
export const LoginContext = React.createContext<LoginContextType>({} as LoginContextType);

export const useLoginContext = () => React.useContext(LoginContext); 
