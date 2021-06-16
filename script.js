/* SCRIPT FOR `index.html`*/

const api = {
  github: "https://observeofmath.github.io/pc-build-wp/build/parts.json", 
  localhost: "http://192.168.1.5:12345/build/parts.json",
  userGithub: "https://observeofmath.github.io/pc-build-wp/build/custom-parts.json",
  userLocalhost: "http://192.168.1.5:12345/build/custom-parts.json"
};

var makeTableFromJSON = function() {
  var table = new Object;
  table.head = '<table class="pc-parts-table"><tr><th>Marca</th><th>Especificação</th><th>Preço (Em média)</th></tr>';
  table.foot = "</table>";
  
  fetch(api.github)
    .then(response => response.json())
    .then(data => {
      data.components.meta.forEach(given => {
        table.body = new String;
        data.components[given].forEach(token => {
          table.body += "<tr><td>" + 
						(token.urlable
						? `<a href=${token.url}>${token.name}</a></td><td>`
						: token.name + "</td><td>")
						+ token.specs + "</td><td>" + token.price + "</td></tr>";
        });
        document.getElementById(given).innerHTML = table.head + table.body + table.foot;
      });
    });
}
