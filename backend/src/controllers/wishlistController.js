import pool from "../config/db.js";

export async function getWishlist(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `
      SELECT
        w.id AS wishlist_id,
        p.id,
        p.name,
        p.price,
        p.quantity,
        p.image
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("getWishlist error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const [existing] = await pool.execute(
      `
      SELECT id
      FROM wishlist
      WHERE user_id = ? AND product_id = ?
      LIMIT 1
      `,
      [userId, Number(product_id)]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Product is already in wishlist" });
    }

    await pool.execute(
      `
      INSERT INTO wishlist (user_id, product_id)
      VALUES (?, ?)
      `,
      [userId, Number(product_id)]
    );

    return res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("addToWishlist error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const userId = req.user.id;
    const wishlistId = Number(req.params.id);

    const [existing] = await pool.execute(
      `
      SELECT id
      FROM wishlist
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [wishlistId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    await pool.execute("DELETE FROM wishlist WHERE id = ?", [wishlistId]);

    return res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}