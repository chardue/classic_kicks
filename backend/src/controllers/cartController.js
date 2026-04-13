import pool from "../config/db.js";

async function getOrCreateCart(userId) {
  const [carts] = await pool.execute(
    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (carts.length > 0) {
    return carts[0].id;
  }

  const [result] = await pool.execute(
    "INSERT INTO carts (user_id) VALUES (?)",
    [userId]
  );

  return result.insertId;
}

export async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const cartId = await getOrCreateCart(userId);

    const [items] = await pool.execute(
      `
      SELECT
        ci.id AS cart_item_id,
        ci.product_id,
        ci.quantity,
        ci.sizes,
        p.name,
        p.price,
        p.image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
      ORDER BY ci.id DESC
      `,
      [cartId]
    );

    return res.json(items);
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1, sizes } = req.body;

    if (!product_id || !sizes) {
      return res.status(400).json({ message: "Product and size are required" });
    }

    const cartId = await getOrCreateCart(userId);

    const [stockRows] = await pool.execute(
      `
      SELECT p.name, ps.stock
      FROM products p
      JOIN product_sizes ps ON p.id = ps.product_id
      WHERE p.id = ? AND ps.size = ?
      LIMIT 1
      `,
      [Number(product_id), sizes]
    );

    if (stockRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productName = stockRows[0].name;
    const sizeStock = Number(stockRows[0].stock);

    if (sizeStock <= 0) {
      return res.status(400).json({
        message: `${productName} (Size: ${sizes}) is out of stock`
      });
    }

    const [existing] = await pool.execute(
      `
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = ? AND product_id = ? AND sizes = ?
      LIMIT 1
      `,
      [cartId, Number(product_id), sizes]
    );

    if (existing.length > 0) {
      let newQty = Number(existing[0].quantity) + Number(quantity);

      if (newQty > sizeStock) {
        newQty = sizeStock;
      }

      await pool.execute(
        "UPDATE cart_items SET quantity = ? WHERE id = ?",
        [newQty, existing[0].id]
      );

      return res.json({
        message: "Cart quantity updated",
        quantity: newQty
      });
    }

    const safeQty = Math.min(Number(quantity), sizeStock);

    await pool.execute(
      `
      INSERT INTO cart_items (cart_id, product_id, quantity, sizes)
      VALUES (?, ?, ?, ?)
      `,
      [cartId, Number(product_id), safeQty, sizes]
    );

    return res.status(201).json({
      message: "Added to cart",
      quantity: safeQty
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateCartQuantity(req, res) {
  try {
    const userId = req.user.id;
    const cartItemId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const [cartRows] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (cartRows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cartRows[0].id;

    const [items] = await pool.execute(
      `
      SELECT ci.id, ci.product_id, ci.sizes, ps.stock
      FROM cart_items ci
      JOIN product_sizes ps ON ci.product_id = ps.product_id AND ci.sizes = ps.size
      WHERE ci.id = ? AND ci.cart_id = ?
      LIMIT 1
      `,
      [cartItemId, cartId]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const maxStock = Number(items[0].stock);
    const safeQty = Math.min(Number(quantity), maxStock);

    await pool.execute(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [safeQty, cartItemId]
    );

    return res.json({
      message: "Cart item updated",
      quantity: safeQty
    });
  } catch (error) {
    console.error("updateCartQuantity error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const userId = req.user.id;
    const cartItemId = Number(req.params.id);

    const [cartRows] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (cartRows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cartRows[0].id;

    const [items] = await pool.execute(
      "SELECT id FROM cart_items WHERE id = ? AND cart_id = ? LIMIT 1",
      [cartItemId, cartId]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await pool.execute("DELETE FROM cart_items WHERE id = ?", [cartItemId]);

    return res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("deleteCartItem error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}