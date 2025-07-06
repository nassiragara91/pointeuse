// Script de test pour simuler les données de la pointeuse ZKTeco SpeedFace V4L
import fetch from 'node-fetch';

const SERVER_URL = 'http://localhost:4000/api/zkteco/receive';

// Données de test pour simuler différents scénarios de pointage
const testData = [
  {
    userId: '001',
    userName: 'Jean Dupont',
    timestamp: new Date().toISOString(),
    type: 'IN',
    fingerId: 1,
    faceId: 1,
    deviceId: 'ZKTECO001',
    deviceName: 'SpeedFace V4L - Entrée',
    deviceIP: '192.168.1.100',
    rawData: {
      temperature: 36.5,
      mask: false,
      confidence: 0.95
    }
  },
  {
    userId: '002',
    userName: 'Marie Martin',
    timestamp: new Date().toISOString(),
    type: 'IN',
    fingerId: null,
    faceId: 2,
    deviceId: 'ZKTECO001',
    deviceName: 'SpeedFace V4L - Entrée',
    deviceIP: '192.168.1.100',
    rawData: {
      temperature: 36.8,
      mask: true,
      confidence: 0.92
    }
  },
  {
    userId: '001',
    userName: 'Jean Dupont',
    timestamp: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 heures plus tard
    type: 'OUT',
    fingerId: 1,
    faceId: 1,
    deviceId: 'ZKTECO001',
    deviceName: 'SpeedFace V4L - Sortie',
    deviceIP: '192.168.1.100',
    rawData: {
      temperature: 36.6,
      mask: false,
      confidence: 0.94
    }
  }
];

// Fonction pour envoyer une donnée de test
async function sendTestData(data) {
  try {
    console.log(`Envoi de données de test pour ${data.userName} (${data.type})...`);
    
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Succès: ${result.message}`);
      console.log(`   Log ID: ${result.logId}`);
    } else {
      console.log(`❌ Erreur: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Erreur de connexion: ${error.message}`);
    return null;
  }
}

// Fonction pour tester la configuration
async function testConfig() {
  try {
    console.log('🔧 Test de la configuration...');
    
    const response = await fetch('http://localhost:4000/api/zkteco/config');
    const config = await response.json();
    
    console.log('✅ Configuration récupérée:');
    console.log(`   URL du serveur: ${config.serverUrl}`);
    console.log(`   Intervalle de push: ${config.pushInterval}s`);
    console.log(`   Appareil: ${config.deviceInfo.name} (${config.deviceInfo.type})`);
    
    return config;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de la configuration: ${error.message}`);
    return null;
  }
}

// Fonction pour tester les logs
async function testLogs() {
  try {
    console.log('📊 Test de récupération des logs...');
    
    const response = await fetch('http://localhost:4000/api/zkteco/logs?limit=5');
    const logs = await response.json();
    
    console.log(`✅ ${logs.logs.length} logs récupérés`);
    logs.logs.forEach(log => {
      console.log(`   - ${log.userName} (${log.type}) à ${new Date(log.timestamp).toLocaleString()}`);
    });
    
    return logs;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des logs: ${error.message}`);
    return null;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests ZKTeco SpeedFace V4L\n');
  
  // Test 1: Configuration
  await testConfig();
  console.log('');
  
  // Test 2: Envoi des données de test
  console.log('📤 Envoi des données de test...\n');
  for (const data of testData) {
    await sendTestData(data);
    console.log('');
    // Attendre 2 secondes entre chaque envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Test 3: Vérification des logs
  console.log('⏳ Attente de 3 secondes pour le traitement...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await testLogs();
  
  console.log('\n✅ Tests terminés !');
}

// Exécuter les tests si le script est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { sendTestData, testConfig, testLogs, runTests }; 