export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const isArray = Array.isArray
export const extend = Object.assign;
export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}