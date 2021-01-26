export function getStyle(type) {
  const darkmode = localStorage.getItem("darkmode");
  switch (type) {
    case "listitem-profile":
      return darkmode !== "true"
        ? "list-group-item d-flex justify-content-between lh-condensed"
        : "list-group-item list-group-item-dark d-flex justify-content-between lh-condensed";
    case "list-group-item":
      return darkmode !== "true"
        ? "list-group-item"
        : "list-group-item list-group-item-dark";
    case "card-no-border":
      return darkmode !== "true"
        ? "card mb-3"
        : "card mb-3 text-white bg-dark border-0";
    default:
      return darkmode !== "true" ? type : type + " text-white bg-dark";
  }
}
