import { useEffect, useState } from 'react';

export default function Diagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    token: null,
    user: null,
    localStorage: {},
    axiosHeaders: {}
  });

  useEffect(() => {
    // Check localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('📋 Diagnostic Report:');
    console.log('Token in localStorage:', token ? `${token.substring(0, 30)}...` : 'NULL');
    console.log('User in localStorage:', user);
    
    setDiagnostics({
      token,
      user: user ? JSON.parse(user) : null,
      localStorage: {
        keys: Object.keys(localStorage),
        tokenExists: !!token,
        userExists: !!user,
        tokenLength: token?.length || 0
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">Diagnostic Report</h1>
        
        {/* Token Section */}
        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-2">🔐 Token Status</h2>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
            {diagnostics.token ? (
              <>
                <div className="text-green-600 font-bold">✅ Token Found</div>
                <div className="text-gray-600 mt-2">
                  Preview: {diagnostics.token.substring(0, 50)}...
                </div>
                <div className="text-gray-600">
                  Length: {diagnostics.localStorage.tokenLength} characters
                </div>
              </>
            ) : (
              <div className="text-red-600 font-bold">❌ No Token in localStorage</div>
            )}
          </div>
        </div>

        {/* User Section */}
        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-2">👤 User Data</h2>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm">
            {diagnostics.user ? (
              <div className="text-green-600">
                <div className="font-bold">✅ User Found:</div>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(diagnostics.user, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-red-600 font-bold">❌ No User in localStorage</div>
            )}
          </div>
        </div>

        {/* localStorage Keys */}
        <div className="border rounded p-4">
          <h2 className="font-bold text-lg mb-2">📦 localStorage Keys</h2>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm">
            <div>{JSON.stringify(diagnostics.localStorage.keys, null, 2)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="border rounded p-4 space-y-3">
          <h2 className="font-bold text-lg mb-2">⚙️ Actions</h2>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Clear Storage & Go to Login
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Refresh Page
          </button>
          <button
            onClick={() => {
              console.table(diagnostics);
              alert('Check console for full diagnostics');
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
          >
            Log to Console
          </button>
        </div>

        {/* Instructions */}
        <div className="border rounded p-4 bg-blue-50">
          <h2 className="font-bold text-lg mb-2">📋 Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>If token is NULL: You're not logged in. Click "Clear Storage & Go to Login"</li>
            <li>Log in with valid credentials</li>
            <li>Come back to this page after login</li>
            <li>Token should now appear above</li>
            <li>If still NULL after login, there's a server/backend issue</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
