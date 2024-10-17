export const convertHandleToString = (str?: string): string => {
  return str?.replace(/-/g, " ") || "";
};

export const convertStringToHandle = (str?: string): string => {
  return str?.replace(/\s+/g, "-") || "";
};
