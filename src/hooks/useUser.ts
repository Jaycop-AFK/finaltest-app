import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext';

const useUser = () => useContext(AuthContext);

export default useUser;