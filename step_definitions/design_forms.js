/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I add an instrument below the instrument named {string}
 * @param {string} instrument - the name of the instrument you are adding an instrument below
 * @description Interactions - Clicks the Add Instrument Here button below a specific Instrument name
 */
 Given("I add an instrument below the instrument named {string}", (instrument) => {

    cy.get('table[id=table-forms_surveys]')
        .find('tr').contains(instrument)
            .parents('tr')
                .next().find('button').contains("Add instrument here").click()

})

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I add an instrument below the instrument named {string}
 * @param {string} action - the action label of the link that should be clicked
 * @param {string} instrument - the name of the instrument that a form should be added below
 * @description Interactions - Clicks the "choose action" button and clicks an anchor link
 */
 Given("I click on the Instrument Action {string} for the instrument named {string}", (action, instrument) => {

    cy.get('table[id=table-forms_surveys]')
        .find('tr').contains(instrument)
            .parents('tr').find('button').contains('Choose action').click()
    cy.get('ul[id=formActionDropdown]').find('a').contains(action).click({force: true})

})

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I drag the instrument named {string} to the position {int}
 * @param {string} instrument - the naame of the instrument being drag-n-dropped
 * @param {int} position - the position (index starting from 1) where the instrument should be placed
 * @description Interactions - Drag and drop the instrument to the int position
 */
 Given("I drag the instrument named {string} to the{ordinal} row", (instrument, position) => {
    cy.get('table[id=table-forms_surveys]').find('tr').contains(instrument).parents('tr').then((row) => {
        cy.get('table[id=table-forms_surveys]').find('tr').eq(window.ordinalChoices[position]).find('td[class=dragHandle]').as('target')
        cy.wrap(row).find('td[class=dragHandle]').dragTo('@target')
    })
})

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I drag the instrument named {string} to the position {int}
 * @param {string} instrument - the naame of the instrument being drag-n-dropped
 * @param {int} position - the position (index starting from 1) where the instrument should be placed
 * @description Interactions - Drag and drop the instrument to the int position
 */
Given("I (should) see the instrument named {string} in the{ordinal} row", (instrument, position) => {
    cy.get('table[id=table-forms_surveys]').find('tr').each((row, index) => {
        if(index === window.ordinalChoices[position]){
            cy.wrap(row).find('td').then(($td) => {
                expect($td).to.contain(instrument)
            })
        }
    })
})



///////////
// Forms //
///////////

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I click on the {addField} input button below the field named {string}
 * @param {addField} type - the type of addField action you want to perform
 * @param {string} target - the name of the field you want to add a field below
 * @description Clicks on one of the add field options below a specified field name
 */
Given("I click on the {addField} input button below the field named {string}", (type, target) => {
    cy.get('tbody[class=formtbody]').children('tr:contains(' + target +')').contains(target)
        .parents('tr').next().within(() => {
            cy.get('input[value="' + type + '"]').click()
        })
})

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I click on the {editField} image for the field named {string}
 * @param {string} type - the type of edit action you want to perform on a field
 * @param {string} field - the name of the field you want to edit
 * @description Clicks on the image link of the action you want to perform on a field
 */

 Given("I click on the {editField} image for the field named {string}", (type, field_name) => {
    cy.click_on_design_field_function(type, field_name)
})

/**
 * @module DesignForms
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I delete the field named {string}
 * @param {string} type - the type of edit action you want to perform on a field
 * @description Interactions - Clicks on the image link of the action you want to perform on a field
 */
Given("I delete the field named {string}", (field_name) => {
    cy.click_on_design_field_function("Delete Field", field_name)

    cy.intercept({
        method: 'GET',
        url: '/redcap_v' + Cypress.env('redcap_version') + "/Design/delete_field.php?*"
    }).as('delete_field')

    cy.intercept({
        method: 'GET',
        url: '/redcap_v' + Cypress.env('redcap_version') + "/Design/online_designer_render_fields.php?*"
    }).as('render_fields')

    cy.get('button').contains('Delete').click()

    cy.wait('@delete_field')
    cy.wait('@render_fields')
})

/**
 * @module DesignForms
 * @author Adam De Fouw <aldefouw@medicine.wisc.edu>
 * @example I move the field named {string} after the field named {string}
 * @param {string} field_name - name of field you want to move
 * @param {string} after_field - name of field you want to move AFTER
 * @description Moves a field AFTER the field specified
 */
Given("I move the field named {string} after the field named {string}", (field_name, after_field) => {
    cy.click_on_design_field_function("Move", field_name)

    //Get the variable name of the field to move "after"
    cy.get('label:contains(' + after_field + '):visible').then(($label) => {
        const after_field_var_name = $label[0]['id'].split('label-')[1]
        cy.get('#move_after_field').select(after_field_var_name).should('have.value', after_field_var_name)
    })

    cy.intercept({
        method: 'POST',
        url: '/redcap_v' + Cypress.env('redcap_version') + "/Design/move_field.php?*"
    }).as('move_field')

    cy.get('button').contains('Move field').click()

    cy.wait('@move_field')

    cy.click_on_dialog_button("Close")
})

/**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I drag on the field named {string} to the position {int}
 * @param {string} field - the name of the field being drag-n-dropped
 * @param {int} position - the position (index starting from 0) where the instrument should be placed
 * @description Interactions - Drag and drop the field to the int position
 */
 Given("I drag the field named {string} to the{ordinal} row", (field, position) => {
    cy.get('table[id*=design-]').contains(field).parents('table[id*=design-]').then((row) => {
        cy.get('table[id*=design-]').eq(window.ordinalChoices[position]).as('target')
        cy.wrap(row).dragTo('@target')
    })
 })

 /**
 * @module DesignForms
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I should see a the field named {string} before field named {string}
 * @param {string} fieldBefore the field name that comes before
 * @param {string} fieldAfter the field name that comes after
 * @description Visually verifies that the fieldBefore is before fieldAfter
 */
  Given("I should see a the field named {string} before field named {string}", (fieldBefore, fieldAfter) => {
    cy.get('tr[id*=-tr]').contains(fieldBefore).parents('tr[id*=-tr]')
        .nextAll().contains(fieldAfter)
})