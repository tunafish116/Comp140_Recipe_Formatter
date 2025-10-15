



function generate_recipe_clicked() {
    let text = document.getElementById("text-input").value;
    let textOutput = document.getElementById("text-output");


    text = text.replaceAll(/(\w+)\[([^\]]+)\]/g, "$1<sub>$2</sub>");

    const reserved = [
    'break','class','continue','else','False','for','if','elif',
    'def','in','None','return','True','while','random','len','as',
    'append','push','pop','and','not','or','sub','range'
    ];
    const reservedPattern = reserved.join('|');
    const regex = new RegExp(
    `\\b(?!${reservedPattern}\\b)[a-zA-Z_$][a-zA-Z0-9_$]*\\b`,
    'g'
    );
    
    text = text.replace(regex, '<u>$&</u>');



    text = text.replaceAll(/(\w+)\s+([\+|-|\\|\*])= (\w+)/g, "$1 = $1 $2 $3");
    text = text.replaceAll("=","\u2190");
    text = text.replaceAll("for ", "for each ");
    text = text.replaceAll("else, do", "else, then");
    text = text.replaceAll("elif ", "otherwise, if ")
    const appendRegex = /(\w+)\.append\(([^\)]+)\)/g;
    text = text.replaceAll(appendRegex, "append $2 to $1 ");
    text = text.replaceAll(/len\((\w+)\)/g, "the length of $1 ");


    const subsequenceRegex = /(\w+)\[\s*([^:\]]*)\s*:\s*([^:\]]*)\s*\]/g;
    text = text.replaceAll(subsequenceRegex, (match, thing1, thing2, thing3) => {
    const start = thing2.trim() || `the start of ${thing1}`;
    const end = thing3.trim() || `the end of ${thing1}`;
    return `subsequence of ${thing1} from ${start} to ${end}`;
    });

    text = text.replaceAll("{}", "an empty map");
    text = text.replaceAll("[]", "an empty sequence");


    text = text.replaceAll(/:\s?\n/g, ", do\n");
    text = text.replaceAll("def ","Name: ");




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
 * 
 * 
 * 
 * 
 * 
 */ 

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