describe("Clan List", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='clanlist-link']").click();
    cy.url().should("include", "/clans");
  });

  it("Should load the clan list page", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Verificar que el título de la página es correcto
    cy.contains("Clans").should("be.visible");
    
    // Verificar que la lista de clanes se muestra
    cy.get("[data-cy='clan-list']").should("be.visible");
  });

  it("Should display clan information correctly", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Verificar que se muestra la información del primer clan
    cy.get("[data-cy='clan-item']").first().within(() => {
      cy.get("[data-cy='clan-name']").should("be.visible");
      cy.get("[data-cy='clan-members']").should("be.visible");
      cy.get("[data-cy='clan-leader']").should("be.visible");
    });
  });

  it("Should allow searching for clans", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Buscar un clan
    const searchTerm = "Test";
    cy.get("[data-cy='clan-search']").type(searchTerm);
    
    // Verificar que se filtran los resultados
    cy.get("[data-cy='clan-item']").should("have.length.at.least", 1);
    cy.get("[data-cy='clan-name']").first().should("contain", searchTerm);
  });

  it("Should allow sorting clans", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Ordenar por nombre
    cy.get("[data-cy='sort-by-name']").click();
    
    // Verificar que los clanes están ordenados
    cy.get("[data-cy='clan-name']").then($elements => {
      const names = $elements.map((i, el) => Cypress.$(el).text()).get();
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sortedNames);
    });
  });

  it("Should allow viewing clan details", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Hacer clic en el primer clan
    cy.get("[data-cy='clan-item']").first().click();
    
    // Verificar que se muestra la página de detalles del clan
    cy.url().should("include", "/clan/");
    cy.get("[data-cy='clan-details']").should("be.visible");
    cy.get("[data-cy='clan-members-list']").should("be.visible");
  });

  it("Should show empty state when no clans match search", () => {
    // Esperar a que se carguen los clanes
    cy.wait("@getClans");
    
    // Buscar un clan que no existe
    cy.get("[data-cy='clan-search']").type("NonExistentClan123456");
    
    // Verificar que se muestra el mensaje de que no hay resultados
    cy.get("[data-cy='no-clans-found']").should("be.visible");
  });

  it("Should allow creating a new clan", () => {
    // Interceptar la petición para crear un clan
    cy.intercept("POST", "**/clans", {
      statusCode: 201,
      body: {
        id: "newclan123",
        name: "New Test Clan"
      }
    }).as("createClan");
    
    // Hacer clic en el botón para crear un clan
    cy.get("[data-cy='create-clan-btn']").click();
    
    // Rellenar el formulario
    cy.get("[data-cy='clan-name-input']").type("New Test Clan");
    cy.get("[data-cy='clan-tag-input']").type("NTC");
    
    // Enviar el formulario
    cy.get("[data-cy='submit-clan-btn']").click();
    
    // Esperar a que se complete la petición
    cy.wait("@createClan");
    
    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='clan-created-success']").should("be.visible");
  });
});
