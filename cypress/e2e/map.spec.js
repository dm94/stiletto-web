describe("Map", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='map-link']").click();
    cy.url().should("include", "/map");
  });

  it("Should load the map page", () => {
    // Esperar a que se carguen los mapas
    cy.wait("@getMap");
    
    // Verificar que el título de la página es correcto
    cy.contains("Maps").should("be.visible");
    
    // Verificar que el mapa se muestra
    cy.get("[data-cy='map-container']").should("be.visible");
  });

  it("Should display map resources", () => {
    // Esperar a que se carguen los mapas y recursos
    cy.wait("@getMap");
    cy.wait("@getResources");
    
    // Verificar que se muestran los recursos en el mapa
    cy.get("[data-cy='map-resources']").should("be.visible");
    cy.get("[data-cy='resource-marker']").should("have.length.at.least", 1);
  });

  it("Should allow adding a new resource to the map", () => {
    // Esperar a que se carguen los mapas
    cy.wait("@getMap");
    
    // Hacer clic en el botón para añadir un recurso
    cy.get("[data-cy='add-resource-btn']").click();
    
    // Rellenar el formulario
    cy.get("[data-cy='resource-type-select']").select("Aloe");
    cy.get("[data-cy='resource-quantity-input']").type("5");
    cy.get("[data-cy='resource-coordinates-x']").type("100");
    cy.get("[data-cy='resource-coordinates-y']").type("200");
    
    // Enviar el formulario
    cy.get("[data-cy='submit-resource-btn']").click();
    
    // Esperar a que se complete la petición
    cy.wait("@addResourceMap");
    
    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='resource-added-success']").should("be.visible");
  });

  it("Should allow removing a resource from the map", () => {
    // Esperar a que se carguen los mapas y recursos
    cy.wait("@getMap");
    cy.wait("@getResources");
    
    // Hacer clic en un recurso
    cy.get("[data-cy='resource-marker']").first().click();
    
    // Hacer clic en el botón para eliminar el recurso
    cy.get("[data-cy='delete-resource-btn']").click();
    
    // Confirmar la eliminación
    cy.get("[data-cy='confirm-delete-resource-btn']").click();
    
    // Esperar a que se complete la petición
    cy.wait("@deleteResource");
    
    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='resource-deleted-success']").should("be.visible");
  });

  it("Should allow adding a new map", () => {
    // Interceptar la petición para añadir un mapa
    cy.intercept("POST", "**/maps", {
      statusCode: 201,
      body: {
        id: "newmap123",
        name: "New Test Map"
      }
    }).as("addNewMap");
    
    // Hacer clic en el botón para añadir un mapa
    cy.get("[data-cy='add-map-btn']").click();
    
    // Rellenar el formulario
    cy.get("[data-cy='map-name-input']").type("New Test Map");
    cy.get("[data-cy='map-description-input']").type("This is a test map");
    
    // Subir una imagen (simulado)
    cy.get("[data-cy='map-image-input']").attachFile("map.jpg");
    
    // Enviar el formulario
    cy.get("[data-cy='submit-map-btn']").click();
    
    // Esperar a que se complete la petición
    cy.wait("@addNewMap");
    
    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='map-added-success']").should("be.visible");
  });

  it("Should allow switching between maps", () => {
    // Esperar a que se carguen los mapas
    cy.wait("@getMap");
    
    // Verificar que hay un selector de mapas
    cy.get("[data-cy='map-selector']").should("be.visible");
    
    // Seleccionar otro mapa
    cy.get("[data-cy='map-selector']").select(1);
    
    // Esperar a que se carguen los recursos del nuevo mapa
    cy.wait("@getResources");
    
    // Verificar que se ha cambiado el mapa
    cy.get("[data-cy='current-map-name']").should("not.be.empty");
  });

  it("Should allow filtering resources by type", () => {
    // Esperar a que se carguen los mapas y recursos
    cy.wait("@getMap");
    cy.wait("@getResources");
    
    // Verificar que hay un filtro de recursos
    cy.get("[data-cy='resource-filter']").should("be.visible");
    
    // Seleccionar un tipo de recurso
    cy.get("[data-cy='resource-filter']").select("Aloe");
    
    // Verificar que se filtran los recursos
    cy.get("[data-cy='resource-marker']").should("have.length.at.least", 0);
  });
});
