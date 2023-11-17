/* eslint-disable no-undef */
import React from 'react'
import HintModal from './hintModal'

describe('HintModal Component', () => {
  const mockHintMessage = 'This is a hint message';

  beforeEach(() => {
    // Mount the component with open true
    const handleCloseMock = cy.stub().as('handleCloseMock');
    cy.mount(<HintModal open={true} handleClose={handleCloseMock} hintMessage={mockHintMessage} />);
  });

  it('displays the modal when open is true', () => {
    cy.get('.MuiBox-root').should('be.visible');
  });

  it('displays the correct hint message', () => {
    cy.contains(mockHintMessage).should('be.visible');
  });

  it('calls handleClose when close button is clicked', () => {
    cy.get('.MuiButtonBase-root').click();
    cy.get('@handleCloseMock').should('have.been.calledOnce');
  });
});
