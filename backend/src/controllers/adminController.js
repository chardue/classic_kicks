import bcrypt from "bcryptjs";
import pool from "../config/db.js";

function sumStock(stockMap) {
  return Object.values(stockMap).reduce((sum, value) => sum + Number(value || 0), 0);
}

async function syncProductQuantity(connection, productId) {
  const [rows] = await connection.execute(
    `
    SELECT COALESCE(SUM(stock), 0) AS total_stock
    FROM product_sizes
    WHERE product_id = ?
    `,
    [productId]
  );

  const totalStock = Number(rows[0]?.total_stock || 0);

  await connection.execute(
    `
    UPDATE products
    SET quantity = ?
    WHERE id = ?
    `,
    [totalStock, productId]
  );
}

export async function getDashboardSummary(req, res) {
  try {
    const [[ordersRow]] = await pool.execute(
      `SELECT COUNT(*) AS totalOrders FROM orders`
    );

    const [[productsRow]] = await pool.execute(
      `SELECT COUNT(*) AS totalProducts FROM products`
    );

    const [[stockRow]] = await pool.execute(
      `SELECT COALESCE(SUM(stock), 0) AS totalStock FROM product_sizes`
    );

    const [[salesRow]] = await pool.execute(
      `
      SELECT COALESCE(SUM(total), 0) AS totalSales
      FROM orders
      WHERE LOWER(status) = 'completed'
      `
    );

    const [recentOrders] = await pool.execute(
      `
      SELECT
        o.id,
        u.username,
        o.order_date,
        o.total,
        o.status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC
      LIMIT 5
      `
    );

    const [lowStockProducts] = await pool.execute(
      `
      SELECT
        p.id,
        p.name,
        COALESCE(SUM(ps.stock), 0) AS total_stock
      FROM products p
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      GROUP BY p.id, p.name
      HAVING total_stock <= 5
      ORDER BY total_stock ASC, p.name ASC
      `
    );

    return res.json({
      summary: {
        totalOrders: Number(ordersRow.totalOrders || 0),
        totalProducts: Number(productsRow.totalProducts || 0),
        totalStock: Number(stockRow.totalStock || 0),
        totalSales: Number(salesRow.totalSales || 0)
      },
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error("getDashboardSummary error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getProductsAdmin(req, res) {
  try {
    const [products] = await pool.execute(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        p.sizes,
        p.brand_id,
        b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.id DESC
      `
    );

    const [stocks] = await pool.execute(
      `
      SELECT product_id, size, stock
      FROM product_sizes
      ORDER BY product_id ASC
      `
    );

    const result = products.map((product) => {
      const stockRows = stocks.filter((row) => row.product_id === product.id);
      const stock = {
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0
      };

      stockRows.forEach((row) => {
        stock[row.size] = Number(row.stock || 0);
      });

      return {
        ...product,
        stock
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("getProductsAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createProduct(req, res) {
  const connection = await pool.getConnection();

  try {
    const {
      name,
      brand_id,
      description,
      price,
      image,
      stock = {}
    } = req.body;

    if (!name || !brand_id || !price || !image) {
      return res.status(400).json({ message: "Required product fields are missing" });
    }

    const sizes = ["XS", "S", "M", "L", "XL"];
    const availableSizes = sizes.filter((size) => Number(stock[size] || 0) > 0);
    const sizesString = availableSizes.join(",");

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `
      INSERT INTO products (
        name,
        description,
        price,
        quantity,
        image,
        is_hot,
        brand_id,
        sizes
      )
      VALUES (?, ?, ?, 0, ?, 0, ?, ?)
      `,
      [
        name,
        description || "",
        Number(price),
        image,
        Number(brand_id),
        sizesString
      ]
    );

    const productId = result.insertId;

    for (const size of sizes) {
      await connection.execute(
        `
        INSERT INTO product_sizes (product_id, size, stock)
        VALUES (?, ?, ?)
        `,
        [productId, size, Number(stock[size] || 0)]
      );
    }

    await syncProductQuantity(connection, productId);

    await connection.commit();

    return res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("createProduct error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function updateProduct(req, res) {
  const connection = await pool.getConnection();

  try {
    const productId = Number(req.params.id);
    const {
      name,
      brand_id,
      description,
      price,
      image,
      stock = {}
    } = req.body;

    const [existing] = await connection.execute(
      `SELECT id FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sizes = ["XS", "S", "M", "L", "XL"];
    const availableSizes = sizes.filter((size) => Number(stock[size] || 0) > 0);
    const sizesString = availableSizes.join(",");

    await connection.beginTransaction();

    await connection.execute(
      `
      UPDATE products
      SET
        name = ?,
        description = ?,
        price = ?,
        image = ?,
        brand_id = ?,
        sizes = ?
      WHERE id = ?
      `,
      [
        name,
        description || "",
        Number(price),
        image,
        Number(brand_id),
        sizesString,
        productId
      ]
    );

    for (const size of sizes) {
      const [sizeRow] = await connection.execute(
        `
        SELECT id
        FROM product_sizes
        WHERE product_id = ? AND size = ?
        LIMIT 1
        `,
        [productId, size]
      );

      if (sizeRow.length > 0) {
        await connection.execute(
          `
          UPDATE product_sizes
          SET stock = ?
          WHERE product_id = ? AND size = ?
          `,
          [Number(stock[size] || 0), productId, size]
        );
      } else {
        await connection.execute(
          `
          INSERT INTO product_sizes (product_id, size, stock)
          VALUES (?, ?, ?)
          `,
          [productId, size, Number(stock[size] || 0)]
        );
      }
    }

    await syncProductQuantity(connection, productId);

    await connection.commit();

    return res.json({ message: "Product updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("updateProduct error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function deleteProduct(req, res) {
  const connection = await pool.getConnection();

  try {
    const productId = Number(req.params.id);

    const [existing] = await connection.execute(
      `SELECT id FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [orderRefs] = await connection.execute(
      `
      SELECT COUNT(*) AS total
      FROM order_items
      WHERE product_id = ?
      `,
      [productId]
    );

    if (Number(orderRefs[0].total) > 0) {
      return res.status(400).json({
        message: "This product cannot be deleted because it already has order history."
      });
    }

    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM wishlist WHERE product_id = ?`,
      [productId]
    );

    await connection.execute(
      `DELETE FROM cart_items WHERE product_id = ?`,
      [productId]
    );

    await connection.execute(
      `DELETE FROM product_sizes WHERE product_id = ?`,
      [productId]
    );

    await connection.execute(
      `DELETE FROM products WHERE id = ?`,
      [productId]
    );

    await connection.commit();

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("deleteProduct error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function getOrdersAdmin(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        o.id,
        u.username,
        o.order_date,
        o.total,
        o.status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC
      `
    );

    return res.json(rows);
  } catch (error) {
    console.error("getOrdersAdmin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

function mapStatusToTimeline(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "pending") {
    return {
      status: "Order Placed",
      message: "Your order has been received and is being processed."
    };
  }

  if (normalized === "packed") {
    return {
      status: "Packed",
      message: "Your order has been packed and is ready for shipping."
    };
  }

  if (normalized === "shipped") {
    return {
      status: "Shipped",
      message: "Your order is on the way."
    };
  }

  if (normalized === "completed") {
    return {
      status: "Delivered",
      message: "Your order has been delivered successfully."
    };
  }

  if (normalized === "canceled") {
    return {
      status: "Canceled",
      message: "Your order has been canceled."
    };
  }

  return null;
}

export async function updateOrderStatus(req, res) {
  const connection = await pool.getConnection();

  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const [existing] = await connection.execute(
      `SELECT id, status FROM orders WHERE id = ? LIMIT 1`,
      [orderId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    await connection.beginTransaction();

    await connection.execute(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId]
    );

    await connection.execute(
      `
      UPDATE order_items
      SET status = ?
      WHERE order_id = ?
      `,
      [status, orderId]
    );

    const timelineEntry = mapStatusToTimeline(status);

    if (timelineEntry) {
      await connection.execute(
        `
        INSERT INTO order_timeline (order_id, status, message)
        VALUES (?, ?, ?)
        `,
        [orderId, timelineEntry.status, timelineEntry.message]
      );
    }

    await connection.commit();

    return res.json({ message: "Order status updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function getBestSellerReport(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        b.name AS brand_name,
        COALESCE(SUM(oi.quantity), 0) AS total_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      JOIN orders o ON oi.order_id = o.id
      WHERE LOWER(o.status) = 'completed'
      GROUP BY b.id, b.name
      ORDER BY total_sold DESC, b.name ASC
      `
    );

    return res.json(rows);
  } catch (error) {
    console.error("getBestSellerReport error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getWishlistAlerts(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        p.id,
        p.name,
        p.image,
        p.price,
        COUNT(w.id) AS wishlist_count
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE p.quantity <= 0
      GROUP BY p.id, p.name, p.image, p.price
      ORDER BY wishlist_count DESC, p.name ASC
      `
    );

    return res.json(rows);
  } catch (error) {
    console.error("getWishlistAlerts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAdmins(req, res) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT id, email, username, role
      FROM users
      WHERE role = 'admin'
      ORDER BY id DESC
      `
    );

    return res.json(rows);
  } catch (error) {
    console.error("getAdmins error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createAdminUser(req, res) {
  const connection = await pool.getConnection();

  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await connection.execute(
      `
      SELECT id, email, username
      FROM users
      WHERE email = ? OR username = ?
      LIMIT 1
      `,
      [email.trim(), username.trim()]
    );

    if (existing.length > 0) {
      if (existing[0].email === email.trim()) {
        return res.status(409).json({ message: "Email already exists." });
      }
      return res.status(409).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `
      INSERT INTO users (email, username, password, role)
      VALUES (?, ?, ?, 'admin')
      `,
      [email.trim(), username.trim(), hashedPassword]
    );

    await connection.execute(
      `
      INSERT INTO customer_details (
        user_id, email, first_name, last_name, phone, address, role
      )
      VALUES (?, ?, '', '', 0, '', 'admin')
      `,
      [result.insertId, email.trim()]
    );

    await connection.commit();

    return res.status(201).json({ message: "Admin account created successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("createAdminUser error:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

export async function deleteAdminUser(req, res) {
  try {
    const adminId = Number(req.params.id);

    if (adminId === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const [existing] = await pool.execute(
      `
      SELECT id
      FROM users
      WHERE id = ? AND role = 'admin'
      LIMIT 1
      `,
      [adminId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Admin account not found" });
    }

    await pool.execute(`DELETE FROM users WHERE id = ?`, [adminId]);

    return res.json({ message: "Admin account deleted successfully." });
  } catch (error) {
    console.error("deleteAdminUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}