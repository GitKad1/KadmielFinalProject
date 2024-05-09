const data = {
  states: require("../model/states.json"),
  setStates: function (data) {
    this.states = data;
  },
};

const stateCheck = (req, res, next) => {
  const stateCodes = data.states.map((stat) => stat.code);
  const stateCode = stateCodes.find(
    (code) => code === req.params.state.toUpperCase()
  );
  if (!stateCode) {
    return res
      .status(400)
      .json({ message: `State code ${req.params.state} not found` });
  }
  req.code = stateCode;
  next();
};

module.exports = stateCheck;
