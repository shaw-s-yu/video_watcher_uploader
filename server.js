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
import fs from 'fs';

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
  console.log('post')
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

app.get('/video', (req, res)=>{
  console.log('get')
  const videoPath = 'uploads/86561024-9b56-4a07-8933-6108da837af5.mp4'
  var file = path.resolve(__dirname,videoPath);
  fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404);
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.sendStatus(416);
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
})

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname + "/ui/build/index.html"));
});

const server = createServer(app);
server.listen(process.env.PORT || 3000);
