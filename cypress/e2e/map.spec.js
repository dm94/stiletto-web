describe("Map", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='map-link']").click();
    cy.url().should("include", "/map");
  });

  it("Should load the map page", () => {
    cy.wait("@getMap");

    cy.contains("Maps").should("be.visible");

    cy.get("[data-cy='map-container']").should("be.visible");
  });

  it("Should display map resources", () => {
    cy.wait("@getMap");
    cy.wait("@getResources");

    cy.get("[data-cy='map-resources']").should("be.visible");
    cy.get("[data-cy='resource-marker']").should("have.length.at.least", 1);
  });

  it("Should allow adding a new resource to the map", () => {
    cy.wait("@getMap");

    cy.get("[data-cy='add-resource-btn']").click();

    cy.get("[data-cy='resource-type-select']").select("Aloe");
    cy.get("[data-cy='resource-quantity-input']").type("5");
    cy.get("[data-cy='resource-coordinates-x']").type("100");
    cy.get("[data-cy='resource-coordinates-y']").type("200");

    cy.get("[data-cy='submit-resource-btn']").click();

    cy.wait("@addResourceMap");

    cy.get("[data-cy='resource-added-success']").should("be.visible");
  });

  it("Should allow removing a resource from the map", () => {
    cy.wait("@getMap");
    cy.wait("@getResources");

    cy.get("[data-cy='resource-marker']").first().click();

    cy.get("[data-cy='delete-resource-btn']").click();

    cy.get("[data-cy='confirm-delete-resource-btn']").click();

    cy.wait("@deleteResource");

    cy.get("[data-cy='resource-deleted-success']").should("be.visible");
  });

  it("Should allow adding a new map", () => {
    cy.intercept("POST", "**/maps", {
      statusCode: 201,
      body: {
        id: "newmap123",
        name: "New Test Map"
      }
    }).as("addNewMap");

    cy.get("[data-cy='add-map-btn']").click();

    cy.get("[data-cy='map-name-input']").type("New Test Map");
    cy.get("[data-cy='map-description-input']").type("This is a test map");

    cy.get("[data-cy='map-image-input']").attachFile("map.jpg");

    cy.get("[data-cy='submit-map-btn']").click();

    cy.wait("@addNewMap");

    cy.get("[data-cy='map-added-success']").should("be.visible");
  });

  it("Should allow switching between maps", () => {
    cy.wait("@getMap");

    cy.get("[data-cy='map-selector']").should("be.visible");

    cy.get("[data-cy='map-selector']").select(1);

    cy.wait("@getResources");

    cy.get("[data-cy='current-map-name']").should("not.be.empty");
  });

  it("Should allow filtering resources by type", () => {
    cy.wait("@getMap");
    cy.wait("@getResources");

    cy.get("[data-cy='resource-filter']").should("be.visible");

    cy.get("[data-cy='resource-filter']").select("Aloe");

    cy.get("[data-cy='resource-marker']").should("have.length.at.least", 0);
  });
});
