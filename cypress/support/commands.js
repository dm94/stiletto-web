export const itemsRequest = () => {
  cy.intercept(
    { method: "GET", url: "*/json/items_min.json" },
    { statusCode: 200, fixture: "items.json" }
  ).as("getItems");
};

export const tradesRequest = () => {
  cy.intercept(
    { method: "GET", url: "/api/trades*" },
    { statusCode: 200, fixture: "trades.json" }
  ).as("getTrades");

  cy.intercept(
    { method: "GET", url: "/api/clusters*" },
    { statusCode: 200, fixture: "clusters.json" }
  ).as("getClusters");
};

export const clansRequest = () => {
  cy.intercept(
    { method: "GET", url: "/api/clans*" },
    { statusCode: 200, fixture: "clans.json" }
  ).as("getClans");
};

export const imageRequests = () => {
  cy.intercept(
    { method: "GET", url: "/api/items/*" },
    { statusCode: 200, fixture: "aloe.png" }
  ).as("itemMock");

  cy.intercept(
    { method: "GET", url: "/api/symbols/*" },
    { statusCode: 200, fixture: "aloe.png" }
  ).as("symbolMock");

  cy.intercept(
    { method: "GET", url: "/api/maps/*" },
    { statusCode: 200, fixture: "map.jpg" }
  ).as("mapMock");
};

export const recipeRequests = () => {
  cy.intercept(
    { method: "POST", url: "/api/recipes*" },
    { statusCode: 201, fixture: "recipes.json" }
  ).as("addRecipe");

  cy.intercept(
    { method: "GET", url: "/api/recipes/*" },
    { statusCode: 200, fixture: "recipes.json" }
  ).as("getRecipe");
};

export const mapRequest = () => {
  cy.intercept(
    { method: "GET", url: "/api/maps/*/resources*" },
    { statusCode: 200, fixture: "get-resources.json" }
  ).as("getResources");

  cy.intercept(
    { method: "POST", url: "/api/maps/*/resources*" },
    { statusCode: 202, fixture: "add-resource-map.json" }
  ).as("addResourceMap");

  cy.intercept(
    { method: "DELETE", url: "/api/maps/*/resources*" },
    { statusCode: 204 }
  ).as("deleteResource");

  cy.intercept(
    { method: "POST", url: "/api/maps" },
    { statusCode: 201, fixture: "add-map.json" }
  ).as("addMap");

  cy.intercept(
    { method: "GET", url: "/api/maps" },
    { statusCode: 200, fixture: "get-map.json" }
  ).as("getMap");
};

Cypress.Commands.add("userRequest", () => {
  cy.intercept(
    "GET",
    "/api/users*",
    {
      statusCode: 200,
      fixture: "users.json",
    }
  ).as("getUser");
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
  cy.wait(500); // Small wait to ensure the page has fully loaded
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

// Command to check if an element exists and is visible
Cypress.Commands.add("isVisible", (selector) => {
  return cy.get("body").then($body => {
    const exists = $body.find(selector).length > 0;
    if (exists) {
      cy.get(selector).should("be.visible");
    }
    return exists;
  });
});

// Command to click on an element if it exists
Cypress.Commands.add("clickIfExists", (selector) => {
  cy.get("body").then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).click();
    }
  });
});
