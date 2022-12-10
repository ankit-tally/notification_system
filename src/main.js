import { initializeApp } from "firebase/app";
import { getMessaging, getToken, deleteToken} from "firebase/messaging";
import { getDatabase, ref, push, orderByChild, query, equalTo, get, remove, set} from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQkTH0pCy8tRqGAALFq7wyLfdyHiTeBVw",
  authDomain: "push-notitia.firebaseapp.com",
  databaseURL: "https://push-notitia-default-rtdb.firebaseio.com",
  projectId: "push-notitia",
  storageBucket: "push-notitia.appspot.com",
  messagingSenderId: "166862486537",
  appId: "1:166862486537:web:c0a339b74ff455ef534cd8",
  measurementId: "G-7QHSLGP16R"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const database = getDatabase();

const auth = getAuth();
const provider = new GoogleAuthProvider();

// ------------ Variables --------------

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const sendNotificationForm = document.getElementById('send-notification-form');

// ------------ Event Listeners --------------

auth.onAuthStateChanged(handleAuthStateChanged);
signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOff);
subscribeButton.addEventListener("click", subscribeToNotifications);
unsubscribeButton.addEventListener("click", unsubscribeFromNotifications);
sendNotificationForm.addEventListener("submit", sendNotification);
  

// ------------ Functions --------------

function handleAuthStateChanged(user) {
  if (user) {
    console.log(user);
    signInButton.setAttribute("hidden", "true");
    signOutButton.removeAttribute("hidden");
    sendNotificationForm.removeAttribute("hidden");
    checkSubscription();
  } else {
    console.log("No User");
    signOutButton.setAttribute("hidden", "true");
    signInButton.removeAttribute("hidden");
    sendNotificationForm.setAttribute("hidden", "true");
  }
}

function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Hello (:-");
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
}


function signOff(){
    signOut(auth)
    .then(() => {
    })
    .catch((error) => {
    });
}


function subscribeToNotifications() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      getToken(messaging, {
        vapidKey:
          "BA_DwyLRN0dc7uKD2uFbEcuU2BTDe-aZyeftldftHNAELQ0SU5SHiE4L7gxroTeWS7SaTyM0GgolNEmdkaZqmFo",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
          push(ref(database, "/tokens"), {
            token: currentToken,
            uid: auth.currentUser.uid,
          });
          checkSubscription();
        } else {
          console.log("Can not get token");
        }
      });
    }
  });
}

function unsubscribeFromNotifications() {
  deleteToken(messaging, {
    vapidKey:
      "BA_DwyLRN0dc7uKD2uFbEcuU2BTDe-aZyeftldftHNAELQ0SU5SHiE4L7gxroTeWS7SaTyM0GgolNEmdkaZqmFo",
  })
    .then(() => {
      const queryConstraints = query(
        ref(database, "/tokens"),
        orderByChild("uid"),
        equalTo(auth.currentUser.uid)
      );
      remove(queryConstraints).then((snapshot) => {
        console.log("Removed Successfully (:-");
      });
    })
    .then(() => checkSubscription())
    .catch((err) => console.log("Error Deleting Token"));
}


function checkSubscription() {
  const queryConstraints = query( ref(database, "/tokens"), orderByChild("uid"), equalTo(auth.currentUser.uid));
  get(queryConstraints).then((snapshot) => {
    if (snapshot.val()) {
      subscribeButton.setAttribute("hidden", "true");
      unsubscribeButton.removeAttribute("hidden");
    } else {
      unsubscribeButton.setAttribute("hidden", "true");
      subscribeButton.removeAttribute("hidden");
    }
  });
}

function sendNotification(e) {
  e.preventDefault();

  const notificationMessage = document.getElementById("notification-message").value;

  const postListRef = ref(database, "/notifications");
  const newPostRef = push(postListRef);
  set(newPostRef, {
    user: auth.currentUser.displayName,
    message: notificationMessage,
    userProfileImg: auth.currentUser.photoURL,
  }).then(() => {
    document.getElementById("send-notification-form").value = "";
  });
}