describe("Trades", () => {
  beforeEach(() => {
    cy.interceptRequest();
    cy.visit("/");
    cy.waitForPageLoad();
    cy.get("[data-cy='trades-link']").click();
    cy.url().should("include", "/trades");
  });

  it("Should load the trades page", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Verificar que el título de la página es correcto
    cy.contains("Trades").should("be.visible");
    
    // Verificar que se muestran trades en la página
    cy.get("[data-cy='trade-list']").should("be.visible");
  });

  it("Should display trade information correctly", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Verificar que se muestra la información del primer trade
    cy.get("[data-cy='trade-item']").first().within(() => {
      cy.get("[data-cy='trade-card']").should("be.visible");
      cy.get("[data-cy='trade-resource']").should("be.visible");
      cy.get("[data-cy='trade-price']").should("be.visible");
    });
  });

  it("Should allow searching for trades", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Buscar un trade por recurso
    cy.get("[data-cy='resource-type-filter']").select("Wood");
    
    // Verificar que se filtran los resultados
    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow filtering trades by type", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Filtrar por tipo
    cy.get("[data-cy='trade-type-filter']").select("Supply");
    
    // Verificar que se filtran los resultados
    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow filtering trades by region", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Filtrar por región
    cy.get("[data-cy='region-filter']").select("EU");
    
    // Verificar que se filtran los resultados
    cy.get("[data-cy='trade-item']").should("have.length.at.least", 1);
  });

  it("Should allow pagination of trades", () => {
    // Esperar a que se carguen los trades
    cy.wait("@getTrades");
    
    // Verificar que la paginación está presente
    cy.get("[data-cy='pagination']").should("be.visible");
    
    // Hacer clic en la siguiente página si hay más de una página
    cy.get("[data-cy='pagination']").then(($pagination) => {
      if ($pagination.find("button").length > 1) {
        cy.get("[data-cy='pagination'] button").eq(1).click();
        cy.wait("@getTrades");
      }
    });
  });

  it("Should show form to create a trade when logged in", () => {
    // Simular usuario logueado
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptLoguedRequest();
    
    // Recargar la página
    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTrades");
    
    // Verificar que el formulario de creación está visible
    cy.contains("Publish a trade").should("be.visible");
    cy.get("[data-cy='trade-type']").should("be.visible");
    cy.get("[data-cy='resource-type']").should("be.visible");
  });

  it("Should create a new trade when form is submitted", () => {
    // Simular usuario logueado
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptLoguedRequest();
    
    // Interceptar la petición para crear un trade
    cy.intercept("POST", "**/trades", {
      statusCode: 201,
      body: {
        id: "newtrade123",
        resource: "Wood",
        type: "Supply",
        amount: "5",
        region: "EU",
        quality: "0",
        price: "100"
      }
    }).as("createTrade");
    
    // Recargar la página
    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTrades");
    
    // Rellenar el formulario
    cy.get("[data-cy='trade-type']").select("Supply");
    cy.get("[data-cy='resource-type']").select("Wood");
    cy.get("[data-cy='region-input']").select("EU");
    cy.get("[data-cy='amount-input']").clear().type("5"); // Amount
    cy.get("[data-cy='quality-input']").clear().type("0"); // Quality
    cy.get("[data-cy='price-input']").clear().type("100"); // Price
    
    // Enviar el formulario
    cy.get("[data-cy='create-trade-form']").submit();
    
    // Esperar a que se complete la petición
    cy.wait("@createTrade");
    
    // Verificar que se actualiza la lista de trades
    cy.wait("@getTrades");
  });

  it("Should allow deleting a trade when user is the owner", () => {
    // Simular usuario logueado como propietario del trade
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    
    // Interceptar la petición para obtener trades con un trade del usuario actual
    cy.intercept("GET", "**/trades*", {
      statusCode: 200,
      body: [{
        idtrade: "123",
        resource: "Wood",
        type: "Supply",
        amount: "5",
        region: "EU",
        quality: "0",
        price: "100",
        discordid: "00000000000000000000000000000000",
        discordtag: "user#1234"
      }]
    }).as("getTradesWithOwner");
    
    // Interceptar la petición para eliminar un trade
    cy.intercept("DELETE", "**/trades/123", {
      statusCode: 204
    }).as("deleteTrade");
    
    // Recargar la página
    cy.reload();
    cy.waitForPageLoad();
    cy.wait("@getTradesWithOwner");
    
    // Verificar que el botón de eliminar está visible
    cy.get("[data-cy='delete-trade-btn']").should("be.visible");
    
    // Hacer clic en el botón de eliminar
    cy.get("[data-cy='delete-trade-btn']").click();
    
    // Esperar a que se complete la petición
    cy.wait("@deleteTrade");
    
    // Verificar que se actualiza la lista de trades
    cy.wait("@getTradesWithOwner");
  });
});
