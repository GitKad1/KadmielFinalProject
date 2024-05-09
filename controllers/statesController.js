const data = {
  states: require("../model/states.json"),
  setStates: function (data) {
    this.states = data;
  },
};

dbStates = require("../model/State");

const getAllStates = async (req, res) => {
  const funStates = await dbStates.find();

  const mongoData = funStates.reduce((acc, cur) => {
    acc[cur.stateCode] = cur;
    return acc;
  }, {});

  let fileStates;

  if (!req.query) {
    console.log(req.query);
    fileStates = data.states.map((state) => ({
      ...state,
      funfacts: (mongoData[state.code] && mongoData[state.code].funfacts) || [],
    }));
  } else if (req.query.contig === true) {
    console.log(req.query);
    fileStates = data.states
      .filter((state) => state.code !== "AK" && state.code !== "HI")
      .map((state) => ({
        ...state,
        funfacts:
          (mongoData[state.code] && mongoData[state.code].funfacts) || [],
      }));
  } else if (req.query.contig === false) {
    console.log(req.query);
    fileStates = data.states
      .filter((state) => state.code === "AK" || state.code === "HI")
      .map((state) => ({
        ...state,
        funfacts:
          (mongoData[state.code] && mongoData[state.code].funfacts) || [],
      }));
  }

  res.json(fileStates);
};

const getRandomStateFact = async (req, res) => {
  const funState = await dbStates.findOne({ stateCode: req.code });

  if (funState) {
    const index =
      Math.floor(Math.random() * (funState.funfacts.length - 1)) + 1;

    funFact = funState.funfacts[index];
  } else {
    return res.status(400).json({
      message: `State code ${req.params.state} has no fun facts at this time.`,
    });
  }
  res.json(funFact);
};

const getStateCapital = async (req, res) => {
  const state = data.states.find((stat) => stat.code === req.code);

  const fileState = {
    state: state.state,
    capital: state.capital_city,
  };
  res.json(fileState);
};

const getStateNickname = async (req, res) => {
  const state = data.states.find((stat) => stat.code === req.code);

  const fileState = {
    state: state.state,
    nickname: state.nickname,
  };
  res.json(fileState);
};

const getStatePopulation = async (req, res) => {
  const state = data.states.find((stat) => stat.code === req.code);

  const fileState = {
    state: state.state,
    population: state.population,
  };
  res.json(fileState);
};

const getStateAdmission = async (req, res) => {
  const state = data.states.find((stat) => stat.code === req.code);

  const fileState = {
    state: state.state,
    admitted: state.admission_number,
  };
  res.json(fileState);
};

const createNewState = async (req, res) => {
  if (
    !req?.body?.funfacts ||
    !Array.isArray(req.body.funfacts) ||
    !req.body.funfacts.length
  ) {
    return res.status(400).json({
      message:
        "A funfacts array with at least one fun fact is required to create a new state.",
    });
  }

  const funState = await dbStates.findOne({ stateCode: req.code });

  if (!funState) {
    try {
      const result = await dbStates.create({
        stateCode: req.code,
        funfacts: req.body.funfacts,
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    funState.funfacts = funState.funfacts.concat(req.body.funfacts);
    const result = await funState.save();
    res.json(result);
  }
};

const updateStateFact = async (req, res) => {
  if (
    !req?.body?.funfact ||
    !typeof req.body.funfact == String ||
    !req.body.funfact.length
  ) {
    return res.status(400).json({
      message:
        "A funfacts array with at least on fun fact is required to create a new state.",
    });
  }

  if (!req?.body?.index || !req.body.index) {
    return res.status(400).json({
      message:
        "An index property with an integer value greater than zero must be provided.",
    });
  }

  const funState = await dbStates.findOne({ stateCode: req.code });

  if (!funState) {
    return res
      .status(400)
      .json({ message: "This state does not have any facts to delete." });
  }

  if (funState.funfacts.length >= req.body.index) {
    try {
      funState.funfacts[req.body.index - 1] = req.body.funfact;
      const result = await funState.save();
      res.json(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    return res.status(400).json({
      message:
        "The index you provided does not correspond with a fact for this state.",
    });
  }
};

const deleteStateFact = async (req, res) => {
  if (!req?.body?.index || !req.body.index) {
    return res.status(400).json({
      message:
        "An index property with an integer value greater than zero must be provided.",
    });
  }

  const funState = await dbStates.findOne({ stateCode: req.code });

  if (!funState) {
    return res
      .status(400)
      .json({ message: "This state does not have any facts to delete." });
  }

  if (funState.funfacts.length >= req.body.index) {
    try {
      funState.funfacts = funState.funfacts.filter(
        (_, i) => i !== req.body.index - 1
      );
      const result = await funState.save();
      res.json(result);
    } catch (err) {
      console.error(err);
    }
  } else {
    return res.status(400).json({
      message:
        "The index you provided does not correspond with a fact for this state.",
    });
  }
};

const getState = async (req, res) => {
  const funState = await dbStates.findOne({ stateCode: req.code });

  const state = data.states.find((stat) => stat.code === req.code);
  if (!state) {
    return res
      .status(400)
      .json({ message: `State code ${req.params.state} not found` });
  }
  let fileState = state;
  if (funState) {
    let mongoData = {};
    mongoData[funState.stateCode] = funState;

    fileState = {
      ...state,
      funfacts: (mongoData[state.code] && mongoData[state.code].funfacts) || [],
    };
  }
  res.json(fileState);
};

module.exports = {
  getAllStates,
  getRandomStateFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
  createNewState,
  updateStateFact,
  deleteStateFact,
  getState,
};
