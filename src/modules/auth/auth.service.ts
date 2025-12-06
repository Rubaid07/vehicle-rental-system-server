import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";

const signup = async (payload: any) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );
  const user = result.rows[0];
  delete user.password;
  return result;
};

const signin = async (payload: any) => {
  const { email, password } = payload;
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);
    if(result.rows.length===0){
        throw new Error("Invalid credentials");
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        throw new Error("Invalid credentials");
    }
    const token = jwt.sign( { id: user.id, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" })
    console.log({token});
    return {token, user}
}

export const authServices = {
  signup,
  signin,
};
