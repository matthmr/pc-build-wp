const api = {
  github: "https://observeofmath.github.io/pc-build-wp/build/parts.json", 
  localhost: "http://192.168.1.5:12345/build/parts.json",
  userGithub: "https://observeofmath.github.io/pc-build-wp/build/custom-parts.json",
  userLocalhost: "http://192.168.1.5:12345/build/custom-parts.json"
};
const parts = ["mbd", "cpu", "ram", "ssd", "gpu", "psu", "coo", "cas"];
var update = {
  isSimpleView: false,
  hasHyperlinked: false
};
var copy = new Object();
for (let part of parts.concat("pbd")) {
  copy[part] = document.getElementById(`${part}-head`).innerHTML;
}

var UpdateView = function () {
  const headUrl = (content) => {
    document.getElementById("show-table").innerHTML = ".form-table{display:none;}";
    for (let part of parts.concat("pbd")) {
      document.getElementById(`${part}-head`).innerHTML = content(part) + copy[part] + (content(part)?"</a>":"");
    }
  };
  const normalUrl = () => {
    document.getElementById("show-table").innerHTML = ".form-table{*/display:none*/;}";
    for (let part of parts.concat("pbd")) {
      let url = document.querySelectorAll(`#${part} input`)[3].value;
      document.getElementById(`${part}-head`).innerHTML = copy[part];
      document.getElementById(`${part}-table`).href = url;
    }
  }
  
  // Hyperlink Header
  if (update.isSimpleView && update.hasHyperlinked) {
    headUrl(
      part => `<a href="${document.querySelectorAll(`#${part} input`)[3].value}">`
      );
  }
  // Normal Hyperlink
  else if (!update.isSimpleView && update.hasHyperlinked) {normalUrl();}
  // Normal Header
  else if (update.isSimpleView && !update.hasHyperlinked) {headUrl(part => "");}
  // Normal
  else {
    document.getElementById("show-table").innerHTML = ".form-table{*/display:none*/;}"
    for (let part of parts.concat("pbd")) {
      document.getElementById(`${part}-table`).href?document.getElementById(`${part}-table`).removeAttribute("href"):0;
      document.getElementById(`${part}-head`).innerHTML = copy[part];
    }
  }
}

var makeCustomForm = function() {

  const table = function(part) {
    return `<table class="form-table"><tr><td><label for="name">Marca:</label></td><td><input type="text"/></td></tr><tr><td><label for="specs">Especificação:</label></td><td><input type="text"/></td></tr><tr><td><label for="price">Preço (R$):</label></td><td><input type="text"/></td></tr><tr><td><label for="url"><a id="${part}-table">URL</a>:</label></td><td><input type="text"/></td></tr></table>`;
  }

  for (let part of parts) {
    document.getElementById(part).innerHTML = table(part);
  }
  document.getElementById("pbd").innerHTML = table("pbd");
}

var cachedQuery = new Array();
/* var innerParts = new Object; */

var createJSONFromQuery = function () {

	if (notmyfuckingproblem) {
		document.getElementById("status").innerHTML = '<i style="color:#c9c900;"> SEM RESULTADO: Esta forma já está no cache</i><span style="color:#c9c900">.</span>';
		for (let part of parts) {
			for (let i = 0; i < 4; i++) {
				document.querySelectorAll(`#${part} input`)[i].value = '';
			}
		}
		for (let i = 0; i < 4; i++) {
			document.querySelectorAll(`#pbd input`)[i].value = '';
		}
		notmyfuckingproblem = false;
		return;
	}

	let hasBroken = false;
	let innerParts = new Object;
	let query = new Array;

	if (document.querySelectorAll("#choose-input-type input")[0].checked) {
		for (let part of parts) {
			let partForm = document.querySelectorAll(`#${part} input`)
			for (let i=0;i<4;i++) {
				if (!partForm[i].value && i != 1) {
					document.getElementById("status").innerHTML = '<i style="color:red;"> ERRO: Há lacunas não preenchidas. Preencha todas as lacunas caso queira enviar uma <i style="color:red">build</i> de <b>todas as peças</b> ou preencha todas as de <b>computadores pré-montados</b></i><span style="color:red;">.</span>';
					hasBroken = true;
					break;
				} else {
					query.push(partForm[i].value)
				}
			}
			if (!hasBroken) {
				innerParts[part] = query;
				query = new Array;
			} else {
				break;
			}
		}
		if (!hasBroken) {
			if (cachedQuery) {
				for (let cache of cachedQuery) {
					let exists = true;
					for (let part of parts) {
						if (!cache[part]) {
							cachedQuery.push(innerParts);
							document.getElementById("status").innerHTML = '<i style="color:green;"> SUCESSO: Forma enviada para o cache</i><span style="color:green;">.</span>';
							return;
						}
						exists = exists
						&& cache[part][0] == innerParts[part][0]
						&& cache[part][1] == innerParts[part][1]
						&& cache[part][2] == innerParts[part][2]
						&& cache[part][3] == innerParts[part][3]
					}
					if (exists) {
						document.getElementById("status").innerHTML = '<i style="color:#c9c900;"> SEM RESULTADO: Esta forma já está no cache</i><span style="color:#c9c900">.</span>';
						return;
					}
				}
			cachedQuery.push(innerParts);
			document.getElementById("status").innerHTML = '<i style="color:green;"> SUCESSO: Forma enviada para o cache</i><span style="color:green;">.</span>';
			return;
			}
			else {
				cachedQuery.push(innerParts);
				document.getElementById("status").innerHTML = '<i style="color:green;"> SUCESSO: Forma enviada para o cache</i><span style="color:green;">.</span>';
			}
		}
	}
	else {
		let partForm = document.querySelectorAll("#pbd input");
		for (let i=0;i<4;i++) {
			if (!partForm[i].value && !(i==1)) {
				document.getElementById("status").innerHTML = '<i style="color:red;"> ERRO: Há lacunas não preenchidas. Preencha todas as lacunas caso queira enviar uma <i style="color:red">build</i> de <b>todas as peças</b> ou preencha todas as de <b>computadores pré-montados</b></i><span style="color:red;">.</span>';
				hasBroken = true;
				break;
			} else {
				query.push(partForm[i].value);
			}
		}
		if (!hasBroken) {
			if (cachedQuery) {
				for (let cache of cachedQuery) {
					if (!cache.pbd) {
						continue;
					}
					if (cache.pbd[0] == query[0]
						&& cache.pbd[1] == query[1]
						&& cache.pbd[2] == query[2]
						&& cache.pbd[3] == query[3]
					) {
						document.getElementById("status").innerHTML = '<i style="color:#c9c900;"> SEM RESULTADO: Esta forma já está no cache</i><span style="color:#c9c900">.</span>';
						return;
					}
				}
				innerParts.pbd = query;
				cachedQuery.push(innerParts);
				document.getElementById("status").innerHTML = '<i style="color:green;"> SUCESSO: Forma enviada para o cache</i><span style="color:green;">.</span>';
				return;
			}
			else {
				cachedQuery.push(innerParts);
				document.getElementById("status").innerHTML = '<i style="color:green;"> SUCESSO: Forma enviada para o cache</i><span style="color:green;">.</span>';
			}
		}
	}
}

var computeTotalPrice = function () {
	let totalPrice = new Number();
	let individualPrice = new Array();

	// All parts selected
  if (document.querySelectorAll("#choose-input-type input")[0].checked) {

  	for (let i = 0; i < 8; i++) {
  	  individualPrice.push(document.querySelectorAll(`#${parts[i]} input`)[2].value);
  	  if (!individualPrice[individualPrice.length - 1]) {
  	    document.getElementById("status").innerHTML = `<i style="color:red;"> ERRO: Entre o preço nas formas de <b style="color:red;"> todas as peças</b>; <a href="#notice">Mais infomações sobre esse erro</a></i><span style="color:red;">.</span>`;
  	    individualPrice = new Array();
        return;
  	  }
  	}
  	for (let price of individualPrice) {
  	  totalPrice += Number(price);
  	}
  
  	let exist;
    let index = -1;
    
    for (let cache of cachedQuery) {
      index++;
      exist = true;
      for (let part of parts) {
		if (!cache[part]) {
			cache = cache[0];
		}
        partForm = document.querySelectorAll(`#${part} input`);
        exist = exist
        && cache[part][0] == partForm[0].value
        && cache[part][1] == partForm[1].value
        && cache[part][2] == partForm[2].value
        && cache[part][3] == partForm[3].value
      }
      if (exist && !cache.tot) {
        cachedQuery[index].tot = totalPrice;
        document.getElementById("status").innerHTML = `<i style="color:green;"> O preço total é R$ ${totalPrice}. Essa build já está no cache, portanto foi atualizada</i><span style="color:green;">.</span>`;
          return;
      } else if (cache.tot) {
        if (cache.tot == totalPrice) {
          document.getElementById("status").innerHTML = `<i style="color:green;">Essa build já está no cache; o preço total é R$ ${totalPrice}</i><span style="color:green;">.</span>`;
            return;
        }
      }
    }

    document.getElementById("status").innerHTML = `<i style="color:green;"> O preço total é R$ ${totalPrice}</i><span style="color:green;">.</span>`;
  }
  // Custom pc selected
  else {
    pbdForm = document.querySelectorAll("#pbd input"); 
    let index = -1;
    for (let cache of cachedQuery) {
      index++;
      if (cache.pbd) {
        if (cache.pbd[0] == pbdForm[0].value
        && cache.pbd[1] == pbdForm[1].value
        && cache.pbd[2] == pbdForm[2].value
        && cache.pbd[3] == pbdForm[3].value) {
          if (cache.tot) {
            document.getElementById("status").innerHTML = `<i style="color:green;">Essa build já está no cache; o preço total é R$ ${cache.tot}</i><span style="color:green;">.</span>`;
            return;
          }
          cachedQuery[index].tot = pbdForm[2].value;
          document.getElementById("status").innerHTML = `<i style="color:green;"> O preço total é R$ ${pbdForm[2].value}. Essa build já está no cache, portanto foi atualizada</i><span style="color:green;">.</span>`;
          return;
        }
      }
    }
      if (pbdForm[2].value && Number(pbdForm[2].value)) {
        document.getElementById("status").innerHTML = `<i style="color:green;"> O preço total é R$ ${pbdForm[2].value}</i><span style="color:green;">.</span>`;
      }
      else {
        document.getElementById("status").innerHTML = `<i style="color:red;"> ERRO: Entre o preço nas formas de <b style="color:red;"> computadores pré-montados</b>; <a href="#notice">Mais infomações sobre esse erro</a></i><span style="color:red;">.</span>`;
      }
    }
}

/* var computePriceFromJSON = function () {
	// Legacy entry type JSON file
} */

var JSONFILE = {
	download: new String(),
	upload: new Object(),
	ID: new Array()
};
var FILENAME = 1;
var downloadJSON = function () {
  if (!cachedQuery.length) {
    document.getElementById("status").innerHTML = `<i style="color:red;"> ERRO: Nenhuma forma foi enviada para o cache até agora</i><span style="color:red;">.</span>`;
  } else {
    JSONFILE.download = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cachedQuery));
    let downloadButton = document.getElementById('download-json');
    downloadButton.setAttribute("href", JSONFILE.download);
    downloadButton.setAttribute("download", `build${FILENAME++}.json`);
    downloadButton.click();
  }
}

var uploadJSON = function () {
	
	/* https://jsfiddle.net/Ln37kqc0/ */
	
	var files = document.getElementById("upload").files; 
	var reader = new FileReader();
  
	reader.onload = function(file) { 
		JSONFILE.upload.getUpload = JSON.parse(file.target.result);
	}

	try {
		reader.readAsText(files.item(0))
		const currID = document.querySelector("#upload").files[0].name;
		for (let id of JSONFILE.ID) {
			if (JSONFILE.ID.includes(currID)) {
				document.getElementById("upload-status").innerHTML = `<i style="color:#c9c900;"> SEM RESULTADO: Este arquivo já foi enviado</i><span style="color:#c9c900">.</span>`
				return;
			}
		}
		document.getElementById("upload-status").innerHTML = `<i style="color:green;"> SUCESSO: ${document.querySelector("#upload").files[0].name} foi enviado</i><span style="color:green;">.</span>`;
		JSONFILE.ID.push(document.querySelector("#upload").files[0].name);
	} catch (noFile) {
		document.getElementById("upload-status").innerHTML = `<i style="color:red;"> ERRO: Nenhum arquivo foi selecionado para ser enviado</i><span style="color:red;">.</span>`;
		return;
	}
}

var carryToCache = function() {
	if (!JSONFILE.upload.getUpload) {
		document.getElementById("upload-status").innerHTML = `<i style="color:red;"> ERRO: Nenhum arquivo foi enviado</i><span style="color:red;">.</span>`;
		return;
	} else if (cachedQuery) {
		for (let cache of cachedQuery) {
			if (document.querySelector("#upload").files[0]) {
			if (cache.cachedQueryID == document.querySelector("#upload").files[0].name) {
				document.getElementById("upload-status").innerHTML = `<i style="color:#c9c900;"> SEM RESULTADO: Este arquivo já está em cache</i><span style="color:#c9c900">.</span>`
				return;
			}
			}
		}
	}
	document.getElementById("upload-status").innerHTML = `<i style="color:green;"> SUCESSO: ${document.querySelector("#upload").files[0].name} foi carregado para o cache</i><span style="color:green;">.</span>`;
	JSONFILE.upload.getUpload.cachedQueryID = document.querySelector("#upload").files[0].name;
	cachedQuery.push(JSONFILE.upload.getUpload);
}

var multipleBuilds = {
	fromViewJSON: false
};

var notmyfuckingproblem = false;
var viewJSON = function () {
	if (!cachedQuery.length) {
		document.getElementById("upload-status").innerHTML = `<i style="color:red;"> ERRO: Nenhuma build em cache. Caso queira visualizar uma build enviada, carrege-a ao cache primeiro clicando em "<b>Carregar para o cache</b>"</i><span style="color:red;">.</span>`;
		return;
	}
	// If there are multiple elements in the cache
	if (cachedQuery.length > 1 && !multipleBuilds.fromViewJSON) {
		let message = `<br/><i> Há mais de uma build no cache, escolha qual visualizar depois clique novamente com "<b>Visualize</b>":</i><br/><form id="choose-which-build"><blockquote><div>`;
		let messageAdd = (buildID) => `<div><label>build ${buildID}</label><input type="radio" name="which-build"></div>`;
		for (let buildID = 1; buildID <= cachedQuery.length; buildID++) {
			message += messageAdd(buildID);
		}
		document.getElementById("upload-status").innerHTML = message + `</div></blockquote></form>`
		+ `<br/>`;
		multipleBuilds.fromViewJSON = true;
		return;
	}
	// If chosen one out of the elements to work with
	else if (multipleBuilds.fromViewJSON) {
		notmyfuckingproblem = true;
		let whichSelected;
		// Sets the value of the index to whichSelected
		for (let i = 0; i < cachedQuery.length; i++) {
			if (document.querySelectorAll("#choose-which-build input")[i].checked) {
				whichSelected = i;
				multipleBuilds.fromViewJSON = false;
				document.getElementById("upload-status").innerHTML = `<i style="color:green;"> SUCESSO: A build escolhida foi a build ${whichSelected + 1}</i><span style="color:green;">.</span>`;
				break;
			}
		}
		// CHOSEN: Takes care of imported ones
		if (cachedQuery[whichSelected].length) {
			// If custom-parts computer
			if (!cachedQuery[whichSelected][0].pbd) {
				for (let part of parts) {
					for (let i = 0; i < 4; i++) {
						document.querySelectorAll(`#${part} input`)[i].value = cachedQuery[whichSelected][0][part][i];
					}
				}
			}
			// Else pre-built computer
			else {
				for (let i = 0; i < 4; i++) {
				document.querySelectorAll("#pbd input")[i].value = cachedQuery[whichSelected][0].pbd[i];
				}
			}
		}
		// CHOSEN: Takes care of custom ones
		else {
			// If custom-parts computer
			if (!cachedQuery[whichSelected].pbd) {
				for (let part of parts) {
					for (let i = 0; i < 4; i++) {
						document.querySelectorAll(`#${part} input`)[i].value = cachedQuery[whichSelected][part][i];
					}
				}
			}
			// Else pre-built computer
			else {
				// Loop through all structurable parts
				for (let i = 0; i < 4; i++) {
					document.querySelectorAll("#pbd input")[i].value = cachedQuery[whichSelected].pbd[i];
				}
			}
		}
	}
	// Only one element in the cache
	else {
		notmyfuckingproblem = true;
		// ONE: Takes care of imported ones
		if (cachedQuery[0].length) {
			// If custom-parts computer
			if (!cachedQuery[0][0].pbd) {
				for (let part of parts) {
					for (let i = 0; i < 4; i++) {
						document.querySelectorAll(`#${part} input`)[i].value = cachedQuery[0][0][part][i];
					}
				}
			}
			// Else pre-built computer
			else {
				for (let i = 0; i < 4; i++) {
				document.querySelectorAll("#pbd input")[i].value = cachedQuery[0][0].pbd[i];
				}
			}
		}
		// ONE: Takes care of custom ones
		else {
			// If custom-parts computer
			if (!cachedQuery[0].pbd) {
				for (let part of parts) {
					for (let i = 0; i < 4; i++) {
						document.querySelectorAll(`#${part} input`)[i].value = cachedQuery[0][part][i];
					}
				}
			}
			// Else pre-built computer
			else {
				// Loop through all structurable parts
				for (let i = 0; i < 4; i++) {
					document.querySelectorAll("#pbd input")[i].value = cachedQuery[0].pbd[i];
				}
			}
		}
	}
}

// Structure inside the custom build: [name, specs, price, url]
