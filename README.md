A simple javascript file that can be added to any webpage.

On pageload, sends the page's HTML to <https://validator.w3.org/> and writes
the results to the page footer.

Our students often hand-write HTML, so I'll have them create a file called
`validate.js` that they can include in their own repo and call from every HTML
file. That code pulls the JS from here (via
[jsDelivr](https://www.jsdelivr.com/?docs=gh) ) and injects it into their HTML
page in a `<script>` tag. That code is in `template_for_students.js`