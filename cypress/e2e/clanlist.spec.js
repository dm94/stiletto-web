describe("Clan List", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='clanlist-link']").click();
    cy.url().should("include", "/clans");
  });

  it("Should load the clan list page", () => {
    cy.wait("@getClans");

    cy.contains("Clans").should("be.visible");

    cy.get("[data-cy='clan-list']").should("be.visible");
  });

  it("Should display clan information correctly", () => {
    cy.wait("@getClans");

    cy.get("[data-cy='clan-item']").first().within(() => {
      cy.get("[data-cy='clan-name']").should("be.visible");
      cy.get("[data-cy='clan-members']").should("be.visible");
      cy.get("[data-cy='clan-leader']").should("be.visible");
    });
  });

  it("Should allow searching for clans", () => {
    cy.wait("@getClans");

    const searchTerm = "Test";
    cy.get("[data-cy='clan-search']").type(searchTerm);

    cy.get("[data-cy='clan-item']").should("have.length.at.least", 1);
    cy.get("[data-cy='clan-name']").first().should("contain", searchTerm);
  });

  it("Should allow sorting clans", () => {
    cy.wait("@getClans");

    cy.get("[data-cy='sort-by-name']").click();

    cy.get("[data-cy='clan-name']").then($elements => {
      const names = $elements.map((i, el) => Cypress.$(el).text()).get();
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sortedNames);
    });
  });

  it("Should allow viewing clan details", () => {
    cy.wait("@getClans");

    cy.get("[data-cy='clan-item']").first().click();

    cy.url().should("include", "/clan/");
    cy.get("[data-cy='clan-details']").should("be.visible");
    cy.get("[data-cy='clan-members-list']").should("be.visible");
  });

  it("Should show empty state when no clans match search", () => {
    cy.wait("@getClans");

    cy.get("[data-cy='clan-search']").type("NonExistentClan123456");

    cy.get("[data-cy='no-clans-found']").should("be.visible");
  });

  it("Should allow creating a new clan", () => {
    cy.intercept("POST", "**/clans", {
      statusCode: 201,
      body: {
        id: "newclan123",
        name: "New Test Clan"
      }
    }).as("createClan");

    cy.get("[data-cy='create-clan-btn']").click();

    cy.get("[data-cy='clan-name-input']").type("New Test Clan");
    cy.get("[data-cy='clan-tag-input']").type("NTC");

    cy.get("[data-cy='submit-clan-btn']").click();

    cy.wait("@createClan");

    cy.get("[data-cy='clan-created-success']").should("be.visible");
  });
});
