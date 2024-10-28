export const convertHandleToString = (str?: string): string => {
  return str?.replace(/-/g, " ") || "";
};

export const convertStringToHandle = (str?: string): string => {
  return str?.replace(/\s+/g, "-") || "";
};

export const normalizeValue = (
  value: number,
  fromPrice: number,
  toPrice: number
) => {
  if (toPrice === fromPrice) return 0;
  return ((value - fromPrice) / (toPrice - fromPrice)) * 100;
};

export const mapToOriginalValue = (
  normalizedValue: number,
  fromPrice: number,
  toPrice: number
) => {
  return fromPrice + (normalizedValue / 100) * (toPrice - fromPrice);
};
