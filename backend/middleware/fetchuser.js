import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
console.log("key is",JWT_SECRET);
const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send("Please authenticate using a valid token");
    }
    
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).send("Please authenticate using a valid token");
    }
};

export default fetchuser;
