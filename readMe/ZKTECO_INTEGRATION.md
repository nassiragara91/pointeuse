# Intégration ZKTeco SpeedFace V4L

Ce document explique comment intégrer la pointeuse ZKTeco SpeedFace V4L avec votre application de pointage de présence.

## Vue d'ensemble

L'intégration utilise le **push HTTP** pour recevoir automatiquement les données de pointage de la pointeuse ZKTeco SpeedFace V4L. Cette méthode est plus fiable et moderne que les connexions TCP/IP directes.

## Fonctionnalités

- ✅ Réception automatique des données de pointage
- ✅ Reconnaissance faciale et biométrie
- ✅ Traitement automatique des entrées/sorties
- ✅ Interface de gestion des logs
- ✅ Correspondance automatique avec les employés
- ✅ Calcul automatique des heures travaillées

## Configuration de la pointeuse

### 1. Accès à l'interface web

1. Connectez-vous à votre réseau local
2. Trouvez l'adresse IP de votre pointeuse ZKTeco SpeedFace V4L
3. Ouvrez un navigateur et accédez à `http://[IP_DE_LA_POINTEUSE]`
4. Connectez-vous avec les identifiants administrateur

### 2. Configuration du push HTTP

1. Allez dans **Paramètres** > **Communication**
2. Activez **Push HTTP**
3. Configurez les paramètres suivants :
   - **URL du serveur** : `http://[VOTRE_SERVEUR]:4000/api/zkteco/receive`
   - **Intervalle de push** : 30 secondes
   - **Format des données** : JSON
   - **Méthode** : POST

### 3. Configuration des utilisateurs

1. Allez dans **Gestion des utilisateurs**
2. Ajoutez les employés avec leurs noms exacts
3. Enregistrez leurs visages ou empreintes digitales
4. Assurez-vous que les noms correspondent à ceux de votre base de données

## Structure des données

La pointeuse envoie les données au format JSON avec la structure suivante :

```json
{
  "userId": "001",
  "userName": "Jean Dupont",
  "timestamp": "2024-01-15T08:30:00.000Z",
  "type": "IN",
  "fingerId": 1,
  "faceId": 1,
  "deviceId": "ZKTECO001",
  "deviceName": "SpeedFace V4L - Entrée",
  "deviceIP": "192.168.1.100",
  "rawData": {
    "temperature": 36.5,
    "mask": false,
    "confidence": 0.95
  }
}
```

### Champs obligatoires

- `userId` : Identifiant unique de l'utilisateur sur la pointeuse
- `userName` : Nom de l'utilisateur (doit correspondre à la base de données)
- `timestamp` : Horodatage du pointage (ISO 8601)
- `type` : Type de pointage ("IN" pour entrée, "OUT" pour sortie)
- `deviceId` : Identifiant unique de la pointeuse

### Champs optionnels

- `fingerId` : ID du doigt utilisé (pour reconnaissance d'empreinte)
- `faceId` : ID du visage (pour reconnaissance faciale)
- `deviceName` : Nom de la pointeuse
- `deviceIP` : Adresse IP de la pointeuse
- `rawData` : Données brutes supplémentaires

## API Endpoints

### Réception des données
```
POST /api/zkteco/receive
```
Endpoint public pour recevoir les données de la pointeuse.

### Configuration
```
GET /api/zkteco/config
```
Récupère la configuration pour la pointeuse.

### Logs
```
GET /api/zkteco/logs
GET /api/zkteco/logs/unprocessed
POST /api/zkteco/logs/:id/process
```
Gestion des logs de pointage (nécessite authentification).

## Interface utilisateur

### Page de configuration
- URL : `/zkteco`
- Fonctionnalités :
  - Affichage de la configuration de la pointeuse
  - Instructions de configuration
  - Informations sur l'appareil

### Gestion des logs
- Consultation des logs de pointage
- Traitement manuel des logs en attente
- Filtrage par statut

## Tests

### Script de test
Utilisez le script `test-zkteco.js` pour tester l'intégration :

```bash
cd backend
node test-zkteco.js
```

Ce script simule l'envoi de données de pointage et vérifie le bon fonctionnement de l'API.

### Données de test
Le script envoie des données de test pour :
- Pointage d'entrée (Jean Dupont)
- Pointage d'entrée (Marie Martin)
- Pointage de sortie (Jean Dupont, 8h plus tard)

## Dépannage

### Problèmes courants

1. **Données non reçues**
   - Vérifiez la connectivité réseau
   - Vérifiez l'URL du serveur dans la pointeuse
   - Vérifiez que le serveur est accessible depuis la pointeuse

2. **Employés non trouvés**
   - Vérifiez que les noms correspondent exactement
   - Créez les employés manuellement si nécessaire
   - Vérifiez la casse des noms

3. **Erreurs de traitement**
   - Consultez les logs du serveur
   - Vérifiez la structure des données envoyées
   - Vérifiez la base de données

### Logs de débogage

Activez les logs détaillés dans le contrôleur `zkteco.controller.js` pour diagnostiquer les problèmes.

## Sécurité

### Recommandations

1. **Réseau sécurisé** : Placez la pointeuse sur un réseau sécurisé
2. **Firewall** : Configurez le firewall pour limiter l'accès
3. **HTTPS** : Utilisez HTTPS en production
4. **Authentification** : Ajoutez une authentification si nécessaire

### Validation des données

Le système valide automatiquement :
- Présence des champs obligatoires
- Format des horodatages
- Types de pointage valides
- Correspondance avec les employés

## Maintenance

### Sauvegarde
- Sauvegardez régulièrement la base de données
- Exportez les logs importants
- Documentez les modifications de configuration

### Mise à jour
- Surveillez les mises à jour de la pointeuse
- Testez les nouvelles fonctionnalités
- Maintenez la compatibilité

## Support

Pour toute question ou problème :
1. Consultez ce document
2. Vérifiez les logs du serveur
3. Testez avec le script de test
4. Contactez le support technique

---

**Version** : 1.0  
**Date** : 2024-01-15  
**Compatible avec** : ZKTeco SpeedFace V4L 