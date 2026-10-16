# Local Files
On chromium based browsers (chrome, edge, brave, etc.) you can't use fetch() in JavaScript files, which is required for getting the validation information. There are a few options:
* If you use a JetBrains IDE (ex. WebStorm), you can use the built-in live server. Note that this viewer may add some invalid HTML to the end - if you see that validation is failed because there's an extra script tag after \</html>, you can ignore that.
* If you use VSCode, you can use the live server extension for VSCode.
* If you use another IDE, you can see if it has live server functionality or if it has an extension for it.
* Otherwise, if you have python installed, you can run ```python -m http.server 8000``` in your project folder to start a live server at http://127.0.0.1:8000.