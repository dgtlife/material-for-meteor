/**
 * @file Defines the API for MD Stepdots
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */

/**
 * Generate the dots array of objects for various quantities of stepdots.
 * @param {String} qty - the quantity of stepdots
 * @returns {Array}
 */
const makeDots = (qty) => {
  const dots = [];
  for (let j = 1; j <= qty; j += 1) {
    dots.push({ i: j });
  }

  return dots;
};

export default makeDots;
