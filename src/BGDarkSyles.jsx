export function getStyle(type) {
  let darkmode = localStorage.getItem("darkmode");
  if (darkmode == null) {
    darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    localStorage.setItem("darkmode", darkmode);
  }

  return type;

  switch (type) {
    case "list-group-item d-flex justify-content-between lh-condensed":
      return "list-group-item list-group-item-dark d-flex justify-content-between lh-condensed";
    case "list-group-item":
      return "list-group-item list-group-item-dark";
    case "list-group-item btn-block":
      return "list-group-item text-white bg-dark btn-block border border-primary";
    case "card mb-3":
      return "card mb-3 text-white bg-dark border-0";
    default:
      return type;
      return darkmode !== "true" ? type : type + " text-white bg-dark";
  }
}
