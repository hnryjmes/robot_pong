const AiInterface = function AiInterface() {
  this.MODELURL = 'https://burninglake.herokuapp.com/model/version_';
  this.model = {};
};

AiInterface.prototype.fetchModel = async function fetchModel(version) {
  if (!this.model[version]) {
    this.model[version] = await tf.loadModel(this.MODELURL + version);
  }
};

AiInterface.prototype.getMove = function getMove(version, hashInput) {
  if (version === 0) {
    return this.randomMove()
  }
  const aiInputArray = this._aiInputArray(hashInput);
  const moveRewards = this._makePredictions(version, aiInputArray);
  return this._choosesBestMove(moveRewards);
};

AiInterface.prototype._aiInputArray = function _aiInputArray(hashInput) {
  const keys = Object.keys(hashInput);
  return keys.map(k => hashInput[k]);
};

AiInterface.prototype._makePredictions = function _makePredictions(version, inputs) {
  const tfAiInputs = tf.tensor2d([inputs]);
  return this.model[version].predict(tfAiInputs).dataSync();
};

AiInterface.prototype._choosesBestMove = function _choosesBestMove(inputs) {
  const indexOfMove = inputs.indexOf(Math.max(...inputs));
  const move = indexOfMove - 1;
  return move;
};

AiInterface.prototype.randomMove = function randomMove() {
  return [-1, 0, 1][Math.round(Math.random() * 2)]
}

/* istanbul ignore next */
if (typeof module !== 'undefined' && Object.prototype.hasOwnProperty.call(module, 'exports')) {
  module.exports = AiInterface;
}
