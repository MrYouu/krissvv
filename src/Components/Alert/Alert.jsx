import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { alertTypes, alertTitles } from "../../Utilities/services";

const Alert = ({ alertType = alertTypes.info, Message = "Message text", onClick, closeFunction = () => { }, icon, colorTheme = "" }) => {
   const onClickHandler = event => {
      onClick && onClick(event);
      onClick && closeFunction();
   }

   const closeHandler = event => {
      event.stopPropagation();
      closeFunction();
   }

   return (
      <div className={`Alert ${colorTheme} ${alertType}${onClick ? " withHover" : ""}`} onClick={onClickHandler}>
         <FontAwesomeIcon className="alertIcon" icon={icon} size="6x" />
         <div className="alertContent">
            <h3 className="mainText total">{alertTitles[alertType]}</h3>
            <p className="normalText total">{Message}</p>
         </div>
         <p className="alertCloseButton normalText total fs12" onClick={closeHandler}>CLOSE</p>
      </div>
   );
}

export default Alert;