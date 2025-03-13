import { useState, createContext, ReactNode, useEffect } from "react";
import { IUser } from "../interfaces/user.interface";
import { Box } from "@mui/material";
import { axiosInstance } from "../hooks/axiosRequest";

interface AuthContextType {
  data: IUser | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
  refreshSelf: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  data: null,
  saveToken: () => { },
  removeToken: () => { },
  refreshSelf: () => { },
});


export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/users/self");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const saveToken = async (token: string) => {
    setLoading(true);
    try {
      await localStorage.setItem("token", token);
      const response = await axiosInstance.get("/users/self");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const removeToken = async () => {
    setLoading(true);
    try {
      await localStorage.removeItem("token");
      setData(null);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const refreshSelf = async () => {
    try {
      const user = await axiosInstance.get("/user/self");
      setData(user.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2rem",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ data, saveToken, removeToken, refreshSelf }}>
      {children}
    </AuthContext.Provider>
  );
}