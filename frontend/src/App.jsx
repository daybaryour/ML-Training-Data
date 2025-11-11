import { useState, useEffect } from 'react';

function App() {
  // Navigation state
  const [activeView, setActiveView] = useState('predict');
  
  // Prediction form state
  const [sqft, setSqft] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data state
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data based on active view
  useEffect(() => {
    if (activeView === 'history') {
      fetchHistory(currentPage);
    } else if (activeView === 'stats') {
      fetchStats();
    } else if (activeView === 'model') {
      fetchModelInfo();
    }
  }, [activeView, currentPage]);

  const fetchHistory = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:3001/api/predictions?page=${page}&limit=10`);
      const result = await response.json();
      const data = result.data || result;
      const pagination = result.pagination;
      
      setHistory(data);
      if (pagination) {
        setTotalPages(pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/predictions/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/model/info');
      const data = await response.json();
      setModelInfo(data);
    } catch (err) {
      console.error('Error fetching model info:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    
    if (!sqft || !bedrooms) {
      setError('Please fill in all fields');
      return;
    }

    if (Number(sqft) <= 0 || Number(bedrooms) <= 0) {
      setError('Values must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sqft: Number(sqft),
          bedrooms: Number(bedrooms),
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all prediction history?')) {
      return;
    }

    try {
      await fetch('http://localhost:3001/api/predictions', {
        method: 'DELETE',
      });
      fetchHistory(1);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const navItems = [
    { id: 'predict', label: 'Predict', icon: '🏠' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'model', label: 'Model Info', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏠 Housing Price Predictor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ML-powered price predictions
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-1 border-t border-gray-200 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                  activeView === item.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Predict View */}
        {activeView === 'predict' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get Price Prediction
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 mb-2">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    id="sqft"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Enter square footage (e.g., 1500)"
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Enter number of bedrooms (e.g., 3)"
                    min="1"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Predicting...' : 'Predict Price'}
                </button>
              </form>

              {prediction && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Predicted Price
                  </h3>
                  <p className="text-4xl font-bold text-green-600">
                    {formatPrice(prediction.prediction)}
                  </p>
                  
                  {prediction.confidenceInterval && (
                    <div className="mt-3 p-3 bg-white rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Confidence Interval (±10%)
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(prediction.confidenceInterval.lower)} - {formatPrice(prediction.confidenceInterval.upper)}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Square Footage: {prediction.sqft.toLocaleString()} sq ft</p>
                    <p>Bedrooms: {prediction.bedrooms}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Prediction History
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No predictions yet</p>
                <p className="text-gray-400 text-sm mt-2">Make your first prediction to see it here</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xl font-semibold text-indigo-600">
                            {formatPrice(item.prediction)}
                          </p>
                          {item.confidenceInterval && (
                            <p className="text-xs text-gray-500 mt-1">
                              Range: {formatPrice(item.confidenceInterval.lower)} - {formatPrice(item.confidenceInterval.upper)}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>📏 {item.sqft.toLocaleString()} sq ft</span>
                            <span>🛏️ {item.bedrooms} bedrooms</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Statistics View */}
        {activeView === 'stats' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prediction Statistics
            </h2>
            
            {stats && stats.count > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Total Predictions</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.count}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Average Price</p>
                  <p className="text-3xl font-bold text-green-900">{formatPrice(stats.averagePrice)}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">Price Range</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatPrice(stats.minPrice)} - {formatPrice(stats.maxPrice)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">Avg Square Footage</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.averageSqft.toLocaleString()} sq ft</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg">
                  <p className="text-sm font-medium text-pink-800 mb-2">Avg Bedrooms</p>
                  <p className="text-3xl font-bold text-pink-900">{stats.averageBedrooms}</p>
                </div>

                {stats.lastPrediction && (
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                    <p className="text-sm font-medium text-indigo-800 mb-2">Latest Prediction</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {formatPrice(stats.lastPrediction.prediction)}
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      {formatDate(stats.lastPrediction.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No statistics available yet</p>
                <p className="text-gray-400 text-sm mt-2">Make predictions to see statistics</p>
              </div>
            )}
          </div>
        )}

        {/* Model Info View */}
        {activeView === 'model' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Model Information
            </h2>
            
            {modelInfo && modelInfo.trained ? (
              <div className="space-y-6">
                {/* Model Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <div>
                      <p className="font-semibold text-green-900">Model Status: Trained</p>
                      <p className="text-sm text-green-700">Ready for predictions</p>
                    </div>
                  </div>
                </div>

                {/* Model Equation */}
                {modelInfo.equation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">Regression Equation</p>
                    <code className="text-sm text-blue-900 font-mono">
                      {modelInfo.equation}
                    </code>
                  </div>
                )}

                {/* Coefficients */}
                {modelInfo.coefficients && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Coefficients</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Intercept (β₀)</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {modelInfo.intercept.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Square Footage (β₁)</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {modelInfo.coefficients.sqft.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Bedrooms (β₂)</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {modelInfo.coefficients.bedrooms.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                {modelInfo.metrics && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <p className="text-sm font-medium text-purple-800 mb-1">R² Score</p>
                        <p className="text-3xl font-bold text-purple-900">
                          {modelInfo.metrics.rSquared}
                        </p>
                        <p className="text-xs text-purple-700 mt-1">Coefficient of determination</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <p className="text-sm font-medium text-orange-800 mb-1">MAE</p>
                        <p className="text-3xl font-bold text-orange-900">
                          {formatPrice(parseFloat(modelInfo.metrics.mae))}
                        </p>
                        <p className="text-xs text-orange-700 mt-1">Mean Absolute Error</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">RMSE</p>
                        <p className="text-3xl font-bold text-red-900">
                          {formatPrice(parseFloat(modelInfo.metrics.rmse))}
                        </p>
                        <p className="text-xs text-red-700 mt-1">Root Mean Squared Error</p>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                        <p className="text-sm font-medium text-teal-800 mb-1">Training Data</p>
                        <p className="text-3xl font-bold text-teal-900">
                          {modelInfo.metrics.trainingDataSize}
                        </p>
                        <p className="text-xs text-teal-700 mt-1">Sample size</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Algorithm Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Algorithm Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Algorithm:</strong> Multiple Linear Regression</p>
                    <p><strong>Method:</strong> Ordinary Least Squares (OLS)</p>
                    <p><strong>Features:</strong> Square Footage, Number of Bedrooms</p>
                    <p><strong>Target:</strong> House Price (USD)</p>
                    <p><strong>Library:</strong> mathjs for matrix operations</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Model not trained yet</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by Machine Learning 🤖 | Built with TypeScript, React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;