export function isInvalid(field, errors) {
  return Boolean(errors.find((i) => i.param === field));
}
