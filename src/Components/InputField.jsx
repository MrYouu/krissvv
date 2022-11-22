import { inputFieldTypes } from "../Utilities/services";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";

const InputField = ({
   attributes = {
      required: false,
      placeholder: "Text",
   },
   infoText = "",
   icon,
   errorMessage = "",
   type = inputFieldTypes.inputFields.textInput,
   onChange = () => { },
   refElement,
}) => {
   if (type === inputFieldTypes.inputFields.phoneNumberInput) {
      attributes.type = "text";
      attributes.placeholder = "phone number";
   }

   const onChangeHandler = event => {
      onChange(event);
   }

   return (
      <>
         {
            type === inputFieldTypes.inputFields.phoneNumberInput &&
            (
               <div>
                  {infoText !== "" && <p className={`normalText weUnder${attributes.required ? " required" : ""}`}>{infoText}</p>}
                  <PhoneInput
                     country="us"
                     onlyCountries={["us", "ca", "bg"]}
                     preferredCountries={["us"]}
                     placeholder="Phone number"
                     inputProps={{
                        ...attributes
                     }}
                     masks={{ bg: ".. ... ...." }}
                     value={attributes.defaultValue ? attributes.defaultValue : ""}
                     containerClass="inputField"
                     inputClass="inputFieldPhoneNumber"
                     buttonClass="inputFieldPhoneNumberDropdown"
                     dropdownClass="inputFieldPhoneNumberDropdownContent"
                  />
                  {errorMessage !== "" && <p className="normalText inputFieldErrorText">{errorMessage}</p>}
               </div>
            )
         }
         {
            type !== inputFieldTypes.inputFields.phoneNumberInput &&
            (
               <div className={`inputField${attributes.disabled ? " Disabled" : ""}${errorMessage !== "" ? " withError" : ""}${icon && type !== inputFieldTypes.inputFields.phoneNumberInput ? " withLeftIcon" : ""}${type ? " " + type : ""}`}>
                  {infoText !== "" && <p className={`normalText free weUnder${attributes.required ? " required" : ""}`}>{infoText}</p>}
                  <div className="inputFieldHolder">
                     <input {...attributes} aria-label={infoText} onChange={onChangeHandler} ref={refElement} />
                     {icon && type !== inputFieldTypes.inputFields.phoneNumberInput && <FontAwesomeIcon icon={icon} className="inputFieldIcon" size="6x" />}
                  </div>
                  {errorMessage !== "" && <p className="normalText total inputFieldErrorText">{errorMessage}</p>}
               </div>
            )
         }
      </>
   );
}

export default InputField;