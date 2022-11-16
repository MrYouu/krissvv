import Alert from "./Alert";

const AlertHolder = ({ allAlerts }) => {
   return (
      <div className="alertsHolder">
         {
            allAlerts.map(thisAlert => {
               return <Alert {...thisAlert.attributes} key={thisAlert.id} />
            })
         }
      </div>
   );
}

export default AlertHolder;