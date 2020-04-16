let inBlock = false;
function convertMarkdown(txt) {
  const lines = txt.split("\n");
  // return an array of HTML elements
  let result = [];
  let codeBlock = "";
  for (let line of lines) {
    let lineData = getLineData(line);
    if (lineData.prefix === "#") {
      result.push(`<h1>${lineData.content}</h1>`);
    } else if (lineData.prefix === "##") {
      result.push(`<h2>${lineData.content}</h2>`);
    } else if (lineData.prefix === "```") {
      // check to see if we're already in a codeblock. If so, switch inBlock to false
      // then add a div containing codeblock to result
      // then set codeblock to empty string
      if (inBlock) {
        inBlock = false;
        codeBlock.content = codeBlock.content.replace(/</g, "&lt;");
        codeBlock.content = codeBlock.content.replace(/>/g, "&gt;");
        console.log("codeblock.content: ", codeBlock.content);
        result.push(
          `<div class="codeblock">\n<pre>\n<code class=${codeBlock.format} style="darcula">${codeBlock.content}\n</code>\n</pre>\n</div>\n`
        );
      } else {
        // new codeblock. Set inBlock to true
        inBlock = true;
        codeBlock = {
          format: `${lineData.content}`,
          content: "",
        };
      }
    } else {
      if (inBlock) {
        // Incoming content without a prefix is part of a block. Add to codeblock
        codeBlock.content += `${lineData.content}\n`;
      } else {
        // not in codeblock so regular paragraph text
        result.push(`<p>${lineData.content}</p>\n`);
      }
    }
  }
  return result;
}

function getLineData(line) {
  // takes a line of text and gets all prefix characters until is reaches a letter or number
  // returns prefix as a string
  let thePrefixIsIn = false;
  let result = {
    prefix: "",
    content: "",
  };
  for (let i = 0; i < line.length; i++) {
    let c = line[i];
    if (!c.toLowerCase().match(/[\w/ <>]/) && !thePrefixIsIn) {
      result.prefix += c;
    } else {
      thePrefixIsIn = true;
      result.content += c;
    }
  }
  return result;
}

let markdownArea = document.getElementById("markdown-input");
markdownArea.defaultValue =
  "#Heading\n##Subheading\nNormal Text\n##Example Codeblock\n```html\n<h1>Heading Example</h1>\n<h2>Subheading Example</h2>\n```\nMore Normal Text";

function convert() {
  let markdownArea = document.getElementById("markdown-input");
  let md = markdownArea.value;
  let convertedHtmlArray = convertMarkdown(md);
  let htmlDisplay = document.getElementById("html-display");
  let inBlock = false;
  htmlDisplay.innerHTML = "";
  convertedHtmlArray.forEach((line) => {
    // debugger;
    let currentVal = htmlDisplay.innerHTML;
    htmlDisplay.innerHTML = currentVal + line;
  });
  // from highlight.js script in index.html
  hljs.initHighlighting.called = false;
  hljs.initHighlighting();
}
