import db from "../../db/firebase_db.js";  
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

export default class ClinicDao {
  constructor() {
    this.db = db;
    this.clinicCollection = collection(this.db, "clinics");
  }

  // Fetch clinic by ID
  async getClinicById(clinicId) {
    const clinicRef = doc(this.db, "clinics", clinicId);
    const clinicSnap = await getDoc(clinicRef);

    if (clinicSnap.exists()) {
      const data = clinicSnap.data();
      return {
        id: clinicSnap.id,
        name: data.name || null,
        address: data.address || null,
        latitude: data.latitude || null
      };
    } else {
      return null;
    }
  }

  // Fetch all clinics (with optional limit)
  async getAllClinics(limitCount = null) {
    let q = query(this.clinicCollection);
    if (limitCount) q = query(this.clinicCollection, limit(limitCount));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || null,
      address: doc.data().address || null,
      latitude: doc.data().latitude || null
    }));
  }

  // Add a new clinic
  async addClinic(clinicId, clinicData) {
    const clinicRef = doc(this.db, "clinics", clinicId);
    await setDoc(clinicRef, {
      ...clinicData,
      createdAt: serverTimestamp()
    });
    return true;
  }

  // Delete a clinic by ID
  async deleteClinic(clinicId) {
    const clinicRef = doc(this.db, "clinics", clinicId);
    await deleteDoc(clinicRef);
    return true;
  }
}
