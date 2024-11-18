var jwt=require("jsonwebtoken")

const fetchUser=(req, res, next)=>{
    // Get the user from JWT token and append the id to req

    const token = req.headers['auth-token'];
    if (!token) {
        return res.status(401).send({ message: "Access Denied. No token provided." });
        }
        try {
            const JWT_SECRET = "Iamgoodgirl";
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded.user;
            next();
            } catch (ex) {
                return res.status(401).send({ message: "Invalid Token" });
                }
                
}
module.exports=fetchUser;