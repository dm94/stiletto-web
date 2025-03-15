const item = "Sand Bed";
const category = "Decorations";

describe("Wiki", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='wiki-link']").click();
    cy.url().should("include", "/wiki");
  });

  it("Should load the wiki page", () => {
    cy.contains("Last Oasis Wiki").should("be.visible");

    cy.get("[data-cy='wiki-search']").should("be.visible");

    cy.get("#category-filter").should("be.visible");
  });

  it("Should search for an item", () => {
    const searchTerm = "Sand";

    cy.get("[data-cy='wiki-search']").find("input[type='search']").type(searchTerm);
    cy.get("[data-cy='wiki-search']").find("button").click();

    cy.get(".flex.flex-wrap").should("contain", "Sand Bed");
  });

  it("Should filter by category", () => {
    cy.get("#category-filter").select("Resources");

    cy.get(".flex.flex-wrap").should("contain", "Aloe");
    cy.get(".flex.flex-wrap").should("contain", "Wood");
    cy.get(".flex.flex-wrap").should("not.contain", "Sand Bed");
  });

  it("Should show 'Nothing found' when no items match the search", () => {
    const searchTerm = "NonExistentItem";

    cy.get("[data-cy='wiki-search']").find("input[type='search']").type(searchTerm);
    cy.get("[data-cy='wiki-search']").find("button").click();

    cy.contains("Nothing found").should("be.visible");
  });

  it("Should search when pressing Enter key", () => {
    const searchTerm = "Wood";

    cy.get("[data-cy='wiki-search']").find("input[type='search']").type(searchTerm).type("{enter}");

    cy.get(".flex.flex-wrap").should("contain", "Wood");
  });

  it("Should combine search and category filter", () => {
    const searchTerm = "Wood";

    cy.get("[data-cy='wiki-search']").find("input[type='search']").type(searchTerm);
    cy.get("[data-cy='wiki-search']").find("button").click();

    cy.get("#category-filter").select("Crafting");

    cy.get("[data-cy='wiki-item']").first().should("contain", "Advanced Woodworking Station");
  });
});
