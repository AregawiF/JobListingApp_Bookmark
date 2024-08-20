describe('Bookmark functionality', () => {
  before(() => {
    // Visit the sign-in page before running the test
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Ignore errors caused by NEXT_REDIRECT
      if (err.message.includes('NEXT_REDIRECT')) {
        return false; 
      }
    });
    cy.visit('/');
  });

  it('should log in, navigate to the job list, and toggle a bookmark', () => {
    // Log in to the application
    cy.get('input#email').type('aregawifikre@gmail.com');
    cy.get('input#password').type('qwerty');
    cy.get('button[type="submit"]').click();

    // Wait for the login to complete and verify redirection
    cy.url({ timeout: 10000 }).should('include', '/jobs');

    cy.get('[data-testid="card-65509e9353a7667de6ef5a60"]', { timeout: 10000 }) 
      .should('be.visible')
      .within(() => {
        // Bookmark the job
        cy.get('[data-testid="bookmark-icon"]', { timeout: 10000 }).first().then(($bookmarkIcon) => {
        const initialFillColor = $bookmarkIcon.attr('fill');
        
        // Click on the bookmark icon
        cy.wrap($bookmarkIcon).click();
        
        // Wait for the bookmark action to complete
        cy.wait(1000); 
        
        // Verify the bookmark icon color has changed
        cy.get('[data-testid="bookmark-icon"]').first().should(($newIcon) => {
            const newFillColor = $newIcon.attr('fill');
            // @ts-ignore
            expect(newFillColor).to.not.equal(initialFillColor);
        });
        });
      });
    

    // Verify the bookmark state persists after a page reload
    cy.reload();

    cy.get('[data-testid="card-65509e9353a7667de6ef5a60"]', { timeout: 10000 }) 
      .should('be.visible')
      .within(() => {
        cy.get('[data-testid="bookmark-icon"]', { timeout: 10000 }).first().should(($icon) => {
        const finalFillColor = $icon.attr('fill');
        // @ts-ignore
        expect(finalFillColor).to.equal('#515B6F'); 
        });
      });

    cy.visit('/bookmarks');
    cy.url().should('include', '/bookmarks');
    cy.get('[data-testid="card-65509e9353a7667de6ef5a60"]', { timeout: 10000 }) 
        .should('be.visible')
        .within(() => {
        cy.get('[data-testid="bookmark-icon"]', { timeout: 10000 }).first().then(($bookmarkIcon) => {
        const initialFillColor = $bookmarkIcon.attr('fill');
        // @ts-ignore
        expect(initialFillColor).to.equal('#515B6F');
        });
    });

  });
});
