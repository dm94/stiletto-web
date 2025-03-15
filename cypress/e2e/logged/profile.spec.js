describe("Profile", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptRequest();
    cy.interceptLoguedRequest();
    cy.visit("/");
    cy.waitForPageLoad();

    // Navegar a la página de perfil
    cy.get("[data-cy='profile-link']").click();
    cy.url().should("include", "/profile");
  });

  it("Should display user profile information", () => {
    // Esperar a que se carguen los datos del usuario
    cy.wait("@getUser");

    // Verificar que se muestra la información del perfil
    cy.get("[data-cy='profile-nickname']").should("contain", "Stiletto");
    cy.get("[data-cy='profile-discord']").should("contain", "TEST#12345");
  });

  it("Should allow editing profile information", () => {
    // Esperar a que se carguen los datos del usuario
    cy.wait("@getUser");

    // Hacer clic en el botón de editar perfil
    cy.get("[data-cy='edit-profile-btn']").click();

    // Verificar que aparece el formulario de edición
    cy.get("[data-cy='profile-edit-form']").should("be.visible");

    // Editar el nickname
    const newNickname = "TestUser";
    cy.get("[data-cy='profile-nickname-input']").clear().type(newNickname);

    // Guardar los cambios
    cy.get("[data-cy='save-profile-btn']").click();

    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='profile-update-success']").should("be.visible");
  });

  it("Should show user's clan information if in a clan", () => {
    // Modificar el fixture para simular que el usuario está en un clan
    cy.intercept("GET", "**/users*", {
      statusCode: 200,
      body: {
        nickname: "Stiletto",
        discordtag: "TEST#12345",
        discordid: "000000000000",
        clanid: "clan123",
        clanname: "Test Clan",
        leaderid: null,
        serverdiscord: null
      }
    }).as("getUserWithClan");

    // Recargar la página para que se apliquen los cambios
    cy.reload();
    cy.waitForPageLoad();

    // Esperar a que se carguen los datos del usuario
    cy.wait("@getUserWithClan");

    // Verificar que se muestra la información del clan
    cy.get("[data-cy='profile-clan']").should("contain", "Test Clan");
  });

  it("Should allow user to leave a clan", () => {
    // Modificar el fixture para simular que el usuario está en un clan
    cy.intercept("GET", "**/users*", {
      statusCode: 200,
      body: {
        nickname: "Stiletto",
        discordtag: "TEST#12345",
        discordid: "000000000000",
        clanid: "clan123",
        clanname: "Test Clan",
        leaderid: null,
        serverdiscord: null
      }
    }).as("getUserWithClan");

    // Interceptar la petición para dejar el clan
    cy.intercept("DELETE", "**/clans/members/*", {
      statusCode: 204
    }).as("leaveClan");

    // Recargar la página para que se apliquen los cambios
    cy.reload();
    cy.waitForPageLoad();

    // Esperar a que se carguen los datos del usuario
    cy.wait("@getUserWithClan");

    // Hacer clic en el botón para dejar el clan
    cy.get("[data-cy='leave-clan-btn']").click();

    // Confirmar la acción
    cy.get("[data-cy='confirm-leave-clan-btn']").click();

    // Esperar a que se complete la petición
    cy.wait("@leaveClan");

    // Verificar que se muestra un mensaje de éxito
    cy.get("[data-cy='leave-clan-success']").should("be.visible");
  });

  it("Should show user's recipes", () => {
    // Esperar a que se carguen los datos del usuario
    cy.wait("@getUser");

    // Navegar a la pestaña de recetas
    cy.get("[data-cy='recipes-tab']").click();

    // Esperar a que se carguen las recetas
    cy.wait("@getRecipe");

    // Verificar que se muestran las recetas
    cy.get("[data-cy='user-recipes']").should("be.visible");
    cy.get("[data-cy='recipe-item']").should("contain", "Sand Bed");
  });
});
