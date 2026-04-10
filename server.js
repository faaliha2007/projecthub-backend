const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* 📦 MongoDB */
mongoose.connect("mongodb://127.0.0.1:27017/peerhub")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* 📁 Multer setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* 🧾 Schema */
const Profile = mongoose.model("Profile", {
  name: String,
  bio: String,
  pic: String,
});

/* 📌 POST profile */
app.post("/profile", upload.single("pic"), async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = new Profile();
  }

  profile.name = req.body.name || profile.name;
  profile.bio = req.body.bio || profile.bio;

  if (req.file) {
    profile.pic = req.file.filename;
  }

  await profile.save();

  res.json(profile);
});

/* 📌 GET profile */
app.get("/profile", async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile);
});

/* 🚀 Start server */
app.listen(5000, () => console.log("Server running on port 5000"));