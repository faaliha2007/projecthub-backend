const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* 📁 Multer setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* 🧠 In-memory storage */
let profile = null;

/* 📌 POST profile */
app.post("/profile", upload.single("pic"), (req, res) => {
  if (!profile) profile = {};

  profile.name = req.body.name || profile.name;
  profile.bio = req.body.bio || profile.bio;

  if (req.file) {
    profile.pic = req.file.filename;
  }

  res.json(profile);
});

/* 📌 GET profile */
app.get("/profile", (req, res) => {
  res.json(profile);
});

/* 🚀 Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
