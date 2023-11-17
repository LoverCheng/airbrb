/* eslint-disable no-undef */
/**
 * Happy Path Test
 * Steps:
 * ================ Hosted ===================
 * 0. Visit home page through landing page
 * 1. Create a user through register page
 * 2. Create a listing through create listing page
 * 3. Edit the listing through edit listing page
 * 4. Set availability through availability page
 * 5. Publish the listing through publish button
 * 6. Unpublish the listing through unpublish button
 * ================== User ====================
 * 7. Visit listing page through home page
 * 8. Visit listing detail page through listing detail page
 * 9. Make a booking through booking page
 * 10. Logout through logout button
 */
describe('airbrb happy path', () => {
  // Before each test we need to restore local storage to preserve it.
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  // After each test we save local storage.
  afterEach(() => {
    cy.saveLocalStorage();
  });
  // Step0 START =====> visit homepage
  it('Step0: should navigate to home page successfully', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
    // there should be a h4 tag with text "Welcome!"
    cy.get('h4').should('have.text', 'Welcome! ');
    // Locate the input element by its aria-label
    cy.get('input[aria-label="search"]')
      .should('be.visible') // Assert that the element is visible
      .type('Test Search Query'); // Simulate typing into the input
  });
  // <==================== END ==========================>
  // Step1 START =====> create a user
  it('Step1: should navigate to register page successfully', () => {
    cy.get('[data-testid="AccountCircleIcon"]').should('be.visible').click();
    cy.contains('li', 'Sign up')
      .should('be.visible') // Assert that the element is visible
      .click(); // Interact with the element
    cy.get('h2').should('have.text', 'Register to Airbnb');
    cy.get('input[type="email"]').focus().type('jason@gmail.com');
    cy.get('input[id="password"]').focus().type('123456');
    cy.get('input[id="confirmed-password"]').focus().type('123456');
    cy.get('input[id="username"]').focus().type('jason');
    cy.contains('button', 'Register').should('be.visible').click();
    cy.url().should('include', 'localhost:3000/');
  });
  // <==================== END ==========================>
  // Step1 START =====> login
  // it('Step1: should navigate to login page successfully', () => {
  //   cy.get('[data-testid="AccountCircleIcon"]').should('be.visible').click();
  //   cy.contains('li', 'Log in')
  //     .should('be.visible') // Assert that the element is visible
  //     .click(); // Interact with the element
  //   cy.get('h2').should('have.text', 'Login to Airbnb');
  //   cy.get('input[id="email"]').focus().type('jason@gmail.com');
  //   cy.get('input[id="password"]').focus().type('123456');
  //   cy.contains('button', 'Login').should('be.visible').click();
  //   cy.wait(1000);
  //   cy.url().should('include', 'localhost:3000/');
  // });
  // <==================== END ==========================>
  // Step2 START =====> create a listing
  it('Step2: should navigate to create listing page successfully', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000/');
    cy.get('[data-testid="AccountCircleIcon"]').should('be.visible').click();
    cy.contains('li', 'Airbnb your place')
      .should('be.visible') // Assert that the element is visible
      .click(); // Interact with the element
    cy.url().should('include', 'localhost:3000/listings/new');
    // type title
    cy.get('input[name="title"]').focus().type('Your Best choice');
    // type Street Address
    cy.get('input[name="street"]').focus().type('123 test street');
    // type City
    cy.get('input[name="city"]').focus().type('test city');
    // type State
    cy.get('input[name="state"]').focus().type('test state');
    // type postcode
    cy.get('input[name="postcode"]').focus().type('12345');
    // country
    cy.get('input[name="country"]').focus().type('test country');
    // type price
    cy.get('input[name="price"]').focus().type('100');
    // type number of bathrooms
    cy.get('input[name="bathrooms"]').focus().type('1');
    // type amenities
    cy.get('input[name="amenities"]').focus().type('test amenities');
    // upload the thumbnail
    cy.contains('span', 'Upload').should('be.visible');
    const thumbnailPath = 'thumbnail-testing.jpeg';
    cy.get('input[id="add-thumbnail-file"]').attachFile(thumbnailPath);
    // upload the images
    const image1Path = 'image1-testing.jpeg';
    cy.get('input[id="add-images-file"]').attachFile(image1Path);
    const image2Path = 'image2-testing.jpeg';
    cy.get('input[id="add-images-file"]').attachFile(image2Path);
    // choose property type
    cy.get('div[id="propertyType"]').click();
    cy.get('li[data-value="house"]').click();
    // add bedroom number
    cy.contains('button', 'Add Bedroom number')
      //   .should('be.visible')
      //   .and('not.be.disabled')
      .click();
    cy.contains('Number of Beds')
      .siblings()
      .find('input')
      .click()
      .clear()
      .type('1');
    cy.contains('Bed Type').siblings().find('input').clear().type('wood');
    cy.contains('button', 'Submit Listing').click();
    cy.url().should('include', 'localhost:3000/listings/hosted');
    cy.contains('p', 'Your Best choice').should('be.visible');
  });
  // <==================== END ==========================>
  // Step3 START =====> edit a listing
  it('Step3: Updates the thumbnail and title of the listing successfully', () => {
    cy.wait(2000);
    cy.get('img[alt="Your Best choice"]').click();
    cy.get('input[name="title"]').focus().clear().type('Title updated');
    const thumbnailPath = 'thumbnail-update.jpeg';
    cy.get('input[id="add-thumbnail-file"]').attachFile(thumbnailPath);
    cy.contains('button', 'Update Listing').click();
  });
  // <==================== END ==========================>
  // Step4 START =====> set availability
  it('Step4: Publish a listing successfully', () => {
    cy.wait(2000);
    cy.get('path[d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"]').click({
      force: true,
    });
    cy.contains('span', 'End Date')
      .parent()
      .parent()
      .prev()
      .find('button')
      .click();
    cy.get('button[data-timestamp="1700658000000"]').click();
    cy.get('h4').click();
    cy.contains('span', 'Start Date')
      .parent()
      .parent()
      .prev()
      .find('button')
      .click();
    // cy.get('button[data-timestamp="1700485200000"]').click({ multiple: true });
  });
});
