A simple javascript file that can be added to any webpage. Developed for 
students in a web design class who often hand-write HTML and need help
catching typos.

Adds a button to the page's footer. When you click the button,
makes an API call which sends the page's HTML to <https://validator.w3.org/> 
and writes
the results to the page footer.

To use, download `template_for_students.js` and include it in your webroot 
(we usually rename it to `validate.js`), then include it in a `<script>`
tag from any HTML file.

`template_for_students.js` is just `validate.js`, except it pulls the latest
version from this github repo via [jsDelivr](https://www.jsdelivr.com/?docs=gh).
That way we can set this up for our students once and they won't need to 
re-download the file every time we make a change.

To see it in action, check out our testing pages hosted via github pages here:
 <https://gracehoppercenter.github.io/validate/testing/valid.html>