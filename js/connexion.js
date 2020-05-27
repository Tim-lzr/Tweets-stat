window.addEventListener("load", function () {
	function sendData() {
	  var XHR = new XMLHttpRequest();
  
	  var FD = new FormData(form);
  
		XHR.addEventListener("readyState", function(event) {
		
		 if (XHR.status == 200 && XHR.readyState == 4){
			
	   
	  display_table(event.target.response);}
	  });
	
  
	  // Definissez ce qui se passe en cas d'erreur
	  XHR.addEventListener("error", function(event) {
		alert('Oups! Quelque chose s\'est mal passée');
	  });
	  //XHR.responseType = 'json';
  
	  XHR.open("POST", "../cgi-bin/requette.py",false);
  
	 
	  XHR.send(FD);
	  //console.log(XHR);
	  var res=JSON.parse(XHR.response);
	  console.log(res);
  
	 //Résumé des résultats 
	 

  
	  //On compte le nombre de tweets par pays
	  function sum(column){
	  			return res.reduce( (acc, o) => (acc[o[column]] = (acc[o[column]] || 0)+1, 	acc),{});
	  //ON récupere clés et valeurs 
	  }
	  var valuesSum=sum("place_country_code");
	  var key = Object.keys(valuesSum);
	  var value = Object.values(valuesSum);
	  var keys=[]
	  for (var i=0; i<key.length; i++){
		keys.push("'"+key[i]+"'");
	  }
	  var results= document.getElementById('container');
	  console.log(valuesSum);
	  var users=sum("user_id");
	  results.innerHTML= "<h1>Summary</h1>\
							<ul>\
						<li>Nombre de tweets:"+res.length+"</li>\
						<li>Nombre de pays:"+key.length+"</li>\
						<li>Nombre de users:"+Object.keys(users).length+"</li>\
					</ul> \
					<div id=\"tab\"></div>";
		var htbody = ""
	  res.forEach( e=> {
		htbody += "<tr><td style='padding:5px'>"+e['user_name']+"</td><td style='width:200px'>"+e['date']+"</td><td>"+e['text']+"</td></tr>";
	  });
	  var hashtags = "<h1>Result</h1>\
	 				 <div class=\"tbl-header\">\
						<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\
		  				<thead>\
							<tr> \
							<th>User</th> \
							<th>Date</th> \
							<th>Text</th> \
						  </tr> \
						</thead> \
						</table>\
						</div>\
						<div class=\"tbl-content\">\
						  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\
							<tbody>\
						  "+ htbody +" \
					  </tbody></table>";
					  var tab= document.getElementById('tab');
					  tab.innerHTML=hashtags;
		//On limite les résultats de la recherche pour faire les graphiques 
	  if (keys.length>5){
		  var labels= keys.slice(0,5);
	  }
	  if (value.length>5){
		  var donnes= value.slice(0,5);
	  }
	  //console.log(value.slice(0,5));
  
  
  
	  //Dessin de bar-chart
	  new Chart(document.getElementById("Bar-chart"), {
		  type: 'horizontalBar',//on choisit le type 
		  data: {
			labels:labels,
			datasets: [
		  {
			label: " of Tweets",//a compléter
			 backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
			data: donnes//a compléter
		  }
			]
		  },
		  options: { 
		  legend: { display: false },
				title: {
					 display: true,
			  text: 'Tweets'
						},
		  scales: {
			  xAxes: [{
				  ticks: {
					  min: 0 
				  }
			  }]}
	  }
			
	  });
  
  
	  //On dessine le camembert 
	  new Chart(document.getElementById("pie-chart"), {
		  type: 'pie',//type
		  data: {
			labels: labels,
			datasets: [{
		  label: "of Tweets",
		  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
		  data:donnes
			}]
		  },
		  options: {
			title: {
		  display: true,
		  text: 'Un diagramme circulaire representant la repartition des Tweets.'
			}
		  }
	  });
  
  
  
	  function SuppListe(list){
		try {
		  while(list.lastElementChild){
			list.removeChild(list.lastElementChild);
		} 
		} catch (error) {
		  console.error(error);
		}
	  }
  
  
  
  
	  function drawMap(jsonData) {
		//On telecharge l'image à partir du fichier
		image = new Image;
		image.src = 'images/world_map.png';
		//On telecharge le marker
		let marker=new Image;
		marker.src='images/marker.png';
  
		// Initialisation du canvas
		let canvas = document.createElement("canvas");
		canvas.width = 3000*0.300;
		canvas.height = 2400*0.300;
		let context = canvas.getContext("2d");
  
		 image.onload = function () {//On affiche l'image
		
		 context.drawImage(image,0,0,image.width,image.height,0,0,canvas.width,canvas.height);
			
		 //On  Calcule les coordonnes x,y  pour chaque element 
		  jsonData.forEach(e => {
		  
			let coordone = mercatorXY(canvas.width,canvas.height,e['longitude'],e['latitude']);
		   
		  context.drawImage(marker,coordone[0],coordone[1],20,15); 
		  });
		}
		return canvas;   
	  }
  
	  //Fonction meractorXY
	  function mercatorXY(width,height,longitude,latitude) {
		let x;
		let radLatitude = latitude * Math.PI /180;
		let y;
  
		x = width * ((longitude + 180 -10)/360);
		y = (height/2) - ( (width/(2*Math.PI)) * ( Math.log( Math.tan( Math.PI/4 + radLatitude/2 )))) ;
		
		return [x,y];
	  }
  
  
	  //on dessine la carte 
	  let mapList = document.getElementById("world_map");
			SuppListe(mapList);
			let mapCanvas = drawMap(res);
			mapList.appendChild(mapCanvas);
  
  
	   
	   
  
  
	  //On récupere tous les hashtags trouvés
	  var hashtags=[]
	  const iterator=res.keys();
	  for (const key of iterator) {
		hashtags.push(res[key]['hashtag_0'],res[key]['hashtag_1'],res[key]['hashtag_2']);
	  }
  
	  //on filtre les hashtags en supprimant les null 
	  for( var i = 0; i < hashtags.length; i++){ if ( hashtags[i] === null) { hashtags.splice(i, 1); i--; }}
	  //console.log(hashtags);
  
	  //On crée une fonction qui compte le nbr de fois que le hashtag apparait 
	  function getWordCount(array) {
		let map = [];
	   for (let i = 0; i < array.length; i++) {
		  let item = array[i];
		  map[item] = ((map[item] + 1) || 1);
		}
	  
		return map;
	  }
	  
	  var dict=getWordCount(hashtags);
	  function sortProperties(obj)
  {
	// convert object into array
	  var sortable=[];
	  for(var key in obj)
		  if(obj.hasOwnProperty(key))
			  sortable.push([key]); // each item is an array in format [key, value]
	  
	  // sort items by value
	  sortable.sort(function(a, b)
	  {
		return b[1]-a[1]; // compare numbers
	  });
	  return sortable; 
	  }
	  var sortedDict=sortProperties(dict);
	  
	  console.log(sortedDict);
	  //on limite le nombre de hashtags afin de pouvoir les mettre dans un word cloud on prend les 20 best
	  var hashtag_words=[];
	  if (sortedDict.length>20){
		  hashtag_words=sortedDict.slice(0,20);
	  }else{hashtag_words=sortedDict}
  
	  
  
		   //Configuration du wordcloud
	  var config = {
		  trace: true,
		  spiralResolution: 1, //Lower = better resolution
		  spiralLimit: 360 * 5,
		  lineHeight: 0.8,
		  xWordPadding: 0,
		  yWordPadding: 3,
		  font: "sans-serif"
	  }
  
	  //On définit une fréquence pour les hashtags afin de varier la taille
	  var words = hashtag_words.map(function(word) {
		  return {
		  word: word,
		  freq: Math.floor(Math.random() * 50) + 10
		  }
	  })
  
	  //tri selon la fréquence
	  words.sort(function(a, b) {
		  return -1 * (a.freq - b.freq);
	  });
  
	  
	  var cloud = document.getElementById("word-cloud");
	  cloud.style.position = "relative";
	  cloud.style.fontFamily = config.font;
  
	  //On crée le canvas
	  var traceCanvas = document.createElement("canvas");
	  traceCanvas.width = cloud.offsetWidth;
	  traceCanvas.height = cloud.offsetHeight;
	  var traceCanvasCtx = traceCanvas.getContext("2d");
	  cloud.appendChild(traceCanvas);
  
	  var startPoint = {
		  x: cloud.offsetWidth / 2,
		  y: cloud.offsetHeight / 2
	  };
  
	  var wordsDown = [];
  
	  //Fonction qui crée l'objet qu'on veut afficher
	  function createWordObject(word, freq) {
		  var wordContainer = document.createElement("div");
		  wordContainer.style.position = "absolute";
		  wordContainer.style.fontSize = freq + "px";
		  wordContainer.style.lineHeight = config.lineHeight;
		  wordContainer.appendChild(document.createTextNode(word));
  
		  return wordContainer;
	  }
	  //position des mots
	  function placeWord(word, x, y) {
  
		  cloud.appendChild(word);
		  word.style.left = x - word.offsetWidth/2 + "px";
		  word.style.top = y - word.offsetHeight/2 + "px";
  
		  wordsDown.push(word.getBoundingClientRect());
	  }
  
	  //Rectangle qui contient les mots
	  function trace(x, y) {
		  traceCanvasCtx.fillRect(x, y, 1, 1);
	  }
  
	  function spiral(i, callback) {
		  angle = config.spiralResolution * i;
		  x = (1 + angle) * Math.cos(angle);
		  y = (1 + angle) * Math.sin(angle);
		  return callback ? callback() : null;
	  }
  
	  function intersect(word, x, y) {
		  cloud.appendChild(word);    
		  
		  word.style.left = x - word.offsetWidth/2 + "px";
		  word.style.top = y - word.offsetHeight/2 + "px";
		  
		  var currentWord = word.getBoundingClientRect();
		  
		  cloud.removeChild(word);
		  
		  for(var i = 0; i < wordsDown.length; i+=1){
		  var comparisonWord = wordsDown[i];
		  
		  if(!(currentWord.right + config.xWordPadding < comparisonWord.left - config.xWordPadding ||
			   currentWord.left - config.xWordPadding > comparisonWord.right + config.wXordPadding ||
			   currentWord.bottom + config.yWordPadding < comparisonWord.top - config.yWordPadding ||
			   currentWord.top - config.yWordPadding > comparisonWord.bottom + config.yWordPadding)){
			  
			  return true;
		  }
		  }
		  
		  return false;
	  }
  
  
	  (function placeWords() {
		  for (var i = 0; i < words.length; i += 1) {
		  var word = createWordObject(words[i].word, words[i].freq);
		  for (var j = 0; j < config.spiralLimit; j++) {
			  //If the spiral function returns true, we've placed the word down and can break from the j loop
			  if (spiral(j, function() {
					  if (!intersect(word, startPoint.x + x, startPoint.y + y)) {
						  placeWord(word, startPoint.x + x, startPoint.y + y);
						  return true;
					  }
				  })) {
				  break;
			  }
		  }
		  }
	  })();
  
	  //Draw the placement spiral 
	  (function traceSpiral() {  
		  traceCanvasCtx.beginPath();
		if (config.trace) {
		  var frame = 1;
  
  
		  function animate() {
			  spiral(frame, function() {
				  trace(startPoint.x + x, startPoint.y + y);
			  });
			  frame += 1;
			  if (frame < config.spiralLimit) {
				  window.requestAnimationFrame(animate);
			 }
		  }
		  animate();
		  }
	  })();
  }
  
  
		var form = document.getElementById("myForm");
  
		form.addEventListener("submit", function (event) {
		  event.preventDefault();	 
		  sendData();
  
		});
  
	  });