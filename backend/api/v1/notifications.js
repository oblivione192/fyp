import express from 'express';  
import db from "../../db/mysql.js";
import Event from '../../events/eventBus.js'; 
import admin from '../../firebaseconfig/index.js'
const notificationRouter = express.Router(); 

const saveTokenIntoDb = (user_id, token) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT IGNORE INTO fcm_subscriptions (user_id, fcm_token)
       VALUES (?, ?)`,
      [user_id, token],
      function (err, result) {
        if (err) {
          return reject({ error: err.message });
        }
        if (result.affectedRows > 0) {
          return resolve({
            result: "OK",
            insertId: result.insertId
          });
        } else {
          return resolve({
            result: "IGNORED",
            message: "Token already exists"
          });
        }
      }
    );
  });
};

notificationRouter.post("/saveFCMToken", async (req, res) => {
  const user_id = req.user_id || req.body.user_id;  // fallback if not set in middleware
  const { token } = req.body;

  if (!user_id || !token) {
    return res.status(400).send({ error: "Missing user_id or token" });
  }

  try {
    const status = await saveTokenIntoDb(user_id, token);
    return res.send(status);
  } catch (err) {
    return res.status(500).send({
      message: "There was an issue saving the token",
      error: err.error
    });
  }
});
Event.on("notifyUser", async ({ user_id, title, body }) => {
  try {
    // Get all tokens for the user
    const [rows] = await db.promise().query(
      "SELECT fcm_token FROM fcm_subscriptions WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      console.log(`No FCM tokens found for user ${user_id}`);
      return;
    }

    const tokens = rows.map(r => r.fcm_token);

    // Build notification payload
    const message = {
      data: {
        title: "Your appointment has been confirmed!",
        body: "Your appointment will be today at 4 pm. Don't miss it ya!"
      },
      tokens
}
    
    console.log(message);  
    // Send notification
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("FCM response:", response);
  } catch (err) {
    console.error("Error sending notification:", err);
  }
});
export default notificationRouter;