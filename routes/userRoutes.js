const express = require("express");
const bcrypt = require("bcrypt")
const userRouter = express.Router();
const { UserModel}=require("../models/userModels");
const jwt=require("jsonwebtoken")


userRouter.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  console.log("Data in the body", req.body);

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, 10); // Use async/await

    console.log("Hashed password:", hash);

    // Create a new user instance
    const user = new UserModel({ username, email, password: hash });

    // Save the user to the database
    await user.save();

    res.status(201).send("New user has been created");
  } catch (error) {
    console.error("Error in signup user:", error);
    res.status(500).send("Error in signup user");
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          const accessToken = jwt.sign(
            { userID: user._id, user: user.username },
            "masai",
            {
              expiresIn:60,
            }
          );
          const refreshToken = jwt.sign({ batch: "cap-05" }, "school", {
            expiresIn: 500,
          });
          res.json({
            msg: "Login successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          res.status(401).json({ error: "Wrong password" });
        }
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports={
    userRouter
}