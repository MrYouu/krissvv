import { Outlet } from "react-router-dom";

function NavigationBar() {
   return (
      <>
         <p className="mainText taCenter">Navigation bar</p>
         <Outlet />
      </>
   );
}

export default NavigationBar;