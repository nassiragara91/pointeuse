import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const ZKTecoPage = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [unprocessedLogs, setUnprocessedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('config');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer la configuration
      const configRes = await fetch('http://localhost:4000/api/zkteco/config');
      const configData = await configRes.json();
      setConfig(configData);

      // Récupérer les logs
      const logsRes = await fetch('http://localhost:4000/api/zkteco/logs?limit=20');
      const logsData = await logsRes.json();
      setLogs(logsData.logs || []);

      // Récupérer les logs non traités
      const unprocessedRes = await fetch('http://localhost:4000/api/zkteco/logs/unprocessed');
      const unprocessedData = await unprocessedRes.json();
      setUnprocessedLogs(unprocessedData);

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const processLog = async (logId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/zkteco/logs/${logId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Rafraîchir les données
        fetchData();
      }
    } catch (error) {
      console.error('Erreur lors du traitement du log:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const getStatusBadge = (processed) => {
    return processed ? 
      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Traité</span> :
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">En attente</span>;
  };

  const getTypeBadge = (type) => {
    return type === 'IN' ?
      <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Entrée</span> :
      <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">Sortie</span>;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
  
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">

        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configuration ZKTeco SpeedFace V4L</h1>
            <p className="mt-2 text-gray-600">Gérez votre pointeuse biométrique et consultez les logs de pointage</p>
          </div>

          {/* Onglets */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('config')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Logs ({logs.length})
              </button>
              <button
                onClick={() => setActiveTab('unprocessed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'unprocessed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                En attente ({unprocessedLogs.length})
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'config' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration de la pointeuse</h2>
              
              {config && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL du serveur</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        <code className="text-sm text-gray-900">{config.serverUrl}</code>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Configurez cette URL dans votre pointeuse ZKTeco
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Intervalle de push</label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md">
                        <span className="text-sm text-gray-900">{config.pushInterval} secondes</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informations de l'appareil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                          <span className="text-sm text-gray-900">{config.deviceInfo.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                          <span className="text-sm text-gray-900">{config.deviceInfo.type}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Version</label>
                        <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                          <span className="text-sm text-gray-900">{config.deviceInfo.version}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Instructions de configuration</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
                        <li>Accédez à l'interface web de votre pointeuse ZKTeco SpeedFace V4L</li>
                        <li>Allez dans les paramètres de communication</li>
                        <li>Configurez l'URL du serveur : <code className="bg-blue-100 px-1 rounded">{config.serverUrl}</code></li>
                        <li>Activez le push HTTP</li>
                        <li>Définissez l'intervalle de push à {config.pushInterval} secondes</li>
                        <li>Sauvegardez la configuration</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Logs de pointage</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horodatage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appareil
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                          <div className="text-sm text-gray-500">ID: {log.userId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(log.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.deviceName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{log.deviceIP || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(log.processed)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'unprocessed' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Logs en attente de traitement</h2>
              </div>
              
              {unprocessedLogs.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">Aucun log en attente de traitement</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employé
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horodatage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unprocessedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                            <div className="text-sm text-gray-500">ID: {log.userId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTypeBadge(log.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => processLog(log.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Traiter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ZKTecoPage; 