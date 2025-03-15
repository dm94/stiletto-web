const item = "Sand Bed";

describe("Crafter", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='crafter-link']").click();
    cy.url().should("include", "/crafter");
  });

  it("Should search and add an item", () => {
    cy.get("[data-cy='crafter-search']").should("be.visible").type(item);
    cy.get("[data-cy='crafter-search']").should("have.value", item);

    cy.get('[data-cy="list-group-item"]').first().find("button").click();

    cy.get('[data-cy="selected-item"]').first().should("contain", item);
  });

  it("Should add an item and share it", () => {
    cy.get("[data-cy='crafter-search']").should("be.visible").type(item);

    cy.get('[data-cy="list-group-item"]').first().find("button").click();

    cy.get('[data-cy="selected-item"]').first().should("contain", item);

    cy.get("[data-cy='share-crafter-btn']").click();

    cy.wait("@addRecipe");

    cy.get("[data-cy='share-crafter-input']").should(
      "contain.value",
      "63e00d26982e2b509d5cde92"
    );
  });

  it("Should add an item several times and check the counter", () => {
    const count = 3;

    cy.get("[data-cy='crafter-search']").should("be.visible").type(item);

    for (let i = 0; i < count; i++) {
      cy.get('[data-cy="list-group-item"]').first().find("button").click();
    }

    cy.get('[data-cy="selected-item"]')
      .first()
      .find("input[type='number']")
      .should("have.value", count);
  });

  it("Should add an item and copy it", () => {
    cy.get("[data-cy='crafter-search']").should("be.visible").type(item);

    cy.get('[data-cy="list-group-item"]').first().find("button").click();

    cy.get("[data-cy='crafter-copy-clipboard']").click();

    cy.checkValueInClipboard(item);
  });

  it("Should remove an item when clicking the remove button", () => {
    cy.get("[data-cy='crafter-search']").should("be.visible").type(item);

    cy.get('[data-cy="list-group-item"]').first().find("button").click();

    cy.get('[data-cy="selected-item"]').should("exist");

    cy.get('[data-cy="selected-item"]').first().find("button[aria-label='Remove item']").click();

    cy.get('[data-cy="selected-item"]').should("not.exist");
  });
});
