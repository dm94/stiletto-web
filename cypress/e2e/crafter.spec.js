const item = "Sand Bed";

describe("Crafter", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-cy='crafter-link']").click();
  });
  it("Add an item and share it", () => {
    cy.get("[data-cy='crafter-search']").type(item);

    cy.get("li[class='list-group-item']")
      .first()
      .within(() => {
        cy.get("button").click();
      });
    cy.get("div[class='col-12 card-group']")
      .first()
      .within(() => {
        cy.get("a").contains(item);
      });

    cy.get("[data-cy='share-crafter-btn']").click();

    cy.get("[data-cy='share-crafter-input']").should(
      "contain.value",
      "63e00d26982e2b509d5cde92"
    );
  });
  it("Add an item several times and check the counter", () => {
    const count = Math.floor(Math.random() * 10) + 1;

    cy.get("[data-cy='crafter-search']").type(item);

    Cypress._.times(count, () => {
      cy.get("li[class='list-group-item']")
        .first()
        .within(() => {
          cy.get("button").click();
        });
    });

    cy.get("div[class='col-12 card-group']")
      .first()
      .within(() => {
        cy.get("[type='number']").first().should("have.value", count);
      });
  });
  it("Add an item and copy it", () => {
    cy.get("[data-cy='crafter-search']").type(item);

    cy.get("li[class='list-group-item']")
      .first()
      .within(() => {
        cy.get("button").click();
      });

    cy.get("button[data-cy='crafter-copy-clipboard']").click();
    cy.checkValueInClipboard(item);
  });
});
