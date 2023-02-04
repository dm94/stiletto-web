const item = "Sand Bed";

describe("Wiki", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-cy='wiki-link']").click();
  });
  it("Search an item", () => {
    cy.get("[data-cy='wiki-search']")
      .first()
      .within(() => {
        cy.get("input").type(item);
        cy.get("button").click();
      });
    cy.get("[class='list-group-item']")
      .first()
      .within(() => {
        cy.get("a").contains(item);
        cy.get("a").click();
      });
    cy.get("[data-cy='wiki-item']").should("have.data", "name", item);
  });
});
