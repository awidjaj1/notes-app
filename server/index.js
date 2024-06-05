import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.js";
import {register} from "./controllers/auth.js";


/* CONFIGURATIONS */
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
//load environment variables from .env file into process.env obj; use for backend port and mongo url
dotenv.config(); 
const app = express();
//parse json payloads in req, increase limit for file uploads
app.use(express.json({limit: "30mb"}));
//parse urlencoded payloads using qs library (better)
app.use(express.urlencoded({limit: "30mb", extended: true}));
//sets HTTP headers in resp for security
app.use(helmet());
//for logging
app.use(morgan("common"));
//to access cross origin resources -- resources from a different origin
app.use(cors());
//store static files in public/assets and create a the virtual path prefix /assets
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE CONFIGURATIONS (for file uploads) */
// store files locally on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //store uploaded files in public/assets
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        //save the file using its original name
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage})

/* ROUTES WITH FILES */
//parse multipart/form-data in request (extracts the file from the picture field of the form)
//then stores the file in the storage and attaches its info to req.file in register cb
//rest of form data is in the req.body (note this route is not included in authRoutes since
//it needs to access the upload object)
app.post("/auth/register", upload.single("picture"), register);

/* ROUTES */
app.use("/auth", authRoutes);

/* MONGOOSE SETUP (use mongoose to make working with MongoDB easier) */
//default to port 6001 if port not defined in env
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL) //connect to mongo db
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); //listen backend port when connected to db
    })
    .catch((err) => console.log(`${err} did not connect`)) //notify error if there is one