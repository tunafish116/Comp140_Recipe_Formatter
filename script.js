


function generate_recipe_clicked() {
    let text = document.getElementById("text-input").value;
    let textOutput = document.getElementById("text-output");



    const variableRegex = /\b(?:for|while)\s+(\w+)|\b(\w+)\s*=/g;
    let variableBank = new Set();
    const parameterRegex = /def\s+(\w+)\s*\(([^)]*)\)/g;
    let match;

    while ((match = variableRegex.exec(text)) !== null) {
      // one of the capture groups will be defined
      variableBank.add(match[1] || match[2]);
    }

    while ((match = parameterRegex.exec(text)) !== null) {
      const params = match[2]
        .split(",")
        .map(p => p.trim())
        .filter(Boolean);
      params.forEach(param => {
        variableBank.add(param);
      });
    }
    console.log(variableBank);


    //  /([\w\[\]\(\)]+)\s?([\+-\\\*])=\s?([\w\[\]\(\)]+)/g
    //  
    text = text.replaceAll(/([\w\[\]\(\)_]+)\s?([\+-/\*])=\s?([\w\[\]\(\)]+)/g, "$1 = $1 $2 $3");
    text = text.replaceAll("=","\u2190");
    text = text.replaceAll("\u2190\u2190","=");
    text = text.replaceAll("for ", "for each ");
    text = text.replaceAll("else, do", "else, then");
    text = text.replaceAll("elif ", "otherwise, if ")
    const appendRegex = /(\w+)\.append\(([^\)]+)\)/g;
    text = text.replaceAll(appendRegex, "append $2 to $1 ");
    text = text.replaceAll(/len\((\w+)\)/g, "the length of $1");
    text = text.replaceAll(/\s*\*\*\s*/g," to the power of ");
    text = text.replaceAll(/sorted\(\s*(\w+)\s*\)/g,"$1 sorted in ascending alhpanumeric order");


    const subsequenceRegex = /(\w+)\[\s*([^:\]]*)\s*:\s*([^:\]]*)\s*\]/g;
    text = text.replaceAll(subsequenceRegex, (match, thing1, thing2, thing3) => {
      const start = thing2.trim()? `${thing1}<sub>`+thing2.trim()+`</sub>` : `the start of ${thing1}`;
      const end = thing3.trim()? `${thing1}<sub>`+thing3.trim()+`</sub>` : `the end of ${thing1}`;
      return `a subsequence of ${thing1} from ${start} to ${end}`;
    });


    text = text.replaceAll(/random.random\(\)/g, "a random real number >= 0 and < 1, chosen with a uniform distribution");
    text = text.replaceAll(/random.randint\(\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/g, "a random integer >= $1 and <= $2 chosen with uniform distribution");
    text = text.replaceAll(/range\(\s*(\w+)\s*\)/g, "the sequence 0,1,2,...,$1")
    text = text.replaceAll(
      /range\(\s*(-?\w+)\s*,\s*(-?\w+)\s*\)/g,
      (match, a, b) => {
        let result = ``
        if(isNaN(a)){
          result = `the sequence ${a},${a + "+1"},${a + "+2"},...,`;
        }else{
          a = parseInt(a);
          result = `the sequence ${a},${a + 1},${a + 2},...,`;
        }
        if(isNaN(b)){
          result += `${b+"-1"}`;
        }else{
          b = parseInt(b);
          result += `${b-1}`;
        }
        return result;
      }
    );
    text = text.replaceAll(/(\w+)\.pop\(\s*(\w+)\s*\)/g, "remove the element at index $2 from $1");

    text = text.replaceAll(/(\w+)\[([^\]]+)\]/g, "$1<sub>$2</sub>");

    variableBank = [...variableBank];
    variableBank = variableBank.join('|');
    const italicize = new RegExp(`([^\\w])(${variableBank})([^\\w])`,'g');
    
    text = text.replace(italicize, '$1<i>$2</i>$3');
    // experimental code below for later versions.
    //text = text.replaceAll(/def\s+(\w+).+/g,"<hr style=\"border-color:black\"><b>Name:</b> $1<hr style=\"border-color:black\">");
    //text = text.replaceAll("*","\u00d7");
    //add ; to the end of each line that isn't class, if, else, elif, while, for

    text = text.replaceAll(/def\s+(\w+).+/g,"<b>Name:</b> $1");
    text = text.replaceAll("return ","<b>return</b> ");
    

    text = text.replaceAll("{}", "an empty map");
    text = text.replaceAll("[]", "an empty sequence");


    // class stuff
    let classNames = /class\s+(\w+):/g.exec(text);
    let className = classNames? classNames[1]:null;
    if(className){
      text = text.replace(/__init__/,"Initialize"+className);
      className = className[0].toLowerCase()+className.slice(1);
      text = text.replaceAll(/<i>self<\/i>\._(\w+)/g, "<i>self</i>.<i>$1</i>");
      text = text.replaceAll("<i>self</i>","<i>"+className+"</i>");
    }



    text = text.replaceAll(/((for|while|if|elif|else).*):\s*\n/g, "$1, do\n");



/** what to replace
 * = > <--
 * : > , do
 * for > for each
 * else, do > else, then
 * *a*.append(*b*) > append *b* to *a*
 * len(*a*) > the length of *a*
 * *a*[*b*:*c*] > subsequence of *a* from *b* to *c*
 * if b or c is empty, replace b or c with "the start of *a*" and "the end of *a*" respectively
 * *a*[*b*] > *a*_*b*
 * range(*a*) > the sequence 0,1,2,..., *a*
 * *a*[+*-/]<--*b* > *a*<--*a*[+*-/]*b*
 ** list(*a*) > a copy of *a*
 ** when talking about dictionaries: in > is in the keys of 
 * random.randint(*a*,*b*) > a random integer >= *a* and <= *b* chosen with uniform distribution
 * random.random() > a random real number >= 0 and < 1, chosen with a uniform distribution
 * word starts with a letter
 * any word not defined not defined in python syntax is underlined
 * 
 * ways for creating new variables
 * 1. parameter
 * 2. <--
 * 3. for, while
 * 
 * For classes:
 * find and store class name: class ******
 * replace __init___ with Initialize*className*
 * within a class, if variables start with _, delete it. Actually, just delete all _var
 * 
 * 
 * 
 */ 

    console.log(text);
    textOutput.innerHTML = text;
}

function unindent_clicked() {
    let textOutput = document.getElementById("text-output");
    let text = textOutput.innerHTML;
    text = text.replaceAll(/\n\s{4}/g,"\n");
    console.log(text);
    textOutput.innerHTML = text;
}

function about_clicked(){
  clickLink("about.html");
}

function clickLink(url){
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function back_to_safety_clicked(){
  clickLink("https://x.com/tecariowolf");
}

function back_clicked(){
  clickLink("index.html");
}

function tips_clicked(){
  clickLink("tips.html");
}