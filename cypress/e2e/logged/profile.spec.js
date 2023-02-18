describe("Profile", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", "00000000000000000000000000000000");
    cy.interceptRequest();
    cy.interceptLoguedRequest();
    cy.visit("/");
    cy.get("[data-cy='profile-link']").click();
  });
  it("Check profile", () => {
    cy.get("[data-cy='discord-tag']").contains("TEST#12345");
    cy.get("[data-cy='join-clan-btn']").click();
  });
});
