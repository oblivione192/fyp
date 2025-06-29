import bcrypt from 'bcrypt';

export default class AdminDao {
    constructor(db) {
        this.db = db;
    }
   
    async getUserIdByUsernameAndClinic(username, clinicNo) {
        const query = `
            SELECT a.AdminId 
            FROM Admin a
            JOIN Clinic c ON a.ClinicId = c.ClinicId
            WHERE a.name = ? AND c.registration_no = ?
        `;
        const result = await this.executeQuery(query, [username, clinicNo]);
        return result[0]; // Will return undefined if not found
    }

    async createUser(username, clinicNo, password) { 
        const userDoesExist = await this.getUserIdByUsernameAndClinic(username, clinicNo);

        if (userDoesExist) {
            throw new Error('Admin already exists in this clinic.');
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO Admin (name, ClinicId, password)
            VALUES (?, (SELECT ClinicId FROM Clinic WHERE registration_no = ?), ?)
        `;
        return this.executeQuery(insertQuery, [username, clinicNo, hashedPassword]);
    }

    async validateCredentials(clinicNo, username, plainPassword) {
        // Status codes:
        // 0 = user does not exist
        // 1 = wrong password
        // 2 = successful login

        const user = await this.getUserIdByUsernameAndClinic(username, clinicNo);

        if (!user) {
            return 0;
        }

        const query = `
            SELECT password 
            FROM Admin 
            WHERE AdminId = ?
        `;
        const result = await this.executeQuery(query, [user.AdminId]);

        if (!result.length) return 0;

        const hashedPassword = result[0].password;

        const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);

        return passwordMatch ? 2 : 1;
    }

    async listUsers(limitNum = 10, page = 1) {
        const offset = limitNum * (page - 1);
        const query = "SELECT * FROM Admin LIMIT ? OFFSET ?";
        return this.executeQuery(query, [limitNum, offset]);
    }

    async deleteUser(adminId) {
        const query = "DELETE FROM Admin WHERE AdminId = ?";
        return this.executeQuery(query, [adminId]);
    }

    executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.query(query, params, function (err, results) {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}
