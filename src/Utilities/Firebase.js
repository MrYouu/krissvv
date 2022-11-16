import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import {
   getFirestore,
   doc, collection,
   getDoc, setDoc, updateDoc, deleteDoc,
   deleteField, arrayUnion, arrayRemove, increment,
   query, where, getDocs,
   orderBy, limit,
} from "firebase/firestore";

import { firebaseConfig } from "../Config";

const firebaseApp = initializeApp(firebaseConfig, "main");
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);

const firebaseAppClient = initializeApp(firebaseConfig, "client");
const firebaseAuthClient = getAuth(firebaseAppClient);

//* Auth
function createUserWithEmail(email, password, fromClient = false) {
   return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(fromClient ? firebaseAuthClient : firebaseAuth, email, password).then(userCredential => {
         resolve(userCredential.user);
      }).catch(error => {
         reject(error);
      });
   });
}

function logInWithEmail(email, password, fromClient = false) {
   return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(fromClient ? firebaseAuthClient : firebaseAuth, email, password).then(userCredential => {
         resolve(userCredential.user);
      }).catch(error => {
         reject(error);
      });
   });
}

function logOutUser() {
   return new Promise((resolve, reject) => {
      signOut(firebaseAuth).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function getUser(callBack) {
   return onAuthStateChanged(firebaseAuth, callBack);
}

//* Firestore
function setDocument(path = "/", Data = {}) {
   return new Promise((resolve, reject) => {
      setDoc(doc(firebaseFirestore, path.slice(0, path.lastIndexOf("/")), path.slice(path.lastIndexOf("/") + 1)), Data).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function getDocument(path = "/") {
   return new Promise((resolve, reject) => {
      getDoc(doc(firebaseFirestore, path.slice(0, path.lastIndexOf("/")), path.slice(path.lastIndexOf("/") + 1))).then(docSnapshot => {
         if (docSnapshot.exists()) resolve(docSnapshot.data());
         else resolve(false);
      }).catch(error => {
         reject(error);
      });
   });
}

function updateDocument(path = "/", Data = {}) {
   return new Promise((resolve, reject) => {
      updateDoc(doc(firebaseFirestore, path.slice(0, path.lastIndexOf("/")), path.slice(path.lastIndexOf("/") + 1)), Data).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function deleteDocument(path = "/") {
   return new Promise((resolve, reject) => {
      deleteDoc(doc(firebaseFirestore, path.slice(0, path.lastIndexOf("/")), path.slice(path.lastIndexOf("/") + 1))).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function queryCollection(path = "/", queryValues = [{ key: "", operation: "", value: "", }], options = { limitValue: 0, orderByValues: [{ key: "", fromBottom: false }], }) {
   return new Promise((resolve, reject) => {
      let queryWheres = queryValues[0].key !== "" ?
         queryValues.map(thisQueryValue => where(thisQueryValue.key, thisQueryValue.operation, thisQueryValue.value)) : [];
      let limitValues = options.limitValue !== 0 ? [limit(options.limitValue)] : [];
      let orderByValues = options.orderByValues[0].key !== "" ?
         options.orderByValues.map(thisOrderByValue => {
            return orderBy(thisOrderByValue.key, thisOrderByValue.fromBottom ? "desc" : "asc");
         }) : [];

      getDocs(query(collection(firebaseFirestore, path), ...queryWheres, ...orderByValues, ...limitValues)).then(querySnapshot => {
         let queryData = {};
         querySnapshot.forEach(thisDocument => {
            queryData[thisDocument.id] = thisDocument.data();
         });

         resolve(queryData);
      }).catch(error => {
         reject(error);
      });
   });
}

//* Exports
export {
   createUserWithEmail, logInWithEmail, logOutUser, getUser, deleteUser,
   setDocument, getDocument, updateDocument, deleteDocument,
   deleteField as removeValue,
   arrayUnion as arrayAdd,
   arrayRemove,
   increment as incrementValue,
   queryCollection,
};