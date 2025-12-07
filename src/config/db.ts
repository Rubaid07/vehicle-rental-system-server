import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(50) NOT NULL DEFAULT 'customer'
        )
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS vehicles (
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(100) NOT NULL,
          type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
          registration_number VARCHAR(50) UNIQUE NOT NULL,
          daily_rent_price DECIMAL(10,2) NOT NULL,
          availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
          )
          `);
};

export default initDB;