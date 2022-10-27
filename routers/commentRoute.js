const CommentController = require("../controllers/commentController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/commentAuthorization");
const router = require("express").Router();

router.use(authentication);

router.post("/comments", CommentController.create);
router.get("/comments", CommentController.getAll);

router.use("/comments/:id", authorization);

router.put("/comments/:id", CommentController.update);
router.delete("/comments/:id", CommentController.delete);

module.exports = router;