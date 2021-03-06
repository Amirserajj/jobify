import express from "express";

const app = express();
import dotenv from "dotenv";

dotenv.config();
import "express-async-errors";
import morgan from "morgan";

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware
import notFoundMW from "./middlewares/not-found.js";
import errorHandlerMW from "./middlewares/error-handler.js";
import authenticatedUser from "./middlewares/auth.js";

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticatedUser, jobsRouter);

app.use(notFoundMW);
app.use(errorHandlerMW);

const port = process.env.PORT;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
