let inBlock = false;
function convertMarkdown(txt) {
  const lines = txt.split("\r");
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
        result.push(`<div class="codeblock">${codeBlock}</div>`);
        codeBlock = "";
      } else {
        // new codeblock. Set inBlock to true
        inBlock = true;
      }
    } else {
      if (inBlock) {
        // Incoming content without a prefix is part of a block. Add to codeblock
        codeBlock += `${lineData.content}\r`;
      } else {
        // not in codeblock so regular paragraph text
        result.push(`<p>${lineData.content}</p>`);
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

const markdownText =
  "#Basic HTML\rThe key to writing basic HTML is basically just to learn a bunch of tags and then write them. A browser will render the text as a formatted web page.\rExample:\r```html\r<h1>This is a big heading</h1>\r<h2>This is a small heading</h2>\r<p>This is some normal paragraph text. It is common for paragraph text to be long but usually no more than (...wait for it...) a single paragraph</p>\r```\r##Headings\rYep, you'll need these, they are important. You'll find headings at the head of each section you write. Get it? Heading? Head? So awesome, glad we're all on the same page.\r##Parapgrah Text\rYep, you will need this too. Paragraph text may be boring but when you go to a website what would you guess people spend the most time looking at? If you guessed \"paragraph text\" you are *almost* right. It's actually videos of people and cats doing stupid stuff. Paragraph text is second longest.";

let convertedText = convertMarkdown(markdownText);
for (let element of convertedText) {
  console.log(element);
}
