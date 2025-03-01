/**
 * @module CSV
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I (should) have a CSV file located at path {string} that contains {int} row(s)
 * @param {string} path - the text path of the CSV location
 * @param {DataTable} headings - the DataTable of headings this file should have
 * @description Verifies number of rows (excluding header) the CSV file should have.
 */
 Given("I (should )have a CSV file at path {string} that contains {int} row(s)", (path, headings) => {
     cy.download_file(path).then( ($text) => {
        let lines = $text.trim().split('\n')
        let header_line = headings.rawTable[0][0]
        for(let i = 1; i < headings.rawTable[0].length; i++){
            header_line += "," + headings.rawTable[0][i]
        }

        expect(lines[0]).to.equal(header_line)
    })
})

/**
 * @module CSV
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example the CSV file at path {string} has the headings below {DataTable}
 * @param {string} path - the text path of the CSV location
 * @param {DataTable} headings the DataTable of headings this file should have
 * @description Verifies headings of the CSV file.
 */
 Given("the CSV file at path {string} has the headings below", (path, headings) => {
     cy.download_file(path).then( ($text) => {
        let lines = $text.trim().split('\n')
        let header_line = headings.rawTable[0][0]
        for(let i = 1; i < headings.rawTable[0].length; i++){
            header_line += "," + headings.rawTable[0][i]
        }

        expect(lines[0]).to.equal(header_line)
    })
})

/**
 * @module CSV
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example the CSV file at path {string} has a value {string} for column {string}
 * @param {string} path - the text path of the CSV location
 * @param {string} value - the value of the column data we are verifying
 * @param {string} column - the text name of the column data we are verifying
 * @description Verifies a row value exists for a given column within a CSV file.
 */
 Given("the CSV file at path {string} has a value {string} for column {string}", (path, value, column) => {
     cy.download_file(path).then( ($text) => {
        let lines = $text.trim().split('\n')
        let columns = lines[0].split(',')
        let index = columns.indexOf(column)

        expect(index).to.be.greaterThan(-1)

        let found = false
        for(let i = 1; i < lines.length; i++){
            let columns = lines[i].split(',')
            if(columns[index] === value) {
                console.log(value)
                found = true
                break
            }
        }

        expect(found).to.equal(true)
    })
})

/**
 * @module CSV
 * @author Tintin Nguyen <tin-tin.nguyen@nih.gov>
 * @example I remove line {int} from a CSV file at path {string}
 * @param {string} path - the text path of the CSV location
 * @param {string} value - the value of the column data we are verifying
 * @param {string} column - the text name of the column data we are verifying
 * @description Removes a line from the CSV file at the path specified.
 */
 Given("I remove line {int} from a CSV file at path {string}", (line, path) => {
     cy.download_file(path).then( ($text) => {
        let lines = $text.trim().split('\n')

        let newLines = []
        for(let i = 0; i < lines.length; i++){
            if(i !== line-1){
                newLines.push(lines[i])
            }
        }
        cy.writeFile(path, newLines.join(',\n') + '\n')
    })
})