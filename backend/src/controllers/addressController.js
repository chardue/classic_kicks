import pool from "../config/db.js";

export async function getAddresses(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `
      SELECT
        address_id,
        address_name,
        house_street,
        barangay,
        city,
        province,
        region,
        postal_code,
        country,
        is_default,
        created_at,
        update_at
      FROM address
      WHERE user_id = ?
      ORDER BY is_default DESC, address_id DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("getAddresses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function addAddress(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const {
      address_name,
      house_street,
      barangay,
      city,
      province,
      region,
      postal_code,
      country,
      is_default
    } = req.body;

    if (
      !address_name ||
      !house_street ||
      !barangay ||
      !city ||
      !province ||
      !region ||
      !postal_code ||
      !country
    ) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    await connection.beginTransaction();

    if (is_default) {
      await connection.execute(
        `
        UPDATE address
        SET is_default = 0
        WHERE user_id = ?
        `,
        [userId]
      );
    }

    await connection.execute(
      `
      INSERT INTO address (
        user_id,
        house_street,
        barangay,
        city,
        province,
        region,
        postal_code,
        country,
        address_name,
        is_default
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        house_street,
        barangay,
        city,
        province,
        region,
        postal_code,
        country,
        address_name,
        is_default ? 1 : 0
      ]
    );

    await connection.commit();

    return res.status(201).json({ message: "Address added successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("addAddress error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function updateAddress(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const addressId = Number(req.params.id);
    const {
      address_name,
      house_street,
      barangay,
      city,
      province,
      region,
      postal_code,
      country,
      is_default
    } = req.body;

    const [existing] = await connection.execute(
      `
      SELECT address_id
      FROM address
      WHERE address_id = ? AND user_id = ?
      LIMIT 1
      `,
      [addressId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    await connection.beginTransaction();

    if (is_default) {
      await connection.execute(
        `
        UPDATE address
        SET is_default = 0
        WHERE user_id = ?
        `,
        [userId]
      );
    }

    await connection.execute(
      `
      UPDATE address
      SET
        address_name = ?,
        house_street = ?,
        barangay = ?,
        city = ?,
        province = ?,
        region = ?,
        postal_code = ?,
        country = ?,
        is_default = ?,
        update_at = CURRENT_TIMESTAMP
      WHERE address_id = ? AND user_id = ?
      `,
      [
        address_name,
        house_street,
        barangay,
        city,
        province,
        region,
        postal_code,
        country,
        is_default ? 1 : 0,
        addressId,
        userId
      ]
    );

    await connection.commit();

    return res.json({ message: "Address updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("updateAddress error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function deleteAddress(req, res) {
  try {
    const userId = req.user.id;
    const addressId = Number(req.params.id);

    const [existing] = await pool.execute(
      `
      SELECT address_id
      FROM address
      WHERE address_id = ? AND user_id = ?
      LIMIT 1
      `,
      [addressId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    await pool.execute(
      `
      DELETE FROM address
      WHERE address_id = ? AND user_id = ?
      `,
      [addressId, userId]
    );

    return res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("deleteAddress error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}