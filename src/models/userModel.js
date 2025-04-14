const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async create(nama, email, password){
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query('INSERT INTO users (nama, email, password) VALUES ($1, $2, $3) RETURNING user_id, nama, email, created_at', [nama, email, hashedPassword]); 
        return result.rows[0];  
    }

    static async findByEmail(email){
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id){
        const result = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
        return result.rows[0];
    }
}

module.exports = User;