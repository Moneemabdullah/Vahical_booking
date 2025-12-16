import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    nodeMode: process.env.NODE_MODE || "production",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    dbUri: process.env.CONNECTION_STR || "",
    jwtSecret: process.env.JWT_SECRET || "",
    baseUrl:
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`,
};

export default config;
