export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 상단 헤더 */}
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-green-400">⚡ PolyTrader</h1>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">LIVE</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>NBA</span>
          <span>NFL</span>
          <span>NHL</span>
          <span>Soccer</span>
        </div>
      </header>

      {/* 메인 그리드 — 4패널 */}
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 패널 1 */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">NBA</span>
            <span className="text-xs text-green-400">LIVE</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Lakers vs Celtics</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">62¢</p>
              <p className="text-xs text-gray-400">Lakers</p>
            </div>
            <div className="text-gray-600 text-sm">vs</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">38¢</p>
              <p className="text-xs text-gray-400">Celtics</p>
            </div>
          </div>
        </div>

        {/* 패널 2 */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">NFL</span>
            <span className="text-xs text-yellow-400">UPCOMING</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Chiefs vs Eagles</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">55¢</p>
              <p className="text-xs text-gray-400">Chiefs</p>
            </div>
            <div className="text-gray-600 text-sm">vs</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">45¢</p>
              <p className="text-xs text-gray-400">Eagles</p>
            </div>
          </div>
        </div>

        {/* 패널 3 */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">NHL</span>
            <span className="text-xs text-green-400">LIVE</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Rangers vs Bruins</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">48¢</p>
              <p className="text-xs text-gray-400">Rangers</p>
            </div>
            <div className="text-gray-600 text-sm">vs</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">52¢</p>
              <p className="text-xs text-gray-400">Bruins</p>
            </div>
          </div>
        </div>

        {/* 패널 4 */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Soccer</span>
            <span className="text-xs text-yellow-400">UPCOMING</span>
          </div>
          <h3 className="font-bold text-lg mb-2">Man City vs Real Madrid</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">41¢</p>
              <p className="text-xs text-gray-400">Man City</p>
            </div>
            <div className="text-gray-600 text-sm">vs</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">59¢</p>
              <p className="text-xs text-gray-400">Real Madrid</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}