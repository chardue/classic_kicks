import pool from "../config/db.js";

export async function getProducts(req, res) {
  try {
    const { brand, min_price, max_price, sort } = req.query;

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        b.id AS brand_id,
        b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;

    const params = [];

    if (brand) {
      sql += " AND p.brand_id = ?";
      params.push(Number(brand));
    }

    if (min_price) {
      sql += " AND p.price >= ?";
      params.push(Number(min_price));
    }

    if (max_price) {
      sql += " AND p.price <= ?";
      params.push(Number(max_price));
    }

    switch (sort) {
      case "az":
        sql += " ORDER BY p.name ASC";
        break;
      case "za":
        sql += " ORDER BY p.name DESC";
        break;
      case "low_high":
        sql += " ORDER BY p.price ASC";
        break;
      case "high_low":
        sql += " ORDER BY p.price DESC";
        break;
      default:
        sql += " ORDER BY p.id DESC";
        break;
    }

    const [rows] = await pool.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        b.id AS brand_id,
        b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?
      LIMIT 1
      `,
      [Number(id)]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [sizes] = await pool.execute(
      `
      SELECT size, stock
      FROM product_sizes
      WHERE product_id = ?
      `,
      [Number(id)]
    );

    return res.json({
      ...products[0],
      sizes
    });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function searchProducts(req, res) {
  try {
    const { q = "" } = req.query;

    const [rows] = await pool.execute(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.quantity,
        b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.name LIKE ? OR p.description LIKE ?
      ORDER BY p.id DESC
      `,
      [`%${q}%`, `%${q}%`]
    );

    return res.json(rows);
  } catch (error) {
    console.error("searchProducts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}