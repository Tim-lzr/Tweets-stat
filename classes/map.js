/* TweetStats
 *
 * Fichier       ./front/classes/map.js
 * Description   Classe pour le dessin de points sur une carte, étend Graph
 */

class Map extends Graph {

    /*
     * Constructeur de la classe Map
     * 
     * @params
     *   element: l'élément DOM canvas à utiliser pour le dessin
     * 
     * @notes
     *   Le context de dessin sera retrouvé grace à "element.getContext('2d')"
     * 
     */
    constructor(element) {
        // Appel du constructeur parent
        super(element);

        // Charge la carte
        this.backgroundLoaded = false;
        this.background = new Image();
        this.background.onload = function() {
            this.backgroundLoaded = true;
        }
        this.background.src = "images/worldmap.svg";

    }

    /*
     * Dessine la carte et les points en fonction des données entrées
     * 
     * @params
     *   data: les données à utiliser pour le dessin
     *         Un tableau à deux dimensions de taille [n][4], chaque sous-tableau doit comporter [longitude, latitude, taille, couleur]
     *           longitude: La longitude du point sur la carte (en degrés de -180 à 180)
     *           latitude:  La latitude du point sur la carte (en degrés de -90 à 90)
     *           taille:    La taille du point (en pixels)
     *           couleur:   La couleur du point au format CSS 
     */
    draw(data) {

        // Toujours vérifier les données avant l'appel à la méthode mère !
        if (typeof data === "undefined" || data === null) {
            return;
        }

        // Vérifie si le fond a été chargé
        if (!this.backgroundLoaded) {
            let mapThis = this;
            let mapData = data;
            this.background.onload = function() {
                mapThis.backgroundLoaded = true;
                mapThis.draw(mapData);
            };
        }

        // Appel de la méthode mère
        super.draw(data);

        // Dessine les données

        // Affichage de la carte en fond
        this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        //importants variables
        this.centerN = (this.height / 2);
        this.centerE = (this.width / 2);

        // Draw dots with coordinates
        for (var i = 0; i < data.length; i++) {
            this._drawCoordinates(data[i][0], data[i][1], data[i][2], data[i][3]);
        }
        
    }

    /*
     * Dessine un point sur la carte
     * 
     * @params
     *   x:     Coordonnée X
     *   y:     Coordonnée Y
     *   size:  La taille du point
     *   color: La couleur au format CSS
     */
    _drawCoordinates(x, y, size, color) {
        
        // calcul and change x to opposite value
        var resN = -x * (this.height / 180) + this.centerN;
        var resE = y * (this.width / 360) + this.centerE;

        // check if values are 0
        var resY = (x == 0 ? this.centerN : resN);
        var resX = (y == 0 ? this.centerE : resE);
        
        this.context.fillStyle = color;

        this.context.beginPath();
        this.context.arc(resX, resY, size, 0, 2*Math.PI);
        this.context.fill();
    }

 }
