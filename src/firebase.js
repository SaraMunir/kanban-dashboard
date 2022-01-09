import firebase from 'firebase/app';
import 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyAVtof8u3vyFPJ5cLLZIAjGOOPEQZsZ0CU",
    authDomain: "project-kanban-dashboard.firebaseapp.com",
    projectId: "project-kanban-dashboard",
    storageBucket: "project-kanban-dashboard.appspot.com",
    messagingSenderId: "507734791686",
    appId: "1:507734791686:web:9e9451f3e2d719d4a99587"
};


firebase.initializeApp(firebaseConfig);

export default firebase;