describe("Profile", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptRequest();
    cy.interceptLoguedRequest();
    cy.visit("/");
    cy.waitForPageLoad();

    cy.get("[data-cy='profile-link']").click();
    cy.url().should("include", "/profile");
  });

  it("Should display user profile information", () => {
    cy.wait("@getUser");

    cy.get("[data-cy='profile-nickname']").should("contain", "Stiletto");
    cy.get("[data-cy='profile-discord']").should("contain", "TEST#12345");
  });

  it("Should allow editing profile information", () => {
    cy.wait("@getUser");

    cy.get("[data-cy='edit-profile-btn']").click();

    cy.get("[data-cy='profile-edit-form']").should("be.visible");

    const newNickname = "TestUser";
    cy.get("[data-cy='profile-nickname-input']").clear().type(newNickname);

    cy.get("[data-cy='save-profile-btn']").click();

    cy.get("[data-cy='profile-update-success']").should("be.visible");
  });

  it("Should show user's clan information if in a clan", () => {
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

    cy.reload();
    cy.waitForPageLoad();

    cy.wait("@getUserWithClan");

    cy.get("[data-cy='profile-clan']").should("contain", "Test Clan");
  });

  it("Should allow user to leave a clan", () => {
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

    cy.intercept("DELETE", "**/clans/members/*", {
      statusCode: 204
    }).as("leaveClan");

    cy.reload();
    cy.waitForPageLoad();

    cy.wait("@getUserWithClan");

    cy.get("[data-cy='leave-clan-btn']").click();

    cy.get("[data-cy='confirm-leave-clan-btn']").click();

    cy.wait("@leaveClan");

    cy.get("[data-cy='leave-clan-success']").should("be.visible");
  });

  it("Should show user's recipes", () => {
    cy.wait("@getUser");

    cy.get("[data-cy='recipes-tab']").click();

    cy.wait("@getRecipe");

    cy.get("[data-cy='user-recipes']").should("be.visible");
    cy.get("[data-cy='recipe-item']").should("contain", "Sand Bed");
  });
});
