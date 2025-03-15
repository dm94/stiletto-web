describe("Trades", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='trades-link']").click();
    cy.url().should("include", "/trades");
  });

  it("Should load the trades page", () => {
    cy.wait("@getTrades");

    cy.contains("Trades").should("be.visible");

    cy.get("[data-cy='trade-list']").should("be.visible");
  });

  it("Should display trade information correctly", () => {
    cy.wait("@getTrades");

    cy.get("[data-cy='trade-item']").first().within(() => {
      cy.get("[data-cy='trade-card']").should("be.visible");
      cy.get("[data-cy='trade-resource']").should("be.visible");
      cy.get("[data-cy='trade-price']").should("be.visible");
    });
  });

  it("Should allow searching for trades", () => {
    cy.wait("@getTrades");

    cy.get("[data-cy='resource-type-filter']").select("Wood");

    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow filtering trades by type", () => {
    cy.wait("@getTrades");

    cy.get("[data-cy='trade-type-filter']").select("Supply");

    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow filtering trades by region", () => {
    cy.wait("@getTrades");

    cy.get("[data-cy='region-filter']").select("EU");

    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow pagination of trades", () => {
    cy.wait("@getTrades");

    cy.get("[data-cy='pagination']").should("be.visible");

    cy.get("[data-cy='pagination']").then(($pagination) => {
      if ($pagination.find("button").length > 1) {
        cy.get("[data-cy='pagination'] button").eq(1).click();
        cy.wait("@getTrades");
      }
    });
  });

  it("Should show form to create a trade when logged in", () => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptLoguedRequest();

    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTrades");

    cy.contains("Publish a trade").should("be.visible");
    cy.get("[data-cy='trade-type']").should("be.visible");
    cy.get("[data-cy='resource-type']").should("be.visible");
  });

  it("Should create a new trade when form is submitted", () => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptLoguedRequest();

    cy.intercept("POST", "**/trades", {
      statusCode: 201,
      body: {
        id: "newtrade123",
        resource: "Wood",
        type: "Supply",
        amount: "5",
        region: "EU",
        quality: "0",
        price: "100"
      }
    }).as("createTrade");

    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTrades");

    cy.get("[data-cy='trade-type']").select("Supply");
    cy.get("[data-cy='resource-type']").select("Wood");
    cy.get("[data-cy='region-input']").select("EU");
    cy.get("[data-cy='amount-input']").clear().type("5"); // Amount
    cy.get("[data-cy='quality-input']").clear().type("0"); // Quality
    cy.get("[data-cy='price-input']").clear().type("100"); // Price

    cy.get("[data-cy='create-trade-form']").submit();

    cy.wait("@createTrade");

    cy.wait("@getTrades");
  });

  it("Should allow deleting a trade when user is the owner", () => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");

    cy.intercept("GET", "**/trades*", {
      statusCode: 200,
      body: [{
        idtrade: "123",
        resource: "Wood",
        type: "Supply",
        amount: "5",
        region: "EU",
        quality: "0",
        price: "100",
        discordid: "00000000000000000000000000000000",
        discordtag: "user#1234"
      }]
    }).as("getTradesWithOwner");

    cy.intercept("DELETE", "**/trades/123", {
      statusCode: 204
    }).as("deleteTrade");

    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTradesWithOwner");

    cy.get("[data-cy='delete-trade-btn']").should("be.visible");

    cy.get("[data-cy='delete-trade-btn']").click();

    cy.wait("@deleteTrade");

    cy.wait("@getTradesWithOwner");
  });
});
