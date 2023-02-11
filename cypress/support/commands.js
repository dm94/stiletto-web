const tradesRequest = () => {
  cy.intercept(
    { method: "GET", url: "/trades" },
    { fixture: "trades.json" }
  ).as("trades");
  cy.intercept(
    { method: "GET", url: "/clusters" },
    { fixture: "clusters.json" }
  ).as("clusters");
};

const clansRequest = () => {
  cy.intercept({ method: "GET", url: "/clans" }, { fixture: "clans.json" }).as(
    "clans"
  );
};

const imageRequests = () => {
  cy.intercept({ method: "GET", url: "/items/*" }, { fixture: "aloe.png" }).as(
    "itemMock"
  );
};

const recipeRequets = () => {
  cy.intercept(
    { method: "POST", url: "**/recipes*" },
    { statusCode: 201, fixture: "recipes.json" }
  ).as("recipes");
};

Cypress.Commands.add("checkValueInClipboard", (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.contain(value);
    });
  });
});

Cypress.Commands.add("interceptRequest", () => {
  tradesRequest();
  clansRequest();
  imageRequests();
  recipeRequets();
});
