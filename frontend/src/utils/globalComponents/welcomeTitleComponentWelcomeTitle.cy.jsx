/* eslint-disable no-undef */
import React from 'react'
import WelcomeTitle from './welcomeTitleComponent'

describe('<WelcomeTitle />', () => {
  beforeEach(() => {
    // Mock the localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('user', 'TestUser');
    });

    // Define the extraInfo prop
    const extraInfo = 'Here is some additional information.';

    // Mount the component (Assuming you are using a plugin like cypress-react-unit-test)
    cy.mount(<WelcomeTitle extraInfo={extraInfo} />);
  });

  it('should display the welcome message with the user name', () => {
    cy.contains('h4', 'Welcome! TestUser').should('be.visible');
  });

  it('should display the additional information', () => {
    cy.contains('Here is some additional information.').should('be.visible');
  });
})
