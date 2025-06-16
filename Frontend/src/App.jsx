import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserContext from "./contexts/UserContext";

import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import { getJwt, getUser } from "./services/userServices";
import setAuthToken from "./utils/setAuthToken";

setAuthToken(getJwt());

const App = () => {
  const [user, setuser] = useState(null);
  useEffect(() => {
    try {
      const jwtUser = getUser();
      if (Date.now() >= jwtUser.exp * 1000) {
        localStorage.removeItem("token");
        location.reload();
      } else {
        setuser(jwtUser);
      }
    } catch (error) {}
  }, []);

  return (
    <UserContext.Provider value={user}>
      <div className=" min-h-screen grid grid-rows-[80px_auto] font-montserrat bg-[#f6f8fa]">
        <Navbar></Navbar>
        <main>
          <ToastContainer position="bottom-right" />
          <Routing />
        </main>
      </div>
    </UserContext.Provider>
  );
};

export default App;
