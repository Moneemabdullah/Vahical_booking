import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../app"; // import your Express app

export default (req: VercelRequest, res: VercelResponse) => {
    app(req, res); // Pass every request to Express
};
