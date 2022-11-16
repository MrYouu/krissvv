import { useEffect, useRef } from "react";

import {
   faInfo, faCheck, faExclamation, faTimes, faFileAlt, faFileCode, faFilePowerpoint, faFileWord, faFileExcel, faFilePdf,
   faMobileAlt, faFileAudio, faFileVideo, faFileArchive
} from "@fortawesome/free-solid-svg-icons";

//* Alert variables
export const alertTypes = {
   info: "info",
   success: "success",
   warn: "warn",
   error: "error",
};
export const alertTitles = {
   info: "Info",
   success: "Success",
   warn: "Warn",
   error: "Error",
};
export const alertThemes = {
   lightTheme: "lightTheme",
   darkTheme: "darkTheme",
};
const alertIcons = {
   info: faInfo,
   success: faCheck,
   warn: faExclamation,
   error: faTimes,
};

//* Other variables
export const inputFieldTypes = {
   formElement: "formElement",
   inputFields: {
      textInput: "text",
      emailInput: "email",
      passwordInput: "password",
      phoneNumberInput: "forPhoneNumber",
      dropdown: "dropdown",
   },
};
export const countryCodesList = {
   1: {
      countryName: "United States of America (USA)",
      countryNameCode: "US",
      countryCode: 1,
      nationalPrefix: "",
      formatPhoneNumber(phoneNumber, includeCountryCode = false) {
         phoneNumber = phoneNumber.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll("+", "");
         phoneNumber = phoneNumber.replace(/^[a-zA-Z]+$/, " ");
         return `${includeCountryCode ? "+1 " : ""}${phoneNumber.replace(/^(\d{3})(\d{3})(\d+)$/, "($1)$2-$3").substring(0, 13)}`;
      },
   },
   359: {
      countryName: "Bulgaria",
      countryNameCode: "BG",
      countryCode: 359,
      nationalPrefix: "0",
      formatPhoneNumber(phoneNumber, includeCountryCode = false) {
         phoneNumber = phoneNumber.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll("+", "");
         phoneNumber = phoneNumber.replace(/^[a-zA-Z]+$/, " ");
         return `${includeCountryCode ? "+359 " : ""}${phoneNumber.replace(/^(\d{2})(\d{3})(\d+)$/, "$1 $2 $3").substring(0, 11)}`;
      },
   },
};
export const dateFormatTypes = {
   MMMMddyyyyhhmm: "MMMMddyyyyhhmm",
   MMMMddyyyy: "MMMMddyyyy",
   MMddyyyyhhmm: "MMddyyyyhhmm",
   MMddyyyy: "MMddyyyy",
   hhmm: "hhmm",
};
export const informBoxTypes = {
   empty: "empty",
};

let allAlerts = [];
let setAlert;
export function startAlerts(passedAllAlerts, passedSetAlert) {
   allAlerts = passedAllAlerts;
   setAlert = passedSetAlert;
}

export function createAlert(alertType = "", Message = "", onClick, alertTheme = alertThemes.darkTheme) {
   let newAlertID = Math.random();

   const newAlertData = {
      id: newAlertID,
      attributes: {
         alertType,
         Message,
         icon: alertIcons[alertType],
         colorTheme: alertTheme,
         closeFunction() { removeAlert(newAlertID) }
      },
   }

   if (onClick) newAlertData.attributes.onClick = () => { onClick() };

   setAlert([...allAlerts, newAlertData]);

   if (alertType !== alertTypes.error) setTimeout(() => removeAlert(newAlertID), 3 * 1000);

   return newAlertID;
}

export function removeAlert(alertID) {
   let newAllAlerts = [...allAlerts];
   newAllAlerts.splice(newAllAlerts.indexOf(newAllAlerts.find(thisAlert => thisAlert.id === alertID)), 1);
   setAlert(newAllAlerts);
}

export function comingSoonAlert(text = "") {
   createAlert(alertTypes.info, `${text ? text + " c" : "C"}oming soon`);
}

//* Form related functions
export function inputFieldError(formData = { elements: [] }, inputFieldName = "", errorMessage = "") {
   formData.elements = formData.elements.map(thisInputFieldData => {
      if (thisInputFieldData.type === inputFieldTypes.formElement) return thisInputFieldData;

      if (typeof inputFieldName === "string") {
         if (thisInputFieldData.attributes.name === inputFieldName) return { ...thisInputFieldData, errorMessage };

         return thisInputFieldData;
      }
      else {
         for (let index = 0; index < inputFieldName.length; index++)
            if (thisInputFieldData.attributes.name === inputFieldName[index]) return { ...thisInputFieldData, errorMessage };

         return thisInputFieldData;
      }
   });

   return formData;
}

export function removeAllInputFieldErrors(formData) {
   let duplicateFormData = { ...formData };

   for (let index = 0; index < formData.elements.length; index++)
      duplicateFormData = inputFieldError(duplicateFormData, formData.elements[index].name);

   return duplicateFormData;
}

export function catchFormErrors(errorElement, formData = {}) {
   if (errorElement.inputFieldsWithError) {
      let duplicateFormData = { ...formData };

      for (let index = 0; index < errorElement.inputFieldsWithError.length; index++)
         duplicateFormData = inputFieldError(duplicateFormData, errorElement.inputFieldsWithError[index].name, errorElement.inputFieldsWithError[index].message);

      return duplicateFormData;
   }
   else if (errorElement) {
      console.error(errorElement);
      createAlert(alertTypes.error, errorElement);
   }
}

export function getFormData(Form) {
   let formDataObject = new FormData(Form);
   let formData = {};
   for (let pair of formDataObject.entries()) formData[pair[0]] = pair[1];

   return formData;
}

//* Date related functions
export function getDate() {
   const dateObject = new Date();

   return parseInt(dateObject.getTime());
}

export function getFormattedDate(date, dateFormatType = dateFormatTypes.MMddyyyy, asObject = false) {
   if (!date) return "";

   const thisDate = new Date(parseInt(date));
   const thisDateFormatted = thisDate.toLocaleString("pt-BR"); // 20/08/2021 16:30:08

   const year = parseInt(thisDateFormatted.split(" ")[0].split("/")[2]);
   const month = parseInt(thisDateFormatted.split(" ")[0].split("/")[1]);
   const day = parseInt(thisDateFormatted.split(" ")[0].split("/")[0]);
   const hour = parseInt(thisDateFormatted.split(" ")[1].split(":")[0]);
   const minutes = parseInt(thisDateFormatted.split(" ")[1].split(":")[1]);
   const seconds = parseInt(thisDateFormatted.split(" ")[1].split(":")[2]);
   const weekDay = thisDate.getDay();

   const timeClockText = `${hour}:${minutes < 10 ? "0" + minutes : minutes}`;

   let formattedDate;
   switch (dateFormatType) {
      case dateFormatTypes.MMMMddyyyyhhmm:
         formattedDate = `${getMonthText(month)} ${day}, ${year} ${timeClockText}`;
         break;

      case dateFormatTypes.MMMMddyyyy:
         formattedDate = `${getMonthText(month)} ${day}, ${year}`;
         break;

      case dateFormatTypes.MMddyyyyhhmm:
         formattedDate = `${getMonthText(month, true)} ${day}, ${year} ${timeClockText}`;
         break;

      case dateFormatTypes.MMddyyyy:
         formattedDate = `${getMonthText(month, true)} ${day}, ${year}`;
         break;

      case dateFormatTypes.hhmm:
         formattedDate = `${timeClockText}`;
         break;

      default:
         formattedDate = "";
         break;
   }

   return asObject ? {
      year: year,
      month: month,
      day: day,
      weekDay,
      hour: hour < 10 ? "0" + hour : hour,
      minutes: minutes < 10 ? "0" + minutes : minutes,
      seconds: seconds < 10 ? "0" + seconds : seconds,
   } : formattedDate;
}

export function getMonthText(monthIndex = 1, shortForm = false) {
   const month = [];
   month[1] = shortForm ? "Jan" : "January";
   month[2] = shortForm ? "Feb" : "February";
   month[3] = shortForm ? "Mar" : "March";
   month[4] = shortForm ? "Apr" : "April";
   month[5] = shortForm ? "May" : "May";
   month[6] = shortForm ? "Jun" : "June";
   month[7] = shortForm ? "Jul" : "July";
   month[8] = shortForm ? "Aug" : "August";
   month[9] = shortForm ? "Sep" : "September";
   month[10] = shortForm ? "Oct" : "October";
   month[11] = shortForm ? "Nov" : "November";
   month[12] = shortForm ? "Dec" : "December";

   return month[parseInt(monthIndex)];
}

export function getDayText(dayIndex = 1, shortForm = false) {
   const weekDay = [];
   weekDay[0] = shortForm ? "Sun" : "Sunday";
   weekDay[1] = shortForm ? "Mon" : "Monday";
   weekDay[2] = shortForm ? "Tue" : "Tuesday";
   weekDay[3] = shortForm ? "Wed" : "Wednesday";
   weekDay[4] = shortForm ? "Thu" : "Thursday";
   weekDay[5] = shortForm ? "Fri" : "Friday";
   weekDay[6] = shortForm ? "Sat" : "Saturday";

   return weekDay[parseInt(dayIndex)];
}

export function getDateDifference(dateNumber1, dateNumber2) {
   return (dateNumber2 - dateNumber1) / (1000 * 3600 * 24);
}

export function areSameDateDay(dateNumber1, dateNumber2) {
   const date1 = new Date(dateNumber1);
   const date2 = new Date(dateNumber2);

   if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()) return true;
   else return false;
}

//* File related functions
export function getFileType(file) {
   return file.type.split("/")[0];
}

export function getFileExtension(file) {
   let fileName = file.name;
   if (typeof file === "string") fileName = file;

   return fileName.substring(fileName.lastIndexOf(".") + 1);
}

export function getFileSize(file, readable = false) {
   if (typeof file !== "number") {
      let fileSize = file.size;

      if (!readable) return fileSize;
      return getFileSizeReadable(fileSize);
   }
   else return getFileSizeReadable(file);

   function getFileSizeReadable(number) {
      if (number < 1024) return `${Math.round((number) * 100) / 100} B`;
      else if (number / 1024 < 1024) return `${Math.round((number / 1024) * 100) / 100} KB`;
      else if (number / 1048576 < 1024) return `${Math.round((number / 1048576) * 100) / 100} MB`;
      else if (number / 1073741824 < 1024) return `${Math.round((number / 1073741824) * 100) / 100} GB`;
      return `${Math.round((number / 1099511627776) * 100) / 100} TB`;
   }
}

export function getFileIcon(fileExtension) {
   if (typeof fileExtension !== "string") fileExtension = getFileExtension(fileExtension);

   let codeFileExtensions = ["html", "js", "json", "cs", "css", "py", "php", "xml"];
   let powerPointFileExtensions = ["pptx", "pptm", "ppt", "potx", "potm", "ppsx", "ppsm", "pps", "ppam", "ppa"];
   let wordFileExtensions = ["docx", "docm", "doc", "dotx", "dotm", "dot"];
   let excelFileExtensions = ["xlsx", "xlsm", "xlsb", "xls", "xltx", "xltm", "xlt"];
   let audioFileExtensions = [
      "aa", "aac", "aax", "act", "aiff", "alac", "amr", "ape", "au", "awb", "dss", "dvf", "flac", "gsm", "iklax", "ivs", "m4a", "m4b",
      "m4p", "mmf", "mp3", "mpc", "msv", "nmf", "ogg", "oga", "mogg", "opus", "ra", "rm", "raw", "rf64", "sln", "tta", "voc", "vox", "wav",
      "wma", "wv", "webm", "8svx", "cd"
   ];
   let videoFileExtensions = [
      "avchd", "webm", "mkv", "flv", "vob", "ogv", "ogg", "drc", "mng", "avi", "MTS", "M2TS", "TS", "mov", "wmv", "yuv", "rm", "rmvb",
      "viv", "asf", "amv", "mp4", "m4p", "m4v", "mpg", "mp2", "mpeg", "mpe", "mpv", "m2v", "svi", "3gp", "3g2", "mxf", "roq", "nsv",
      "f4v", "f4p", "f4a", "f4b",
   ];
   let archiveFileExtensions = [
      "7zip", "gzip", "rar"
   ];

   if (codeFileExtensions.includes(fileExtension)) return faFileCode;
   if (audioFileExtensions.includes(fileExtension)) return faFileAudio;
   if (videoFileExtensions.includes(fileExtension)) return faFileVideo;
   if (archiveFileExtensions.includes(fileExtension)) return faFileArchive;
   if (powerPointFileExtensions.includes(fileExtension)) return faFilePowerpoint;
   if (wordFileExtensions.includes(fileExtension)) return faFileWord;
   if (excelFileExtensions.includes(fileExtension)) return faFileExcel;
   if (fileExtension === "pdf") return faFilePdf;
   if (fileExtension === "apk") return faMobileAlt;

   return faFileAlt;
}

//* Data getters
export function getColorHexFromString(stringKey = "") {
   let hashValue = 0;
   let color = "#";

   if (stringKey.length === 0) return hashValue;

   for (let index = 0; index < stringKey.length; index++) {
      hashValue = stringKey.charCodeAt(index) + ((hashValue << 5) - hashValue);
      hashValue = hashValue & hashValue;
   }

   for (let index = 0; index < 3; index++) {
      let value = (hashValue >> (index * 8)) & 255;
      color += ("00" + value.toString(16)).slice(-2);
   }

   return color;
}

export function getColorHexFromPercentage(percentage = 0) {
   let rValue, gValue, bValue = 0;

   if (percentage < 50) {
      rValue = 255;
      gValue = Math.round(5.1 * percentage);
   }
   else {
      gValue = 255;
      rValue = Math.round(510 - 5.10 * percentage);
   }

   let hashValue = rValue * 0x10000 + gValue * 0x100 + bValue * 0x1;
   return "#" + ("000000" + hashValue.toString(16)).slice(-6);
}

export function getRandomString(Length) {
   let Result = "";
   const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (let index = 0; index < Length; index++) Result += Characters.charAt(Math.floor(Math.random() * Characters.length));

   return Result;
}

//* Use functions
export function useHorizontalScroll() {
   const elementRef = useRef();
   useEffect(() => {
      const thisElements = elementRef.current;

      if (thisElements) {
         const onWheel = event => {
            if (event.deltaY === 0) return;

            thisElements.scrollTo({
               left: thisElements.scrollLeft + event.deltaY,
               behavior: "smooth"
            });
         };
         thisElements.addEventListener("wheel", onWheel, { passive: true });

         return () => thisElements.removeEventListener("wheel", onWheel);
      }
   }, []);

   return elementRef;
}

//* Other
export function capitalizeWord(thisWord) {
   return thisWord.charAt(0).toUpperCase() + thisWord.slice(1);
}

export function formatPhoneNumber(fullPhoneNumber = "", includeCountryCode = false) {
   if (fullPhoneNumber.length > 10) {
      const phoneNumber = fullPhoneNumber.slice(-10);
      const phoneNumber2 = fullPhoneNumber.slice(-9);
      const phoneNumberCountryCode = fullPhoneNumber.slice(0, -10);
      const phoneNumberCountryCode2 = fullPhoneNumber.slice(0, -9);

      if (countryCodesList[phoneNumberCountryCode]) return countryCodesList[phoneNumberCountryCode].formatPhoneNumber(phoneNumber, includeCountryCode);
      else if (countryCodesList[phoneNumberCountryCode2]) return countryCodesList[phoneNumberCountryCode2].formatPhoneNumber(phoneNumber2, includeCountryCode);
      else return `+${phoneNumberCountryCode} ${phoneNumber}`;
   }
   else return fullPhoneNumber;
}

export function deformatPhoneNumber(phoneNumber) {
   return phoneNumber.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll("+", "");
}

export function sortArrayOfObject(arrayToSort, objectKey) {
   function byString(Object, stringPathKey) {
      stringPathKey = stringPathKey.replace(/\[(\w+)\]/g, ".$1");
      stringPathKey = stringPathKey.replace(/^\./, "");

      const stringPathElements = stringPathKey.split(".");

      for (let index = 0; index < stringPathElements.length; ++index) {
         const thisPathString = stringPathElements[index];

         if (thisPathString in Object) Object = Object[thisPathString];
         else return;
      }

      return Object;
   }

   return arrayToSort.sort((a, b) => {
      if (typeof objectKey == "string") return byString(a, objectKey).toString().localeCompare(byString(b, objectKey));
      else return byString(a, objectKey) - byString(b, objectKey);
   });
}

export function deepObjectMerge(mainObject, ...secondaryObjects) {
   if (!secondaryObjects.length) return mainObject;

   const thisSecondaryObject = secondaryObjects.shift();
   if (isObject(mainObject) && isObject(thisSecondaryObject)) {
      for (const key in thisSecondaryObject) {
         if (isObject(thisSecondaryObject[key])) {
            if (!mainObject[key]) Object.assign(mainObject, { [key]: {} });

            deepObjectMerge(mainObject[key], thisSecondaryObject[key]);
         }
         else Object.assign(mainObject, { [key]: thisSecondaryObject[key] });
      }
   }

   return deepObjectMerge(mainObject, ...secondaryObjects);

   function isObject(element) {
      return (element && typeof element === "object" && !Array.isArray(element));
   }
}

export function copyText(text) {
   navigator.clipboard.writeText(text);
}

export function URLfy(text) {
   return text.replace(/((https?:\/\/)|(www\.))?[^\s]+[.][^\s]+/g, URL => {
      return `<a href="${URL.match(/(https?:\/\/)[^\s]+/) ? URL : "https://" + URL}" target="_blank">${URL}</a>`;
   });
}