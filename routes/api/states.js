const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

router
  .route("/states/:state/funfact/")
  .get(statesController.getRandomStateFact);
router.route("/states/:state/funfact/").post(statesController.createNewState);
router.route("/states/:state/funfact/").patch(statesController.updateStateFact);
router
  .route("/states/:state/funfact/")
  .delete(statesController.deleteStateFact);

router.route("/states/:state/capital/").get(statesController.getStateCapital);
router.route("/states/:state/nickname/").get(statesController.getStateNickname);
router
  .route("/states/:state/population/")
  .get(statesController.getStatePopulation);
router
  .route("/states/:state/admission/")
  .get(statesController.getStateAdmission);

router.route("/states/:state/").get(statesController.getState);

router.route("/states/").get(statesController.getAllStates);

module.exports = router;
