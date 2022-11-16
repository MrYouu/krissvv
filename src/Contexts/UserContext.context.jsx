import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getUser, getDocument } from "../Utilities/Firebase";

const UserContext = createContext({
   currentProviderUser: null,
   setCurrentProviderUser: () => null,
   currentUser: null,
   setCurrentUser: () => null,

   elementData: {},
   addElementData: (id = "", data) => null,
});

export function useUser() {
   return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
   const navigateTo = useNavigate();

   //* This user
   const [currentProviderUser, setCurrentProviderUser] = useState(null);
   const [currentUser, setCurrentUser] = useState(null);

   //* Other
   const [elementData, setElementData] = useState({});

   //* Get data from cache
   useEffect(() => {
      if (localStorage.getItem("currentUser")) setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
   }, []);

   //* Get data for this user
   useEffect(() => {
      const unsubscribe = getUser(thisProviderUser => {
         setCurrentProviderUser(thisProviderUser);

         if (thisProviderUser) {
            getDocument(`Users/${thisProviderUser.uid}`).then(currentUserData => {
               setCurrentUser(currentUserData);
               localStorage.setItem("currentUser", JSON.stringify(currentUserData));
            });
         }
         else {
            if (window.location.pathname.split("/")[1] === "user") navigateTo("/login");
         }
      });

      return unsubscribe;
   }, [navigateTo]);

   //* Get additional data for this user
   useEffect(() => {
      if (!currentUser) return;

   }, [currentUser]);

   //* Functions
   const addElementData = (id = "", data) => {
      setElementData(oldValue => {
         return {
            ...oldValue,
            [id]: data,
         };
      });
   }

   //* Export values
   const value = {
      currentProviderUser,
      setCurrentProviderUser,
      currentUser,
      setCurrentUser,

      elementData,
      addElementData,
   };

   return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}