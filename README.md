# Affichage DIVIA -- Horaires Tram en Temps Réel

Ce projet affiche en temps réel les horaires du tram Divia pour l'arret Grésille Trimolet dans les deux
sens :

Direction Gare

Direction Quetigny 


Il a été conçu dans un but purement personnel et éducatif. J'ai pu découvrir le fonctionnement de l'API Divia / GTFS Realtime,
afin de l'expérimenter avec Node.js.

A l'avenir, j'aimerai l'améliorer afin de pouvoir choisir l'arrêt.

## Fonctionnalités 

  -> Récupération des horaires en temps réel via l'API Divia - format GTFS Realtime
  
  -> Extraction de l'information et affichage des destinations, lignes et minutes restantes

## Installation 

  Installer Node.js : ```npm install```
  
  Installer les modules nécessaires pour le serveur : 
  
  ```npm install express```
  
  ```npm install gtfs-realtime-bindings```
  
  ```npm install cors```
  
  ```npm install fs```
  
  ```npm install path```


  Lancer le serveur : ```node server.js```
  
  Puis lire le frontend avec l'extension "Live" de VS code


  ## Notes Pratiques

  Ce projet n'est pas affilié à Divia, elle est non-offciel
  
  Usage strictement personnel pour l'apprentissage et la découverte des données publique
  
  Les données sont fournies par ```https://transport.data.gouv.fr/resources/80742```
  
  
