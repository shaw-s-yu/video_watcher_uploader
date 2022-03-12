import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import mysql from "mysql";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v4 } from "uuid";
import * as utils from "./utils.js";
import cors from "cors";

var storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.UPLOAD_DESTINATION);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${v4()}.${utils.getFileExtensionFromFileName(file.originalname)}`
    );
  },
});

var upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
config();
app.use(express.static(path.join(__dirname, "ui/build")));
app.use(cors());

// eslint-disable-next-line no-unused-vars
const sqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

app.post("/upload", upload.any(), async (req, res) => {
  try {
    const { last_modified, durations } = req.body;
    const lastModifiedList = JSON.parse(last_modified);
    const durationList = JSON.parse(durations);
    for (let i = 0; i < req.files.length; i++) {
      const { originalname, path, size } = req.files[i];
      const fileType = utils.isFileVideo(originalname)
        ? "video"
        : utils.isFileImage(originalname)
        ? "image"
        : "doc";
      const sql = `
    	insert into ssy_static_store.file_blob (name, create_time, size, path, author, duration, type)
    	values
    	(
        '${originalname}', 
        '${lastModifiedList[i]}',
        '${size}', 
        '${path}', 
        null, 
        '${durationList[i]}', 
        '${fileType}'
      );
    `;

      await sqlConnection.query(sql);
    }

    res.send({
      error: false,
      message: "done",
      data: null,
    });
  } catch (e) {
    res.send({
      error: true,
      message: e.message,
      data: null,
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname + "/ui/build/index.html"));
});

const server = createServer(app);
server.listen(process.env.PORT || 3000);
