describe("Tech Tree", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/tech");
    cy.url().should("include", "/tech");
  });

  it("Should display the tech tree correctly", () => {
    cy.get("[data-cy='tech-tree-container']").should("be.visible");
    cy.get("[data-cy='tech-tree-title']").should("exist");
    cy.get("[data-cy='tech-nodes']").should("exist");
  });

  it("Should allow selecting different tech trees", () => {
    cy.get("[data-cy='tech-tree-selector']").select("walker");
    cy.get("[data-cy='tech-tree-container']").should("be.visible");
    cy.get("[data-cy='tech-nodes']").should("exist");

    cy.get("[data-cy='tech-tree-selector']").select("station");
    cy.get("[data-cy='tech-tree-container']").should("be.visible");
    cy.get("[data-cy='tech-nodes']").should("exist");
  });

  it("Should display tech node details when clicking on a node", () => {
    cy.get("[data-cy='tech-node']").first().click();

    cy.get("[data-cy='tech-node-details']").should("be.visible");
    cy.get("[data-cy='tech-node-name']").should("exist");
    cy.get("[data-cy='tech-node-description']").should("exist");
    cy.get("[data-cy='tech-node-requirements']").should("exist");
  });

  it("Should highlight connected nodes when hovering over a node", () => {
    cy.get("[data-cy='tech-node']").first().trigger("mouseover");

    cy.get("[data-cy='tech-node-connected']").should("have.class", "highlighted");
  });

  it("Should allow searching for specific technologies", () => {
    const searchTerm = "Firefly";
    cy.get("[data-cy='tech-search']").type(searchTerm);
    cy.get("[data-cy='tech-search-btn']").click();

    cy.get("[data-cy='tech-search-results']").should("be.visible");
    cy.get("[data-cy='tech-search-result']").should("contain.text", searchTerm);
  });

  it("Should allow calculating tech costs", () => {
    cy.get("[data-cy='tech-node']").first().click();
    cy.get("[data-cy='calculate-cost-btn']").click();

    cy.get("[data-cy='tech-cost-breakdown']").should("be.visible");
    cy.get("[data-cy='tech-cost-total']").should("exist");
    cy.get("[data-cy='tech-cost-items']").should("exist");
  });

  it("Should allow creating a tech path when logged in", () => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptLoguedRequest();

    cy.get("[data-cy='create-tech-path-btn']").click();

    // Select multiple nodes
    cy.get("[data-cy='tech-node']").eq(0).click({ ctrlKey: true });
    cy.get("[data-cy='tech-node']").eq(1).click({ ctrlKey: true });
    cy.get("[data-cy='tech-node']").eq(2).click({ ctrlKey: true });

    cy.get("[data-cy='save-tech-path-btn']").click();
    cy.get("[data-cy='tech-path-name-input']").type("My Test Path");
    cy.get("[data-cy='confirm-save-path-btn']").click();

    cy.get("[data-cy='path-saved-message']").should("be.visible");
  });
});
