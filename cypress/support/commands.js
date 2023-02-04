Cypress.Commands.add("checkValueInClipboard", (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.contain(value);
    });
  });
});

//Cypress.Commands.add("interceptRequest", () => {});
