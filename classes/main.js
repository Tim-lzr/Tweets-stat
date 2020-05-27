/* TweetStats
 *
 * Fichier       ./front/classes/main.js
 * Description   Fichier JavaScript principal, contient les outils de chargement des sessions précédentes ainsi que ce de gestion de la session actuelle
 */

// Contiendra la liste des recherches effectuées
// Associe l'identifiant de la requête à son contenu et son objet "Search" correspondant
var searchList = {};

/*
 * Charge les requêtes depuis les cookies 
 * 
 * @params
 * 
 * @notes
 *   Crée les objets "Search", le rendu HTML et rempli "searchList"
 */
function loadSearchs() {

    // Récupère le parent de la liste de recherche
    var parent = document.getElementById("results-feed");
    // Récupère la liste des recherches
    var list = util.getCookie("tweetstats_list");

    // Vérifie si le cookie de liste existe
    var isThereSearchs = false;
    if(list !== undefined) {
        list = list.split("-");
        // Récupère les recherches
        for (var i = 0; i < list.length; i++) {
            var search = util.getCookie("tweetstats_search_" + list[i]);
            if (search !== undefined) {
                searchList[list[i]] = new Search(search, parent);
                isThereSearchs = true;
            }
        }
    }

    // Si il n'y a pas de requêtes, on affiche un message
    if (!isThereSearchs) {
        document.getElementById("results-feed").innerHTML = "Vous n'avez pas de recherches pour le moment \uD83D\uDE41";
    }

}

/*
 * Vérifie si une recherche existe déjà
 * 
 * @params
 *   search: La chaîne de caractères de la requête
 * 
 * @return 
 *   true:  si la requête existe
 *   false: si la requête n'existe pas
 */
function searchExists(search) {
    for (var i in searchList) {
        if (searchList[i].string === search) {
            return true;
        }
    }
    return false;
}
