export const updateLang = (parameter) => {
  if (
    parameter.startsWith("room") ||
    parameter.startsWith("tree") ||
    parameter.startsWith("start") ||
    parameter.startsWith("time")
  ) {
    localStorage.setItem("lang", "en");
    return "en";
  } else if (
    parameter.startsWith("sala") ||
    parameter.startsWith("arvore") ||
    parameter.startsWith("inici") ||
    parameter.startsWith("tempo")
  ) {
    localStorage.setItem("lang", "pt");
    return "pt";
  }
  return localStorage.getItem("lang");
};
