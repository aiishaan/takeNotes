
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyAuzvKKdPww6hsIUA4RBcccGi0GRRibLwY",
  authDomain: "takenotes-552a4.firebaseapp.com",
  projectId: "takenotes-552a4",
  storageBucket: "takenotes-552a4.appspot.com",
  messagingSenderId: "550552816131",
  appId: "1:550552816131:web:74a3adae79ce8c36221c36"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
