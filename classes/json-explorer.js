/* TweetStats
 *
 * Fichier       ./front/classes/json-explorer.js
 * Description   Classe pour le dessin d'un explorateur de JSON, étend HtmlDisplay
 */

class JsonExplorer extends Display {

    /*
     * Constructeur de la classe JsonExplorer
     * 
     * @params
     *   element: l'élément DOM à utiliser comme parent ("div" de préférence)
     */
    constructor(element) {
        // Appel du constructeur parent
        super(element);
    }

    /*
     * Dessine l'explorateur de JSON en HTML
     * 
     * @params
     *   data: Un objet JSON à afficher
     */
    draw(data) {

        // Appel de la méthode mère
        super.draw(data);

        // Appel la méthode récursive qui va générer le code HTML d'affichage du JSON
        var html = this._draw(data);

        // Affiche l'objet
        this.element.innerHTML += "<div class=\"json-block\">" + html + "</div>";
        
    }

    /*
     * Méthode récursive de dessin d'un sous-élement JSON
     * 
     * @params
     *   o:   Un sous-objet JSON à afficher 
     *   key: La clé du sous objet depuis la racine du premier objet (ignorer au premier appel)
     * 
     * @return
     *   Le code HTML correspondant
     */
    _draw(o, key) {
        // La clé de l'objet courant
        if (typeof key == "undefined") {
            key = "json-" + Math.random() + ".";
        }
        // Contient le code HTML généré
        var result = "";
        // Choisi le rendu à utiliser en fonction du type de variable
        if (typeof o == "object" && o !== null) {
            // On doit vérifier si l'objet est un tableau,
            // car un tableau est de type "object"
            if (Array.isArray(o)) {
                // Si c'est un tableau
                result += "<div class=\"json-pointer-collapsed\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\" id=\"" + key + "-button\">[</div><div class=\"json-array\" id=\"" + key + "-content\">";
                // Parcours les valeurs du tableau
                for (var i = 0; i < o.length; i++) {
                    var newKey = key + '.' + i;
                    // Ajoute le contenu
                    result += "<div class=\"json-array-content\">" + this._draw(o[i], newKey) + (i < o.length-1 ? ", " : "") + "</div>";
                }
                // Ajoute la partie réduite
                result += "</div><span class=\"json-collapsed\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\" id=\"" + key + "-collapsed\"></span>";
                result += "<div class=\"json-pointer\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\">]</div>";
            } else {
                // Si c'est un objet
                result += "<div class=\"json-pointer-collapsed\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\" id=\"" + key + "-button\">{</div><div class=\"json-object\" id=\"" + key + "-content\">";
                // Nombre d'attributs
                var size = this._objectLength(o), i = 0;
                // Parcours des clés
                for (var k in o) {
                    i++;
                    var newKey = key + '.' + k;
                    // Ajoute le contenu
                    result += "<div class=\"json-object-content\">" + this._escapeHtml(k) + " : " + this._draw(o[k], newKey) + (i < size ? ", " : "") + "</div>";
                }
                // Ajoute la partie réduite
                result += "</div><span class=\"json-collapsed\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\" id=\"" + key + "-collapsed\"></span>";
                result += "<div class=\"json-pointer\" onclick=\"javascript:JsonExplorer._toogleObject('"+key+"');\">}</div>";
            }
        } else if (o === null) {
            // null est par défaut reconnu comme un objet, il faut donc le traiter à part
            result += "null";
        } else {
            // Si ce n'est pas un objet, alors c'est une valeur
            result += this._escapeHtml(o);
        }
        
        // Renvoie le code HTML
        return result;
    }

    /*
     * Prépare une chaîne de caractères à être affichée en HTML (et l'entoure de guillemets)
     * 
     * @params
     *   text: Le texte à préparer
     * 
     * @return
     *   Le texte préparé avec les caractères spéciaux HTML échappés
     */
    _escapeHtml(text) {
        if (typeof text != "string") {
            return text;
        }
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '\\&quot;',
            "'": '&#039;'
        };
        return '"' + text.replace(/[&<>"']/g, function(m) { return map[m]; }) + '"';
    }


    /*
     * Retourne le nombre d'attributs d'un objet
     * 
     * @params
     *   o: L'objet dont on souhaite connaitre le nombre d'attributs
     * 
     * @return
     *   Le nombre d'attributs dans "o"
     */
    _objectLength(o) {
        var i = 0;
        for (var k in o) i++;
        return i;
    }

}

/*
 * Affiche/masque un élément d'un JSON
 * 
 * @notes
 *   Ajouté comme une méthode statique pour être appellé sans instance
 * 
 * @params
 *   key: La clé de l'élément de l'objet
 */
JsonExplorer._toogleObject = function(key) {
    var e = document.getElementById(key + "-content");
    var eCollapsed = document.getElementById(key + "-collapsed");
    var eButton = document.getElementById(key + "-button");
    if (eCollapsed.style.display == "none") {
        e.style.display = "none";
        eCollapsed.style.display = "inline";
        eButton.className = "json-pointer-collapsed";
    } else {
        e.style.display = "block";
        eCollapsed.style.display = "none";
        eButton.className = "json-pointer-expended";
    }
}
