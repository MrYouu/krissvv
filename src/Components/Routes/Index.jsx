import { useNavigate } from "react-router-dom";

import Button from "../Button";

function Index() {
   const navigateTo = useNavigate();

   return (
      <>
         <h1 className="mainText taCenter">Home page</h1>
         <div className="buttonsHolder">
            <Button text="Log in" onClick={() => { navigateTo("/login"); }} />
            <Button text="User" onClick={() => { navigateTo("/user"); }} />
         </div>
      </>
   );
}

export default Index;