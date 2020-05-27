/* TweetStats
 *
 * Fichier       ./front/classes/resizable-graph.js
 * Description   Classe pour la création et la gestion d'un Graph redimensionnable
 */

 class ResizableGraph {

    /*
     * Constructeur de la classe ResizableGraph
     * 
     * @params
     *   parent:     l'élément DOM dans lequel ajouter le graph créé
     *   GraphClass: la classe à utiliser pour le graph
     */
    constructor(width, height, parent, GraphClass) {

        // Création des éléments DOM
        var div = document.createElement("div");
        div.className = "resizeBox";
        div.style.width = width + "px";
        div.style.height = height + "px";
        var canvas = document.createElement("canvas");
        div.appendChild(canvas);
        parent.appendChild(div);

        // Création de l'objet de dessin
        this.instance = new GraphClass(canvas);

        // Sauvegarde le contexte pour pouvoir y accéder depuis un evênement
        div.it = this;

        // Fonction de redimensionnement
        div.onmouseup = function(e) {
            this.it.instance.resize(this.clientWidth-15, this.clientHeight-15);
        }

    }

    /*
     * Alias vers "this.instance.draw(data)"
     * 
     * @params
     *   data: Les données à dessiner (compatibles avec "GraphClass")
     */
    draw(data) {
        return this.instance.draw(data);
    }

    /*
     * Alias vers "this.instance.setBackgroundColor(data)"
     * 
     * @params
     *   color:  La couleur au format HTML/CSS
     *   redraw: Faut-il redéssiner le graphique ? (booléen, true par défaut)
     */
    setBackgroundColor(color, redraw) {
        return this.instance.setBackgroundColor(color, redraw);
    }

    /*
     * Alias vers "this.instance.setForegroundColor(data)"
     * 
     * @params
     *   color:  La couleur au format HTML/CSS
     *   redraw: Faut-il redéssiner le graphique ? (booléen, true par défaut)
     */
    setForegroundColor(color, redraw) {
        return this.instance.setForegroundColor(color, redraw);
    }

    /*
     * Alias vers "this.instance.resize(data)"
     * 
     * @params
     *   width:  La nouvelle largeur (en pixels, sans le "px")
     *   height: La nouvelle heuteur (en pixels, sans le "px")
     *   redraw: Faut-il redéssiner le graphique ? (booléen, true par défaut) 
     */
    resize(width, height, redraw) {
        return this.instance.resize(width, height, redraw);
    }

 }
