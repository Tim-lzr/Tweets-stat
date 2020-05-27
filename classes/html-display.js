/* TweetStats
 *
 * Fichier       ./front/classes/display.js
 * Description   Classe principale pour la représentation de données en HTML, doit être étendue par des classes filles
 */

class Display {

    /*
     * Constructeur de la classe Graph
     * 
     * @params
     *   element: l'élément DOM à utiliser comme parent ("div" de préférence) 
     */
    constructor(element) {
        this.element = element;
    }

    /*
     * Dessine la représentation en fonction des données entrées
     * 
     * @params
     *   data: les données à utiliser pour la représentation (le type dépend de la classe qui impélentera cette méthode)
     */
    draw(data) {
        // À implémenter dans les classes filles
    }

}
