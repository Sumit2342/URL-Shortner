const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrl", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const ShortUrl = await shortUrl.findOne({ short: req.params.shortUrl });
  if (ShortUrl == null) {
    res.sendStatus(404);
  }
  ShortUrl.clicks++;
  ShortUrl.save();
  res.redirect(ShortUrl.full);
});

app.listen(process.env.PORT || 5000);
