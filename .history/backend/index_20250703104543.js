const { execSync } = require('child_process');

function runJavaCalc(op, a, b = 0) {
  try {
    const result = execSync(`java -cp . Calculator ${op} ${a} ${b}`).toString();
    return result.trim();
  } catch (error) {
    console.error("Java execution failed:", error.stderr?.toString() || error.message);
    return "Error running Java calculation";
  }
}

module.exports = {
  add: (a, b) => runJavaCalc("add", a, b),
  subtract: (a, b) => runJavaCalc("sub", a, b),
  multiply: (a, b) => runJavaCalc("mul", a, b),
  divide: (a, b) => runJavaCalc("div", a, b),
  modulus: (a, b) => runJavaCalc("mod", a, b),
  power: (a, b) => runJavaCalc("pow", a, b),
  sqrt: (a) => runJavaCalc("sqrt", a),
  factorial: (a) => runJavaCalc("fact", a)
};
