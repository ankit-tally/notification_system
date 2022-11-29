import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCUoIZOaDy95CHqsAJvWf9EDesfXd36UFs",
  authDomain: "notififcation-system.firebaseapp.com",
  projectId: "notififcation-system",
  storageBucket: "notififcation-system.appspot.com",
  messagingSenderId: "657850086175",
  appId: "1:657850086175:web:36f2e1ddad067fc9fc762a",
  measurementId: "G-3X2X9NX4DX"
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey: "BGeR7IRja8F3wBRMi_aeSkQqRqLSdDViNetnmvPqKFYEYUvHC3KaTn-Y-Iq_Q9bgtcq2s-MdY9J2ZvsU76jivW8",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();