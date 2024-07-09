import firebase from "firebase/app";
import firebaseConfig from './firebaseConfig'
import { collection, doc, setDoc } from "firebase/firestore"; 
firebase.initializeApp(firebaseConfig);
const storage  = firebase.storage();

export const uploadFile = (file) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name)
    return fileRef.put(file);
}

export const getDownloadUrl = (fileName) => {
    return storage.ref().child(fileName).getDownloadUrl();
}