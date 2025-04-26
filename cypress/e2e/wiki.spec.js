
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

  it("Should search for an item", () => {
    cy.get("[data-cy='wiki-search']").find("input[type='search']").type(item);
    cy.get("[data-cy='wiki-search']").find("button").click();

    cy.get(".flex.flex-wrap").should("contain", item);
  });

  it("Should filter by category", () => {
    cy.get("#category-filter").select("Resources");

    cy.get(".flex.flex-wrap").should("contain", "Aloe");
    cy.get(".flex.flex-wrap").should("contain", "Wood");
    cy.get(".flex.flex-wrap").should("not.contain", item);
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
