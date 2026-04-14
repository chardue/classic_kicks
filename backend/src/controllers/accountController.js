import pool from "../config/db.js";

export async function getAccount(req, res) {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      `
      SELECT id, email, username, role
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [customerRows] = await pool.execute(
      `
      SELECT id, email, first_name, last_name, phone, address, role
      FROM customer_details
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [userId]
    );

    return res.json({
      user: users[0],
      customer: customerRows[0] || null
    });
  } catch (error) {
    console.error("getAccount error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateAccount(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const { first_name, last_name, email, phone } = req.body;

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await connection.beginTransaction();

    await connection.execute(
      `
      UPDATE users
      SET email = ?
      WHERE id = ?
      `,
      [email, userId]
    );

    const [existingCustomer] = await connection.execute(
      `
      SELECT id
      FROM customer_details
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [userId]
    );

    if (existingCustomer.length > 0) {
      await connection.execute(
        `
        UPDATE customer_details
        SET email = ?, first_name = ?, last_name = ?, phone = ?
        WHERE id = ?
        `,
        [email, first_name, last_name, phone, existingCustomer[0].id]
      );
    } else {
      await connection.execute(
        `
        INSERT INTO customer_details (
          user_id, email, first_name, last_name, phone, address, role
        )
        VALUES (?, ?, ?, ?, ?, '', 'user')
        `,
        [userId, email, first_name, last_name, phone]
      );
    }

    await connection.commit();

    return res.json({ message: "Account updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("updateAccount error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}