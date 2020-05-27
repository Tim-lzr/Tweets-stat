/* TweetStats
 *
 * Fichier       ./front/classes/histogram.js
 * Description   Classe pour le dessin d'un histogramme, étend Graph
 */

 class Histogram extends Graph {

    /*
     * Constructeur de la classe Histogram
     * 
     * @params
     *   element: l'élément DOM canvas à utiliser pour le dessin
     * 
     * 
     */
    constructor(element) {
        // Appel du constructeur parent
        super(element);
        // Configuration par défaut
        this.margins = 40; // Marges internes dans le tableau
        this.space = 5; // Taille entre les rectangles
    }

    /*
     * Dessine le graphique en fonction des données entrées
     * 
     * @params
     *   data: les données à utiliser pour le dessin
     *         Un tableau à deux dimensions de taille [n][3], chaque sous-tableau doit comporter [légende, valeur, couleur]
     *         La hauteur de l'histogramme dépend de la plus grande valeur donnée
     *         Un sous-tableau ayant comme légende "%phantom%" ne sera pas dessiné (mais son emplacement sera mis vide et sa hauteur prise en compte)
     *         Un sous-tableau de taille 2 utilisera la couleur par défaut pour le dessin
     */ 
    draw(data) {

        // vérifier les données avant l'appel à la méthode mère !
        if (typeof data === "undefined" || data === null) {
            return;
        }

        // Appel de la méthode mère
        super.draw(data);

        // Calcul des échelles
        var columnWidth = ((this.width-2*this.margins) / data.length) - this.space; // Largeur d'un rectangle
        var min = 0; // Valeur minimale de l'histogramme
        var max = 0; // Valeur maximale
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > max) {
                max = data[i][1];
            }
            if (data[i][1] < min) {
                min = data[i][1];
            }
        }
        var scale = (max-min) / (this.height-2*this.margins); // Ratio taille réelle/taille de dessin

        // Dessine l'histogramme
        for (var i = 0; i < data.length; i++) {

            if (data[i][0] !== "%phantom%") {
                    
                // Calcul de l'emplacement
                var x = this.margins + i*(columnWidth+this.space);
                var y = this.margins + (max-data[i][1])/scale;
                var height = data[i][1]/scale;
                

                // Choix de la couleur
                if (data[i].length >= 3) {
                    this.context.fillStyle = data[i][2];
                }

                // Dessin
                this.context.fillRect(x, y, columnWidth, height);

                // Redéfinition de la couleur par défaut
                this.context.fillStyle = this.fgColor;

                // Dessin de la légende
                if (data[i][1] >= 0) {
                    var legendY = y + height + 20;
                } else {
                    var legendY = y + height - 20;
                }
                this.context.textAlign = "center";
                this.context.font = "15px Arial";
                this.context.save();
                this.context.translate(x+(columnWidth/2), legendY);
                this.context.rotate(-Math.PI/2);
                this.context.fillText(data[i][0], 0, 0);
                this.context.restore();

            }

        }

        // L'axe des abcisses
        var absY = this.margins + max/scale;
        this._line(this.margins, absY, this.width-this.margins, absY);
        
    }

    /*
     * Dessine une ligne du point (x0,y0) au point (x1,y1)
     * 
     * @params
     *   x0: Coordonnée X du début de la ligne
     *   y0: Coordonnée Y du début de la ligne
     *   x1: Coordonnée X de la fin de la ligne
     *   y1: Coordonnée Y de la fin de la ligne
     */
    _line(x0, y0, x1, y1) {
        this.context.beginPath();
        this.context.moveTo(x0, y0);
        this.context.lineTo(x1, y1);
        this.context.stroke();
    }

 }
