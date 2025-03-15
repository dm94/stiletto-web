const itemsRequest = () => {
  cy.intercept(
    { method: "GET", url: "**/items" },
    { fixture: "items.json" }
  ).as("getItems");
};

const tradesRequest = () => {
  cy.intercept(
    { method: "GET", url: "**/trades*" },
    { fixture: "trades.json" },
  ).as("getTrades");

  cy.intercept(
    { method: "GET", url: "**/clusters*" },
    { fixture: "clusters.json" },
  ).as("getClusters");
};

const clansRequest = () => {
  cy.intercept(
    { method: "GET", url: "**/clans*" },
    { statusCode: 202, fixture: "clans.json" },
  ).as("getClans");
};

const imageRequests = () => {
  cy.intercept({ method: "GET", url: "**/items/*" }, { fixture: "aloe.png" }).as(
    "itemMock",
  );

  cy.intercept(
    { method: "GET", url: "**/symbols/*" },
    { fixture: "aloe.png" },
  ).as("symbolMock");

  cy.intercept({ method: "GET", url: "**/maps/*" }, { fixture: "map.jpg" }).as(
    "mapMock",
  );
};

const recipeRequests = () => {
  cy.intercept(
    { method: "POST", url: "**/recipes*" },
    { statusCode: 201, fixture: "recipes.json" },
  ).as("addRecipe");

  cy.intercept(
    { method: "GET", url: "**/recipes/*" },
    { statusCode: 200, fixture: "recipes.json" },
  ).as("getRecipe");
};

const mapRequest = () => {
  cy.intercept(
    { method: "GET", url: "**/maps/*/resources*" },
    { statusCode: 200, fixture: "get-resources.json" },
  ).as("getResources");

  cy.intercept(
    { method: "POST", url: "**/maps/*/resources*" },
    { statusCode: 202, fixture: "add-resource-map.json" },
  ).as("addResourceMap");

  cy.intercept(
    { method: "DELETE", url: "**/maps/*/resources*" },
    { statusCode: 204 },
  ).as("deleteResource");

  cy.intercept(
    { method: "POST", url: "**/maps" },
    { statusCode: 201, fixture: "add-map.json" },
  ).as("addMap");

  cy.intercept(
    { method: "GET", url: "**/maps" },
    { statusCode: 200, fixture: "get-map.json" },
  ).as("getMap");
};

Cypress.Commands.add("userRequest", () => {
  cy.intercept("GET", "**/users*", {
    statusCode: 200,
    fixture: "users.json",
  }).as("getUser");
});

Cypress.Commands.add("checkValueInClipboard", (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.contain(value);
    });
  });
});

Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.wait(500); // Pequeña espera para asegurar que la página ha cargado completamente
});

Cypress.Commands.add("interceptLoguedRequest", () => {
  cy.userRequest();
});

Cypress.Commands.add("interceptRequest", () => {
  itemsRequest();
  tradesRequest();
  clansRequest();
  imageRequests();
  recipeRequests();
  mapRequest();
});

// Comando para verificar si un elemento existe y es visible
Cypress.Commands.add("isVisible", (selector) => {
  cy.get("body").then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).should("be.visible");
      return true;
    }
    return false;
  });
});

// Comando para hacer click en un elemento si existe
Cypress.Commands.add("clickIfExists", (selector) => {
  cy.get("body").then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).click();
    }
  });
});
