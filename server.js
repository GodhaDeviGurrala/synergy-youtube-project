const express = require("express");
const mongoose = require("mongoose");
const Videos = require("./models/VideoDetails");
const cors = require("cors");
const User = require("./models/signupdetails");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware/jwtAuth");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://godhagurrala27:godha12345@cluster0.yglixjs.mongodb.net/synergyproject1?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("database connected ....!!");
  })
  .catch((err) => {
    console.error(err);
  });

app.post("/send-video-details", async (req, res) => {
  try {
    const sendVideoDetails = await Videos.create(req.body);

    return res
      .send(201)
      .json({ message: "video details saved successfully", sendVideoDetails });
  } catch (error) {
    console.log(error);
  }
});

// api to get the all video details
app.get("/get-video-details", async (req, res) => {
  try {
    const videos = await Videos.find({});
    res.status(200).json(videos);
  } catch (error) {
    console.log(error);
  }
});

// api to get individual data
app.get("/individualvideo/:id", async (req, res) => {
  try {
    // const id = req.params.id;
    const { id } = req.params;
    const video = await Videos.findById({ _id: id });
    res.status(200).json(video);
  } catch (error) {
    console.log(error);
  }
});

// sign up api
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res.status(404).json({ message: "user already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({ message: "user signedup successfully" });
  } catch (error) {
    console.log(error);
  }
});

// login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(406).json("User doesnot exist");
    }
    const passwordMatched = await bcrypt.compare(password, userExist.password);
    if (!passwordMatched) {
      return res.status(401).send("Invalid Password");
    }
    //payload  = { email: userExist.email }
    const token = jwt.sign({ email: userExist.email }, "secretToken", {
      expiresIn: "1hr",
    }); //create json webtoken
    res.status(200).json({ token, message: "loggedin successfully" });
  } catch (error) {
    console.log(error);
  }
});

// api to get trending videos
app.get("/get-video", async (req, res) => {
  const category = "Trending"
  console.log(`Category: ${category}`)
  try {
    const videos = await Videos.find({ category: category });
    res.json(videos);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// api to get gaming videosserver/server.js
app.get("/gamingvideos", async (req, res) => {
  try {
    const gamingVideos = await Videos.find({ category: "Gaming" });
    return res.status(200).json({ gamingVideos: gamingVideos });
  } catch (error) {
    console.log(error);
  }
});

// api to get saved videos
app.get("/SavedVideos", async (req, res) => {
  try {
    const SavedVideos = await Videos.find({ savedStatus: "Saved" });
    console.log("SavedVideos",SavedVideos)
    return res.status(200).json({ SavedVideos: SavedVideos });
  } catch (error) {
    console.log(error);
  }
});


// api to update the saved status
app.put("/videos/:id/save", async (req, res) => {

  const { id } = req.params;
  console.log(id);
  const { savedStatus } = req.body;
  console.log(savedStatus);
  try {
    const updatedVideo = await Videos.findByIdAndUpdate(
      id,
      { savedStatus },
      { new: true }
    );
    if (!updatedVideo) {
      return res.status(404).json("video not found");
    }

    res.json(updatedVideo);
  } catch (error) {
    console.log(error);
  }
});



const port = 5555;

app.listen(port, () => console.log(`Server is running at port ${port}`));
