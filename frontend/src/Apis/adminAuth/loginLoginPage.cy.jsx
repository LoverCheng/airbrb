/* eslint-disable no-undef */
import React from 'react'
import LoginPage from './login'

describe('LoginPage Component', () => {
  beforeEach(() => {
    const mockOnClose = cy.stub().as('mockOnClose');
    cy.mount(<LoginPage onClose={mockOnClose} />);
  });

  it('allows user to enter email and password', () => {
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
  });

  it('handles successful login', () => {
    // Mocking HTTP request for successful login
    cy.intercept('POST', 'user/auth/login', { token: 'mockToken' }).as('loginRequest');

    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button').contains('Login').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.window().its('localStorage').invoke('getItem', 'token').should('eq', 'mockToken');
    cy.get('@mockOnClose').should('have.been.called');
  });

  it('displays error message on login failure', () => {
    // Mocking HTTP request for failed login
    cy.intercept('POST', 'user/auth/login', { statusCode: 401, body: { error: 'Invalid credentials' } });

    cy.get('#email').type('test@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button').contains('Login').click();

    cy.contains('Invalid credentials').should('be.visible');
  });

  it('shows error if fields are empty and login is attempted', () => {
    cy.get('button').contains('Login').click();
    cy.contains('Please fill in all fields.').should('be.visible');
  });
});
