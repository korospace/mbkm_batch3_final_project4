const PhotoController = require("../controllers/photoController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/photoAuthorization");
const router = require("express").Router();

router.use(authentication);

router.post("/photos", PhotoController.create);
router.get("/photos", PhotoController.getAll);

router.use("/photos/:id", authorization);

router.put("/photos/:id", PhotoController.update);
router.delete("/photos/:id", PhotoController.delete);

module.exports = router;