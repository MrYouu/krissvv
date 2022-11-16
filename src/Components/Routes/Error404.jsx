import { useNavigate } from "react-router-dom";

import Button from "../Button";

function Error404() {
   const navigateTo = useNavigate();

   return (
      <>
         <h1 className="mainText taCenter">Page 404</h1>
         <Button text="Home" onClick={() => { navigateTo("/"); }} />
      </>
   );
}

export default Error404;