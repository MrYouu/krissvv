import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Button({ text = "Click", icon, onClick = () => { }, className = "" }) {
   return (
      <div onClick={onClick} className={`Button${className !== "" ? " " + className : ""}`}>
         {icon && <FontAwesomeIcon icon={icon} size="6x" />}
         {text}
      </div>
   );
}

export default Button;