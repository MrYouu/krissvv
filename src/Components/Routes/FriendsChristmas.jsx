import { useRef, useState } from "react";

import Spacer from "../Spacer";
import Button from "../Button";
import InputField from "../InputField";

import christmasTree from "../../Images/christmasTree.svg";
import Santa from "../../Images/Santa.png";

const hashTable = {
   "14f35086dae6a43dfe95b466faf54989c1c6515cd1406c99f8472052d476445a": "Кристиян",
   "19748a5c8818fe483dc845706a80aaf46c5217025f6402d327d96c8b8fdd68d9": "Марина",
   "dd96b10cdfb490fffbed2bdb6a23c08c1dc3e54f39b3f80cd1436e9b836b87b4": "Антон",
   "46c51d91345c4b49ab549821523f0d9e2df279683ba7189cf8fe469c142df39d": "Никола",
   "6e7e8cce881221bd581ab0d77c3f0721a96740073e487f045d69a465ce4d96e1": "Александър",
   "b307d122c5c955fc96e7c4684dffa481ffa759dd99100482ffbf0d03cc41f48e": "Зара",
   "060d6e074e856d5a29e1802ac94b696c29a9f3c1092ae2afc7722f98465d1108": "Ема",
   "841e3c4da9bf5b2db9b41e261b625db4df26af5039497ab49b56d711271caf1e": "Доньо",
};
const emailList = {
   "krisvalchev@gmail.com": "14f35086dae6a43dfe95b466faf54989c1c6515cd1406c99f8472052d476445a",
   "mima.i.georgieva@gmail.com": "19748a5c8818fe483dc845706a80aaf46c5217025f6402d327d96c8b8fdd68d9",
   "anton.jotov@gmail.com": "dd96b10cdfb490fffbed2bdb6a23c08c1dc3e54f39b3f80cd1436e9b836b87b4",
   "nikolabum77@gmail.com": "46c51d91345c4b49ab549821523f0d9e2df279683ba7189cf8fe469c142df39d",
   "aleksandargeorgievv92@gmail.com": "6e7e8cce881221bd581ab0d77c3f0721a96740073e487f045d69a465ce4d96e1",
   "djurovazara@gmail.com": "b307d122c5c955fc96e7c4684dffa481ffa759dd99100482ffbf0d03cc41f48e",
   "ema.m.deleva27@gmail.com": "060d6e074e856d5a29e1802ac94b696c29a9f3c1092ae2afc7722f98465d1108",
   "donevdonyo39@gmail.com": "841e3c4da9bf5b2db9b41e261b625db4df26af5039497ab49b56d711271caf1e",
};
const contentData = [
   {
      from: "b307d122c5c955fc96e7c4684dffa481ffa759dd99100482ffbf0d03cc41f48e",
      to: "841e3c4da9bf5b2db9b41e261b625db4df26af5039497ab49b56d711271caf1e",
   },
   {
      from: "060d6e074e856d5a29e1802ac94b696c29a9f3c1092ae2afc7722f98465d1108",
      to: "dd96b10cdfb490fffbed2bdb6a23c08c1dc3e54f39b3f80cd1436e9b836b87b4",
   },
   {
      from: "14f35086dae6a43dfe95b466faf54989c1c6515cd1406c99f8472052d476445a",
      to: "6e7e8cce881221bd581ab0d77c3f0721a96740073e487f045d69a465ce4d96e1",
   },
   {
      from: "6e7e8cce881221bd581ab0d77c3f0721a96740073e487f045d69a465ce4d96e1",
      to: "14f35086dae6a43dfe95b466faf54989c1c6515cd1406c99f8472052d476445a",
   },
   {
      from: "19748a5c8818fe483dc845706a80aaf46c5217025f6402d327d96c8b8fdd68d9",
      to: "b307d122c5c955fc96e7c4684dffa481ffa759dd99100482ffbf0d03cc41f48e",
   },
   {
      from: "46c51d91345c4b49ab549821523f0d9e2df279683ba7189cf8fe469c142df39d",
      to: "060d6e074e856d5a29e1802ac94b696c29a9f3c1092ae2afc7722f98465d1108",
   },
   {
      from: "dd96b10cdfb490fffbed2bdb6a23c08c1dc3e54f39b3f80cd1436e9b836b87b4",
      to: "19748a5c8818fe483dc845706a80aaf46c5217025f6402d327d96c8b8fdd68d9",
   },
   {
      from: "841e3c4da9bf5b2db9b41e261b625db4df26af5039497ab49b56d711271caf1e",
      to: "46c51d91345c4b49ab549821523f0d9e2df279683ba7189cf8fe469c142df39d",
   },
];

function FriendsChristmas() {
   const [thisPerson, setThisPerson] = useState(null);
   const [otherPerson, setOtherPerson] = useState(null);
   const emailInputField = useRef();

   const getHiddenPersonOnClick = event => {
      const enteredEmail = emailInputField.current.value.toLowerCase().trim();
      const thisPersonNow = emailList[enteredEmail];

      const presentData = contentData.find(thisElement => thisElement.from === thisPersonNow);

      setThisPerson(thisPersonNow);
      setOtherPerson(presentData.to);
   }

   return (
      <>
         <h1 className="mainText taCenter fontFamilyLobster">Merry Christmas</h1>
         <img src={christmasTree} className="mainImage" alt="Christmas tree" />

         <InputField infoText="Email" attributes={{
            required: true,
            placeholder: "Email"
         }} refElement={emailInputField} />
         <Button text="Get your hidden person" className="aCenter red" onClick={getHiddenPersonOnClick} />

         <Spacer height="30px" />
         {
            thisPerson && otherPerson &&
            <p className="normalText taCenter" style={{
               lineHeight: "30px",
            }}>
               <span className="from">{hashTable[thisPerson]}</span> трябва да направи подарък на <span className="to">{hashTable[otherPerson]}</span>
            </p>
         }
         <Spacer height="30px" />

         <img src={Santa} className="santaImage" alt="Christmas tree" />
      </>
   );
}

export default FriendsChristmas;