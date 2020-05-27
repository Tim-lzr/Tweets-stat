/* TweetStats
 *
 * Fichier       ./front/classes/graph.js
 * Description   Classe principale pour la représentation d'un graphique, doit être étendue par des classes filles
 */

class Graph {

    /*
     * Constructeur de la classe Graph
     * 
     * @params
     *   element: l'élément DOM canvas à utiliser pour le dessin
     * 
     */
    constructor(element) {
        this.canvas = element;
        this.context = element.getContext("2d");
        this.width = this.canvas.width = element.clientWidth;
        this.height = this.canvas.height = element.clientHeight;
        this.bgColor = "rgba(255, 255, 255, 0)"; 
        this.fgColor = "rgba(0, 0, 0, 1)"; 
        this.lastData = null; // Sauvegarde des dernières données utilisée en cas d'appel à draw() depuis une fonction interne
    }

    /*
     * Dessine le graphique en fonction des données entrées
     * 
     * @warnings
     *   Attention : Vérifiez vos données avant d'appeller cette méthode, en effet celle-ci met en cache les données
     *               pour les appels internes futurs !
     * 
     * @params
     *   data: les données à utiliser pour le dessin
     */
    draw(data) {

        // Sauvegarde les données
        this.lastData = data;

        // Dessine l'arrière plan
        this.context.fillStyle = this.bgColor;
        this.context.fillRect(0, 0, this.width, this.height);

        // Redéfinition des couleurs
        this.context.fillStyle = this.fgColor;
        this.context.strokeStyle = this.fgColor;

        // Suite à implémenter dans les classes filles
    }

    /*
     * Change la couleur d'arrière-plan
     * 
     * @params
     *   color:  La couleur au format HTML/CSS 
     *   redraw: booléen, true par défaut
     */
    setBackgroundColor(color, redraw) {
        if (typeof redraw === "undefined") {
            redraw = true;
        }
        this.bgColor = color;
        if (redraw) {
            this.draw(this.lastData);
        }
    }

    /*
     * Change la couleur de dessin
     * 
     * @params
     *   color:  La couleur au format HTML/CSS
     *   redraw: booléen, true par défaut
     */
    setForegroundColor(color, redraw) {
        if (typeof redraw === "undefined") {
            redraw = true;
        }
        this.fgColor = color;
        if (redraw) {
            this.draw(this.lastData);
        }
    }

    /*
     * Redimensione le graphique
     * 
     * @params
     *   width:  La nouvelle largeur (en pixels, sans le "px")
     *   height: La nouvelle heuteur (en pixels, sans le "px")
     *   redraw: Faut-il redéssiner le graphique ? (booléen, true par défaut)
     */
    resize(width, height, redraw) {
        if (typeof redraw === "undefined") {
            redraw = true;
        }
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        if (redraw) {
            this.draw(this.lastData);
        }
    }

}
