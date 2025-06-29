import db from "../../db/firebase_db";
import {
    doc,
    setDoc,
    collection,
    getDoc,
    query,
    limit,
    getDocs,
    deleteDoc,
    serverTimestamp
  } from "firebase/firestore";
class AppointmentDao{
    constructor(clinicid){ 
       this.db = db; 
       this.collection = collection(`/clinic/${clinicid}/appointment`);
    }
}