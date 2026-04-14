import pool from "../config/db.js";

async function getCartByUserId(userId) {
  const [carts] = await pool.execute(
    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (carts.length === 0) {
    return null;
  }

  return carts[0];
}

function normalizePaymentMethod(paymentMethod) {
  const value = String(paymentMethod || "").trim().toUpperCase();

  if (value === "GCASH") return "GCASH";
  if (value === "CASH ON DELIVERY") return "CASH ON DELIVERY";
  if (value === "COD") return "CASH ON DELIVERY";

  return paymentMethod;
}

export async function placeOrder(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const {
      email,
      phone,
      first_name,
      last_name,
      address_id,
      delivery_type,
      shipping,
      payment_method
    } = req.body;

    if (
      !email ||
      !phone ||
      !first_name ||
      !last_name ||
      !address_id ||
      !delivery_type ||
      !shipping ||
      !payment_method
    ) {
      return res.status(400).json({ message: "All checkout fields are required" });
    }

    const cart = await getCartByUserId(userId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const [cartItems] = await connection.execute(
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
      `,
      [cart.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const [addressRows] = await connection.execute(
      `
      SELECT address_id
      FROM address
      WHERE address_id = ? AND user_id = ?
      LIMIT 1
      `,
      [Number(address_id), userId]
    );

    if (addressRows.length === 0) {
      return res.status(404).json({ message: "Selected address not found" });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const [shippingFeeRaw, shippingFeeText] = String(shipping).split("|");
    const shippingFee = Number(shippingFeeRaw || 0);

    let shippingType = "Free";
    if (
      String(shippingFeeText || "").toLowerCase().includes("150") ||
      shippingFee > 0
    ) {
      shippingType = "Express";
    }

    const total = subtotal + shippingFee;
    const normalizedPaymentMethod = normalizePaymentMethod(payment_method);

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `
      INSERT INTO orders (
        user_id,
        total,
        shipping_type,
        shipping_fee,
        payment_method,
        status,
        address_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        total,
        shippingType,
        shippingFee,
        normalizedPaymentMethod,
        "Pending",
        Number(address_id)
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.execute(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price,
          size,
          status,
          sizes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.sizes || null,
          "Pending",
          item.sizes || ""
        ]
      );

      if (item.sizes) {
        await connection.execute(
          `
          UPDATE product_sizes
          SET stock = stock - ?
          WHERE product_id = ? AND size = ? AND stock >= ?
          `,
          [item.quantity, item.product_id, item.sizes, item.quantity]
        );
      }

      await connection.execute(
        `
        UPDATE products
        SET quantity = GREATEST(quantity - ?, 0)
        WHERE id = ?
        `,
        [item.quantity, item.product_id]
      );
    }

    await connection.execute(
      `
      INSERT INTO order_timeline (order_id, status, message)
      VALUES (?, ?, ?)
      `,
      [
        orderId,
        "Order Placed",
        "Your order has been received and is being processed."
      ]
    );

    await connection.execute(
      "DELETE FROM cart_items WHERE cart_id = ?",
      [cart.id]
    );

    await connection.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      order_id: orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error("placeOrder error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;

    const [orders] = await pool.execute(
      `
      SELECT
        o.id AS order_id,
        o.order_date,
        o.total,
        o.status,
        o.address_id,
        a.house_street,
        a.barangay,
        a.city,
        a.province,
        a.region,
        a.postal_code,
        a.country
      FROM orders o
      LEFT JOIN address a ON o.address_id = a.address_id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
      `,
      [userId]
    );

    const orderIds = orders.map((order) => order.order_id);

    let items = [];
    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => "?").join(",");
      const [itemRows] = await pool.execute(
        `
        SELECT
          oi.order_id,
          oi.product_id,
          oi.quantity,
          oi.price,
          oi.size,
          oi.sizes,
          p.name AS product_name,
          p.image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
        ORDER BY oi.id ASC
        `,
        orderIds
      );
      items = itemRows;
    }

    const result = orders.map((order) => ({
      order_id: order.order_id,
      order_date: order.order_date,
      total: order.total,
      status: order.status,
      address: order.address_id
        ? {
            house_street: order.house_street,
            barangay: order.barangay,
            city: order.city,
            province: order.province,
            region: order.region,
            postal_code: order.postal_code,
            country: order.country
          }
        : null,
      items: items
        .filter((item) => item.order_id === order.order_id)
        .map((item) => ({
          product_name: item.product_name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          size: item.size || item.sizes || ""
        }))
    }));

    return res.json(result);
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function cancelOrder(req, res) {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    const [orders] = await connection.execute(
      `
      SELECT id, status, order_date
      FROM orders
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];
    const status = String(order.status || "").toLowerCase();

    if (status === "canceled") {
      return res.status(400).json({ message: "Order is already canceled" });
    }

    if (status === "completed") {
      return res.status(400).json({ message: "Completed orders cannot be canceled" });
    }

    const orderTime = new Date(order.order_date).getTime();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - orderTime > oneHour) {
      return res.status(400).json({
        message: "This order can no longer be canceled after 1 hour"
      });
    }

    const [items] = await connection.execute(
      `
      SELECT product_id, quantity, size, sizes
      FROM order_items
      WHERE order_id = ?
      `,
      [orderId]
    );

    await connection.beginTransaction();

    await connection.execute(
      `
      UPDATE orders
      SET status = 'Canceled'
      WHERE id = ?
      `,
      [orderId]
    );

    await connection.execute(
      `
      UPDATE order_items
      SET status = 'canceled'
      WHERE order_id = ?
      `,
      [orderId]
    );

    for (const item of items) {
      const actualSize = item.size || item.sizes || null;

      await connection.execute(
        `
        UPDATE products
        SET quantity = quantity + ?
        WHERE id = ?
        `,
        [item.quantity, item.product_id]
      );

      if (actualSize) {
        await connection.execute(
          `
          UPDATE product_sizes
          SET stock = stock + ?
          WHERE product_id = ? AND size = ?
          `,
          [item.quantity, item.product_id, actualSize]
        );
      }
    }

    await connection.execute(
      `
      INSERT INTO order_timeline (order_id, status, message)
      VALUES (?, ?, ?)
      `,
      [orderId, "Canceled", "Your order has been canceled."]
    );

    await connection.commit();

    return res.json({ message: "Order canceled successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("cancelOrder error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function getOrderTimeline(req, res) {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    const [orders] = await pool.execute(
      `
      SELECT id
      FROM orders
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [timeline] = await pool.execute(
      `
      SELECT status, message, created_at
      FROM order_timeline
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [orderId]
    );

    return res.json(timeline);
  } catch (error) {
    console.error("getOrderTimeline error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}