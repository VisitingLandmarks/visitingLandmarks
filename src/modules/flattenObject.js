/**
 * flat structure for objects
 * @param {type} obj
 * @param {string} joinString
 * @param {object} flat
 * @param {string} prefix
 * @returns {object}
 */
const flattenObject = (obj, joinString = '.', flat = {}, prefix = '') => {
    Object.keys(obj).forEach((key) => {
        let value = obj[key];

        if (typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, joinString, flat, prefix + key + joinString);
            return;
        }

        flat[prefix + key] = value;
    });

    return flat;
};

export default flattenObject;
