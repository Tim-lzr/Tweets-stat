/* TweetStats
 *
 * Fichier       ./front/classes/word-cloud.js
 * Description   Classe pour le dessin d'un nuage de mots, étend HtmlDisplay
 */

class WordCloud extends Display {

    /*
     * Constructeur de la classe WordCloud
     * 
     * @params
     *   element: l'élément DOM à utiliser comme parent ("div" de préférence)
     * 
     * @notes
     *   Penser à définie le callback avec "this.setCallBack()" avant d'appeller "this.draw()"
     */
    constructor(element) {

        // On va créer un sous-element pour contenir le nuage
        var subDiv = document.createElement("div");
        subDiv.className = "word-cloud-container";
        element.appendChild(subDiv);

        // Appel du constructeur parent
        super(subDiv);

        // Distance entre les mots
        this.distance = 0.7;

        // Fonction qui sera appelée avec le mot cliqué en paramètre
        this.clickCallBack = null;

    }

    /*
     * Défini la fonction à appeller lors du clique sur un mot
     * 
     * @params
     *   fun: la fonction
     * 
     * @notes
     *   Doit être appellée avant "this.draw()"
     */
    setCallBack(fun) {
        this.clickCallBack = fun;
    }

    /*
     * Normalise les données pour que la plus grande valeur soit égale à la valeur entrée
     * 
     * @params
     *   data: les données (cf. "WordCloud.draw()")
     *   max:  la valeur maximale
     * 
     * @return
     *   les données normalisées
     */
    normalize(data, max) {
        // Cherche la plus grande valeur
        var dataMax = -1;
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > dataMax) {
                dataMax = data[i][1];
            }
        }
        // Normalise les données
        for (var i = 0; i < data.length; i++) {
            data[i][2] = data[i][1];
            data[i][1] = data[i][1] * max / dataMax;
        }
        return data;
    }

    /*
     * Dessine le nuage de mots
     * 
     * @params
     *   data: les données à utiliser pour le dessin
     *         Un tableau à deux dimensions de taille [n][2 ou 3], chaque sous-tableau doit comporter [word, weight, display]
     *           word:    le mot à afficher
     *           weight:  le "poid" du mot (plus le poid est important, plus le mot sera affiché en grand)
     *           display: le nombre à afficher (facultatif, "weight" sera utilisé si il n'existe pas)
     * 
     * @notes
     *   Penser à définie le callback avec "this.setCallBack()" avant d'appeller "this.draw()"
     */
    draw(data) {

        // Vérification du callback
        if (typeof this.clickCallBack !== "function") {
            console.error("WordCloud.draw(): Error, incorrect callback! Please read the documentation.");
            return;
        }

        // Appel de la méthode mère
        super.draw(data);

        // Sauvegarde de l'environnement
        let wordCloudThis = this;

        // Sort data
        data.sort(function(w1, w2) {
            return -1 * (w1[1] - w2[1]);
        });

        // visited words
        var wordsVisited = [];

        // function creating words div
        function createWordDiv(word, weight, realValue) {
            // new div element
            var wordContainer = document.createElement("div");
            // return word when clicked
            wordContainer.addEventListener("click", function() {
                wordCloudThis.clickCallBack(this.innerHTML);
            });
            wordContainer.title = realValue + " occurrences";
            wordContainer.className = "word-cloud-element";
            
            // position must be ABSOLUTE
            wordContainer.style.position = "absolute";
            // font size
            wordContainer.style.fontSize = weight + "px";
            // famous distance between words ;-)
            wordContainer.style.lineHeight = wordCloudThis.distance;
            // add child
            wordContainer.appendChild(document.createTextNode(word));
            // return result
            return wordContainer;
        }

        // function check if place is free
        function checkPlaceFree(word, x, y) {
            // add child
            wordCloudThis.element.appendChild(word);    
            // important ! 
            word.style.left = x - word.offsetWidth/2 + "px";
            word.style.top = y - word.offsetHeight/2 + "px";
            // get smallest word in rect
            var current = word.getBoundingClientRect();
            // for each visited words
            for(var i = 0; i < wordsVisited.length; i++){
                // if current word not in intersection with one of the visited words
                // then free place found ! (add some value to move words from each other)
                if(!(current.right < wordsVisited[i].left || current.left > wordsVisited[i].right + 5||
                    current.bottom < wordsVisited[i].top || current.top > wordsVisited[i].bottom + 5)){
                    // place found return true
                    return true;
                }
            }
            // if no place found return false
            return false;
        }

        // function to turn around visited words with a callback
        function spiral(angle, callback) {
            var x = (1 + angle) * Math.cos(angle);
            var y = (1 + angle) * Math.sin(angle);
            return callback(x, y);
        }

        // function to place words
        function placeWords() {
            // importants positions variables
            var divWordCloudWidth = wordCloudThis.element.offsetWidth / 2;
            var divWordCloudHeight  = wordCloudThis.element.offsetHeight / 2;
            // for each (word, weight) in data array
            for (var i = 0; i < data.length; i += 1) {
                // create div and set couple with (word, wright)
                var couple = null;
                if (data[i].length == 2) {
                    couple = createWordDiv(data[i][0], data[i][1], data[i][1]);
                } else {
                    couple = createWordDiv(data[i][0], data[i][1], data[i][2]);
                }
                // turn around to find a free place -> 1080°
                for (var j = 0; j < 1080; j++) {
                    //If function spiral returns true, 
                    // free place for word available -> return true and break
                    if (spiral(j, function(x, y) {
                        if (!checkPlaceFree(couple, divWordCloudWidth + x, divWordCloudHeight + y)) {
                            // add child
                            wordCloudThis.element.appendChild(couple);
                            // add rect's element in visted words
                            wordsVisited.push(couple.getBoundingClientRect());;
                            return true;
                        }
                    })) {
                        // leave loop for
                        break;
                    }
                }
            }
        }

        // call to place words -> the main function
        placeWords();
        
    }

}
