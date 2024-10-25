describe('Interactive Storytelling Platform', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Create', { timeout: 10000 }).click();
    cy.url().should('include', '/create');
    // Clear any existing stories
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  });

  afterEach(() => {
    // Clean up created stories
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  const uniqueId = Date.now().toString();

  const createStory = (storyTitle) => {
    cy.intercept('POST', '**/story').as('createStoryAPI');
    cy.contains('Create New Story').should('be.visible').click();
    cy.get('div[role="dialog"]').within(() => {
      cy.get('input[type="text"]').type(storyTitle);
      cy.contains('Create').click();
    });
    cy.wait('@createStoryAPI').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });
    // Wait for the dialog to close
    cy.get('div[role="dialog"]').should('not.exist');
  };

  it('should create a new story', () => {
    const storyTitle = `My New Story ${uniqueId}`;
    createStory(storyTitle);
    // Force a reload to ensure the new story is reflected in the select menu
    cy.reload();
    cy.get('.MuiSelect-root', { timeout: 10000 }).click();
    cy.contains(storyTitle, { timeout: 10000 }).should('exist');
  });

  it('should create a new story segment with title and choices', () => {
    const storyTitle = `Story for Segment ${uniqueId}`;
    const segmentTitle = `New Segment Title ${uniqueId}`;
    
    createStory(storyTitle);

    cy.get('.MuiSelect-root').click();
    cy.contains(storyTitle).click();
    
    cy.intercept('POST', '**/segment').as('createSegmentAPI');
    
    // Wait for the form to be visible and check if the input fields exist
    cy.get('form', { timeout: 10000 }).should('be.visible').within(() => {
      cy.get('input[label="Segment Title"]').should('exist').type(segmentTitle);
      cy.get('textarea[label="Segment Content"]').should('exist').type('This is a new story segment');
      cy.get('input[label="Choice 1 Text"]').should('exist').type('Go forward');
      cy.get('input[label="Next Segment ID (optional)"]').should('exist').type('1');
    });
    cy.contains('Add Choice').click();
    cy.get('form').within(() => {
      cy.get('input[label="Choice 2 Text"]').should('exist').type('Go back');
    });
    cy.contains('Add Segment').click();
    
    cy.wait('@createSegmentAPI').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });
    
    cy.contains(segmentTitle).should('exist');
    cy.contains('This is a new story segment').should('exist');
  });

  it('should create a segment with choices without next segments', () => {
    const storyTitle = `Story for Open Choices ${uniqueId}`;
    const segmentTitle = `Segment with Open Choices ${uniqueId}`;
    
    createStory(storyTitle);

    cy.get('.MuiSelect-root').click();
    cy.contains(storyTitle).click();
    
    cy.intercept('POST', '**/segment').as('createSegmentAPI');
    
    cy.get('form', { timeout: 10000 }).should('be.visible').within(() => {
      cy.get('input[label="Segment Title"]').should('exist').type(segmentTitle);
      cy.get('textarea[label="Segment Content"]').should('exist').type('This segment has choices without next segments');
      cy.get('input[label="Choice 1 Text"]').should('exist').type('Open Choice 1');
    });
    cy.contains('Add Choice').click();
    cy.get('form').within(() => {
      cy.get('input[label="Choice 2 Text"]').should('exist').type('Open Choice 2');
    });
    cy.contains('Add Segment').click();
    
    cy.wait('@createSegmentAPI').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });
    
    cy.contains(segmentTitle).should('exist');
    cy.contains('This segment has choices without next segments').should('exist');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('POST', '**/story', { statusCode: 500, body: { message: 'Server error' } }).as('createStoryAPI');
    cy.contains('Create New Story').should('be.visible').click();
    cy.get('div[role="dialog"]').within(() => {
      cy.get('input[type="text"]').type(`Error Story ${uniqueId}`);
      cy.contains('Create').click();
    });
    cy.wait('@createStoryAPI').then((interception) => {
      expect(interception.response.statusCode).to.equal(500);
    });
    cy.contains('Failed to create new story. Please try again.', { timeout: 10000 }).should('be.visible');
  });
});
