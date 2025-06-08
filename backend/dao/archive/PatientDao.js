import db from "../../db/firebase_db.js";
import bcrypt from "bcryptjs";
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
export default class PatientDao {
    constructor() {
      this.db = db;
      this.usersCollection = collection(db, "users");
    }

    async createUser(icnumber, plainPassword, userData = {}) {
      const existing = await this.getUserByIc(icnumber);
      if (existing) throw new Error("User already exists");
      console.log("Creating user");
      const passwordHash = await bcrypt.hash(plainPassword, 10);
      const userRecord = {
        icnumber,
        passwordHash,
        ...userData,
        createdAt: serverTimestamp(),
      };

      const newUserDoc = doc(this.usersCollection, icnumber);
      await setDoc(newUserDoc, userRecord);
      return userRecord;
    }

    async validateCredentials(icnumber, plainPassword) {
      const user = await this.getUserByIc(icnumber);
      if (!user) {
        console.log(`User not found for IC: ${icnumber}`);
        return 0;
      }

      const match = await bcrypt.compare(plainPassword, user.passwordHash);
      return match ? 2 : 1;
    }

    async getUserByIc(icnumber) {
      try {
        const docRef = doc(this.usersCollection, icnumber);
        const userDoc = await getDoc(docRef);
        return userDoc.exists() ? userDoc.data() : null;
      } catch (error) {
        console.error(`getUserByIc failed for IC: ${icnumber}`, error);
        throw error;
      }
    }

    async deleteUser(icnumber) {
      const user = await this.getUserByIc(icnumber);
      if (!user) {
        console.log(`User with IC: ${icnumber} does not exist`);
        throw new Error("User not found");
      }

      const userDoc = doc(this.usersCollection, icnumber);
      await deleteDoc(userDoc);
    }

    async listUsers(limitNum = 10) {
      const validLimit = Number.isInteger(limitNum) && limitNum > 0 ? limitNum : 10;
      const q = query(this.usersCollection, limit(validLimit));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    }
  };