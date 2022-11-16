import { createUserWithEmail, deleteUser, setDocument, updateDocument, deleteDocument, removeValue, queryCollection, arrayAdd, arrayRemove, logInWithEmail } from "./Firebase";
import { dateFormatTypes, getRandomString, formatPhoneNumber, getDate, deepObjectMerge, userRightsList, getFormattedDate } from "./services";

import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";

import ImageTextListElement from "../Components/ImageTextListElement";
import Button from "../Components/Button";

export function newEmployee({ name, position, phoneNumber, address, email, password }, inCompanyID) {
   let canReturnResponse = [];

   return new Promise((resolve, reject) => {
      phoneNumber = phoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      queryCollection("Users/", [
         {
            key: "user.email",
            value: email,
            operation: "==",
         },
      ]).then(employeesWithSameEmail => {
         const haveOther = Object.keys(employeesWithSameEmail).length !== 0;

         if (haveOther) return reject({
            inputFieldsWithError: [
               {
                  name: "email",
                  message: "The email is already in use",
               },
            ],
         });

         const newUserData = {
            accountType: "employee",
            createdAt: getDate(),
            id: null,
            inCompany: inCompanyID,
            user: {
               address,
               displayName: name,
               email,
               password,
               phoneNumber,
               position,
            },
         };

         //* Create the new employee account
         createUserWithEmail(email, password, true).then(newUser => {
            newUserData.id = newUser.uid;

            //* Save the new employee account data
            setDocument(`Users/${newUserData.id}`, newUserData).then(res => {
               canReturnResponse.push(null);
               returnResponse();
            }).catch(error => {
               return reject(error);
            });

            //* Update the company employee list
            updateDocument(`Companies/${inCompanyID}`, {
               employees: arrayAdd(newUserData.id),
            }).then(res => {
               canReturnResponse.push(null);
               returnResponse();
            }).catch(error => {
               return reject(error);
            });
         });

         function returnResponse() {
            if (canReturnResponse.length < 2) return;

            return resolve({ newUserData });
         }
      });
   });
}

export function editEmployee(thisEmployeeData, { name, position, phoneNumber, address }) {
   return new Promise((resolve, reject) => {
      phoneNumber = phoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      const editedUserData = {
         user: {
            address,
            displayName: name,
            phoneNumber,
            position,
         },
      };

      //* Update the edited employee account data
      updateDocument(`Users/${thisEmployeeData.id}`, {
         "user.address": address,
         "user.displayName": name,
         "user.phoneNumber": phoneNumber,
         "user.position": position,
      }).then(res => {
         return resolve({ editedUserData });
      }).catch(error => {
         return reject(error);
      });
   });
}

export function deleteEmployee(thisEmployeeData) {
   let canReturnResponse = [];

   return new Promise((resolve, reject) => {
      //* Re-authenticate user
      logInWithEmail(thisEmployeeData.user.email, thisEmployeeData.user.password, true).then(thisUser => {
         //* Delete user account
         deleteUser(thisUser).then(() => {
            //* Update the company employee list
            updateDocument(`Companies/${thisEmployeeData.inCompany}`, {
               employees: arrayRemove(thisEmployeeData.id),
            }).then(res => {
               canReturnResponse.push(null);
               returnResponse();
            }).catch(error => {
               return reject(error);
            });

            //* Delete the employee data
            deleteDocument(`Users/${thisEmployeeData.id}`).then(res => {
               canReturnResponse.push(null);
               returnResponse();
            }).catch(error => {
               return reject(error);
            });
         }).catch(error => {
            return reject(error);
         });
      }).catch(error => {
         return reject(error);
      });


      function returnResponse() {
         if (canReturnResponse.length < 2) return;

         return resolve({ deletedEmployeeData: thisEmployeeData });
      }
   });
}

export function newCompany({ companyName, companyIndustry, companyAddress, ownerName, ownerPhoneNumber, ownerEmail, ownerPassword }, companiesList, companyOwnersList) {
   return new Promise((resolve, reject) => {
      ownerPhoneNumber = ownerPhoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      const haveOther = Object.values(companiesList).find(thisCompanyData => {
         return companyOwnersList[thisCompanyData.userID].user.email === ownerEmail;
      });

      if (haveOther) return reject({
         inputFieldsWithError: [
            {
               name: "ownerEmail",
               message: "The email is already in use",
            },
         ],
      });

      const newCompanyID = getRandomString(28);
      const createdAt = getDate();

      const newUserData = {
         accountType: "employee",
         createdAt,
         id: null,
         inCompany: newCompanyID,
         rights: [
            userRightsList.adminRights,
         ],
         user: {
            displayName: ownerName,
            email: ownerEmail,
            password: ownerPassword,
            phoneNumber: ownerPhoneNumber,
            position: "SEO",
         },
      };

      const newCompanyData = {
         company: {
            address: companyAddress,
            displayName: companyName,
            industry: companyIndustry,
         },
         createdAt,
         employees: [],
         id: newCompanyID,
         userID: null
      };

      //* Create the main employee account
      createUserWithEmail(ownerEmail, ownerPassword, true).then(newUser => {
         newUserData.id = newUser.uid;

         //* Save the main employee account data
         setDocument(`Users/${newUserData.id}`, newUserData).then(res => {
            newCompanyData.userID = newUserData.id;
            newCompanyData.employees.push(newUserData.id);

            //* Save company data
            setDocument(`Companies/${newCompanyID}`, newCompanyData).then(res => {
               //* Return response
               return resolve({ newCompanyData, newUserData });
            });
         });
      });
   });
}

export function editCompany(thisCompanyData, { companyName, companyIndustry, companyAddress, ownerName, ownerPhoneNumber }) {
   let canReturnResponse = [];

   return new Promise((resolve, reject) => {
      ownerPhoneNumber = ownerPhoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      const editedCompanyData = {
         company: {
            address: companyAddress,
            displayName: companyName,
            industry: companyIndustry,
         },
      };

      const editedUserData = {
         user: {
            displayName: ownerName,
            phoneNumber: ownerPhoneNumber,
         },
      };

      //* Update company data
      updateDocument(`Companies/${thisCompanyData.id}`, {
         "company.displayName": companyName,
         "company.industry": companyIndustry,
         "company.address": companyAddress,
      }).then(res => {
         canReturnResponse.push(null);
         returnResponse();
      }).catch(error => {
         return reject(error);
      });

      //* Update the main employee
      updateDocument(`Users/${thisCompanyData.userID}`, {
         "user.displayName": ownerName,
         "user.phoneNumber": ownerPhoneNumber,
      }).then(res => {
         canReturnResponse.push(null);
         returnResponse();
      }).catch(error => {
         return reject(error);
      });

      function returnResponse() {
         if (canReturnResponse.length < 2) return;

         return resolve({ editedCompanyData, editedUserData });
      }
   });
}

export function deleteCompany(thisCompanyData) {
   return new Promise((resolve, reject) => {
      deleteDocument(`Companies/${thisCompanyData.id}`).then(res => {
         return resolve({ deletedCompanyData: thisCompanyData });
      }).catch(error => {
         return reject(error);
      });
   });
}

export function newDID({ phoneNumber }, DIDsList) {
   return new Promise((resolve, reject) => {
      phoneNumber = phoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      const haveOther = Object.keys(DIDsList).find(thisDID => {
         return thisDID === phoneNumber;
      });

      if (haveOther) return reject({
         inputFieldsWithError: [
            {
               name: "phoneNumber",
               message: "The DID is already in use",
            },
         ],
      });

      const newDIDData = {
         createdAt: getDate(),
         employees: [],
         phoneNumber,
      };

      updateDocument(`Data/DIDsList`, {
         [phoneNumber]: newDIDData
      }).then(res => {
         return resolve({ newDIDData });
      }).catch(error => {
         return reject(error);
      });
   });
}

export function editDID(oldPhoneNumber, { phoneNumber }, DIDsList) {
   return new Promise((resolve, reject) => {
      phoneNumber = phoneNumber.replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").replaceAll("-", "");

      const editedDIDData = deepObjectMerge(DIDsList[oldPhoneNumber], {
         phoneNumber,
      });

      updateDocument(`Data/DIDsList`, {
         [oldPhoneNumber]: removeValue(),
         [phoneNumber]: editedDIDData,
      }).then(res => {
         return resolve({ editedDIDData });
      }).catch(error => {
         return reject(error);
      });
   });
}

export function deleteDID(phoneNumber) {
   return new Promise((resolve, reject) => {
      updateDocument(`Data/DIDsList`, {
         [phoneNumber]: removeValue(),
      }).then(res => {
         return resolve({ phoneNumber });
      }).catch(error => {
         return reject(error);
      });
   });
}

export function getEmployeeTableRow(employeeData, inCompanyData, onClickEdit = () => { }, onClickDelete = () => { }) {
   return {
      elements: [
         (
            <ImageTextListElement
               imageURL={employeeData ? employeeData.user.profileImageURL : undefined}
               mainText={employeeData ? employeeData.user.displayName : ""}
               subText={employeeData ? employeeData.user.position : ""}
               size={40}
               className="total"
            />
         ),
         (<p className="mainText total">{employeeData ? employeeData.user.email : ""}</p>),
         (<p className="mainText total">{getFormattedDate(employeeData ? employeeData.createdAt : "", dateFormatTypes.MMMMddyyyy)}</p>),
         (<p className="mainText total">{formatPhoneNumber(employeeData ? employeeData.user.phoneNumber : "", true)}</p>),
         (
            <div className="buttonsHolder total">
               <Button icon={faGear} type="total" onClick={onClickEdit} />
               {
                  inCompanyData && employeeData && inCompanyData.userID !== employeeData.id &&
                  <Button icon={faTrash} type="total red" onClick={onClickDelete} />
               }
            </div>
         ),
      ],
      metaData: {
         ...employeeData,
      },
   };
}

export function getCompanyTableRow(companyData, companyOwnerData, onClickEdit = () => { }, onClickDelete = () => { }) {
   return {
      elements: [
         (
            <ImageTextListElement
               imageURL={companyData.company.logoURL}
               mainText={companyData.company.displayName}
               subText={companyData.company.industry}
               size={40}
               className="total"
            />
         ),
         (<p className="mainText total">{companyOwnerData ? companyOwnerData.user.email : ""}</p>),
         (<p className="mainText total">{companyOwnerData ? companyOwnerData.user.displayName : ""}</p>),
         (<p className="mainText total">{formatPhoneNumber(companyOwnerData ? companyOwnerData.user.phoneNumber : "", true)}</p>),
         (
            <div className="buttonsHolder total">
               <Button icon={faGear} type="total" onClick={onClickEdit} />
               <Button icon={faTrash} type="total red" onClick={onClickDelete} />
            </div>
         ),
      ],
      metaData: {
         ...companyData,
      },
   };
}

export function getDIDTableRow(DIDData, index = 0, onClickEdit = () => { }, onClickDelete = () => { }) {
   return {
      elements: [
         (
            <p className="mainText total">{index}</p>
         ),
         (
            <p className="mainText total">{formatPhoneNumber(DIDData.phoneNumber, true)}</p>
         ),
         (
            <div className="buttonsHolder total">
               <Button icon={faGear} type="total" onClick={onClickEdit} />
               <Button icon={faTrash} type="total red" onClick={onClickDelete} />
            </div>
         ),
      ],
      metaData: {
         ...DIDData
      },
   };
}