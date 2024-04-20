const mongoose = require("mongoose");

const videoDetails = new mongoose.Schema({
  // ,channel name ,saved, video thumbnail image url,category

  video_url: {
    type: String,
  },
  title: {
    type: String,
  },
  view_count: {
    type: String,
  },
  video_description: {
    type: String,
  },
  video_published_date: {
    type: String,
  },
  channel_logo: {
    type: String,
  },
  channel_subscribers: {
    type: String,
  },
  channel_name: {
    type: String,
  },
  savedStatus: {
    type: String,
  },
  category: {
    type: String,
  },
  thumbnail_url: {
    type: String,
  },
});

const Videos = mongoose.model("VideosDetails", videoDetails);
module.exports = Videos;
