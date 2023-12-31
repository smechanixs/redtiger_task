/// <reference types="Cypress" />

const { should } = require("chai");



const homePageUrl = 'https://www.redtiger.com/'

describe('Spin test to match 3 equal elements', () => {
  it('Navigates to the redtiger.com page, passes the age verification, spins the elements until all of the 3 are the same and clicks on the element in the navigation bar which has the span value of the one of the spinner', () => {

    // changes the resolution to a bigger than the default one to not have overlap of elements
    cy.viewport('macbook-16');
    cy.visit(homePageUrl);
    // enters valid data for verfication and submits it
    cy.get('.age-verification-popup.show [data-name="Day 3"]').type('01');
    cy.get('.age-verification-popup.show [data-name="Month 3"]').type('01');
    cy.get('.age-verification-popup.show [data-name="Year 3"]').type('1881');
    cy.get('.age-verification-popup.show [href="#"]').click();


    const checkLinks = ($rows) => {
      const tempLinks = [];
      const numLinks = $rows.length;
      // gets the first link row in the each of the three columns
      for (let i = 0; i < numLinks; i++) {
        const $row = $rows.eq(i);
        const $link = $row.find('a').first();
        // gets the value of the link
        const linkRef = $link.attr('href');
        // checks if the temp array of links is empty or the current link is equal to the first one and adds the link to the array
        if (tempLinks.length === 0 || linkRef === tempLinks[0]) {
          tempLinks.push(linkRef);
        } else {
          return false;
        }
        // check if the current link is the same as the second one and logs the links array
        if (i === numLinks - 1) {
          cy.log(tempLinks);
          cy.log('Test passes');
          return true;
        }
      }

    };
    // spins the elements if all of the three links does not match
    const spinElements = () => {
      cy.get('.spin-btn-bg').click().then(() => {
        cy.log('Spinning...');
        cy.get('.mask').then(($rows) => {
          const isMatched = checkLinks($rows);
          if (!isMatched) {
            spinElements();
          }

          // asserts if the isMatched bool is true in order to finish the test
          else {
            cy.wrap(isMatched).should('be.true');

            // get the nav element which has the same name as the one the slot has stopped on after match and clicks on it
            let slotTextValues = []
            cy.get('.mask').first().find('a').first().each(($div) => {
              cy.wrap($div).find('span').each(($slotText) => {
                cy.wrap($slotText).invoke('text').then(($slotTextVal) => {
                  slotTextValues.push($slotTextVal)
                })
              })
            })

            cy.get('[id="main-nav"]').each(($nav) => {
              if (slotTextValues[0] === 'casino') {
                slotTextValues[0] = 'games'
                slotTextValues.pop()
                cy.log(slotTextValues)
              }
              if (slotTextValues[0] === 'engagement') {
                slotTextValues.pop()
                cy.log(slotTextValues)
              }
              cy.wrap($nav).find('span').contains(slotTextValues.join(' '), { matchCase: false }).click()
              return false;
            })
          }
        });
      });
    };

    return cy.get('.mask').then(($rows) => {
      const isMatched = checkLinks($rows);


      if (!isMatched) {
        spinElements();
      }
    });
  });
});
