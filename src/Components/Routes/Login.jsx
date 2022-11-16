import { useNavigate } from "react-router-dom";

import Button from "../Button";

function Login() {
   const navigateTo = useNavigate();

   return (
      <>
         <h1 className="mainText taCenter">Login page</h1>
         <Button text="Home" onClick={() => { navigateTo("/"); }} />
      </>
   );
}

export default Login;