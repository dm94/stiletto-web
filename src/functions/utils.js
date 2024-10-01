export const getDomain = () => window.location.protocol.concat("//").concat(window.location.hostname) + (window.location.port ? ":" + window.location.port : "");

export const getItemUrl = (item) => getDomain() + "/item/" + encodeURI(item.toLowerCase().replaceAll(" ", "_"));