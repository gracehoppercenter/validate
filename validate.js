let footerWasCreatedByScript = false;
function init() {

    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }
    let div = footer.querySelector('#htmlcss');
    if (!div) {
        div = document.createElement('div');
        div.id = "htmlcss";
        footer.appendChild(div);
        footerWasCreatedByScript = true;
    }
    div.innerHTML += `<p><button onclick="validateHTML()">Validate HTML/CSS</button></p>`;

    // Check if the document has a valid doctype
    let hasValidDoctype = checkDoctype();

    if (!hasValidDoctype) {
        console.warn("Warning: This document does not have a <!DOCTYPE html> declaration.");
        addWarningFooter();
    }
}

function validateHTML() {
    const isLocalFile = checkLocalFile();
    if (isLocalFile) {
        // Local file case: Include the DOCTYPE manually if necessary
        // I originally had document.documentElement.outerHTML here.
        // That was returning the current DOM state, which has already been
        // cleaned up by the browser. This version passes the raw local file.
        fetch(window.location.href)
            .then(response => response.text())
            .then(rawContent => {
                return fetch("https://validator.w3.org/nu/?out=json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/html; charset=utf-8"
                    },
                    body: rawContent
                });
            })
            .then(response => response.json())
            .then(data => {
                renderValidationResults(data);
            })
            .catch(error => {
                console.warn(error);
                renderErrorFooter();
            });

    } else {
        // Hosted file case: Use URL-based validation
        const loc = window.location.href;
        fetch("https://validator.w3.org/nu/?out=json&doc=" + encodeURIComponent(loc), {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                renderValidationResults(data);
            })
            .catch(error => {
                console.warn(error);
                renderErrorFooter();
            });
    }
}

function checkLocalFile() {
    const loc = window.location.href;
    return loc.startsWith("file://") || loc.startsWith("http://localhost") || loc.startsWith("http://127.0.0.1");
}

// Function to check if the document has a valid <!DOCTYPE html>
function checkDoctype() {
    if (document.doctype) {
        // Check if the name of the doctype is "html" (case-insensitive)
        return document.doctype.name.toLowerCase() === "html";
    }
    return false;
}

// Helper function to add a warning to the footer if <!DOCTYPE html> is missing
function addWarningFooter() {
    renderFooter(`<p><strong>Warning: The document is missing a <!DOCTYPE html> declaration. Validation results may not be accurate.</strong></p>`);
}

// Helper function to render validation results
function renderValidationResults(data) {
    
    // Filter out messages where type == 'info'
    data.messages = data.messages.filter(msg => msg.type !== 'info');

    // console.log(data);
    let isHTMLValid = data.messages.length === 0;

    let ValidatorHTML = `<p><strong>HTML/CSS`;
    if (!isHTMLValid) {
        ValidatorHTML += " NOT";
    }
    ValidatorHTML += ` Valid!</strong></p>`;
    ValidatorHTML += `
        <p>
            <a id="vLink1" href="https://validator.w3.org/check?uri=${window.location.href}">Validate HTML</a> |
            <a id="vLink2" href="https://jigsaw.w3.org/css-validator/validator?uri=${window.location.href}?profile=css3">Validate CSS</a>
        </p>
    `;
    if (!isHTMLValid) {
        if (data['messages'][0]['type'] != 'error') {
            if (checkLocalFile()) {
                ValidatorHTML += `<p>Validation could not be performed due to an error: ` + data['messages'][0]['message'] + `</p>`;
            } else {
                console.warn(data['messages'][0]['message']);
                renderErrorFooter();
            }
        } else if (checkLocalFile()) {
            try {
                ValidatorHTML += `<p>There might be multiple errors. Here is the first one:</p>
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Error Description</strong></td>
                        </tr>
                        <tr>
                            <td>` + data['messages'][0]['message'] + `</td>
                        </tr>
                        <tr>
                            <td><strong>Code</strong></td>
                        </tr>
                        <tr>
                        <td><code>${data['messages'][0]['extract'].replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')}</code></td>
                        </tr>
                    </tbody>
                </table>`;
            } catch (error) {
                ValidatorHTML += `<p>Validation could not be performed due to an error: ` + error.message + `</p>`;
            }
        }
    }

    renderFooter(ValidatorHTML);
}

function renderFooter(innerHTML) {
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }
    let div = footer.querySelector('#htmlcss');
    if (!div) {
        div = document.createElement('div');
        div.id = "htmlcss";
        footer.appendChild(div);
    }
    if (footerWasCreatedByScript) {
        div.innerHTML = "";
        footerWasCreatedByScript = false;
    }
    div.innerHTML += innerHTML;
}

// Helper function to render an error message in the footer
function renderErrorFooter() {
    renderFooter(`<p><strong>HTML/CSS validation could not be performed due to an error.</strong></p>`);
}

// Call the init function when the DOM is fully loaded.
// If that has already happened before this script ran, 
// go ahead and fire init() now.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}