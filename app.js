const socialMediaRoute = require("./routers/socialMediaRoute");
const commentRoute = require("./routers/commentRoute");
const photoRoute = require("./routers/photoRoute");
const userRoute = require("./routers/userRoute");
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req,res) => {
    res.status(200).json({message:"final project 2 tim 3"})
});

app.use(userRoute);
app.use(photoRoute);
app.use(commentRoute);
app.use(socialMediaRoute);

// app.listen(port,() => {
//     console.log(`app listen at port:${port}`);
// })

module.exports = app;