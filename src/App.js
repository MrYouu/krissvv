import { Routes, Route } from "react-router-dom";

import NavigationBar from "./Components/NavigationBar";
import Index from "./Components/Routes/Index";
import Prices from "./Components/Routes/Prices";
import Login from "./Components/Routes/Login";
import Error404 from "./Components/Routes/Error404";

import FriendsChristmas from "./Components/Routes/FriendsChristmas";

function App() {
   return (
      <Routes>
         <Route path="/" element={<NavigationBar />}>
            <Route index element={<Index />} />
            <Route path="prices" element={<Prices />} />
            {
               //* Log in page
               ["login", "Login", "logIn", "LogIn"].map(routeName => {
                  return <Route path={routeName} element={<Login />} key={routeName} />;
               })
            }

         </Route>
         <Route path="friendsChristmas" element={<FriendsChristmas />} />
         <Route path="*" element={<Error404 />} />
      </Routes>
   );
}

export default App;