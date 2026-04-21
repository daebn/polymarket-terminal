"use client";

import { useState, useEffect } from "react";
import GamePanel from "@/components/GamePanel";
import { MarketEvent } from "@/lib/types";

export default function Home() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState("sports");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const tags = [
    { key: "sports", label: "All Sports" },
    { key: "nba", label: "NBA" },
    { key: "nfl", label: "NFL" },
    { key: "soccer", label: "Soccer" },
    { key: "nhl", label: "NHL" }
  ];

useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/markets?tag=${activeTag}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "데이터를 가져올 수 없습니다");
          return;
        }

        setEvents(data.markets || []);
        setLastUpdated(new Date());
        setError("");
      } catch {
        setError("서버에 연결할 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();

    // 30초마다 자동 갱신
    const interval = setInterval(() => {
      fetchMarkets();
    }, 30000);

    // 컴포넌트가 사라지면 타이머 정리
    return () => clearInterval(interval);
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 상단 헤더 */}
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-green-400">⚡ PolyTrader</h1>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{events.length}개 마켓</span>
          {lastUpdated && (
            <span className="text-xs">
              갱신: {lastUpdated.toLocaleTimeString("ko-KR")}
            </span>
          )}
        </div>
      </header>

      {/* 카테고리 탭 */}
      <nav className="border-b border-gray-800 px-6 py-2 flex gap-1 overflow-x-auto">
        {tags.map(tag => (
          <button
            key={tag.key}
            onClick={() => setActiveTag(tag.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
              activeTag === tag.key
                ? "bg-green-500 text-white"
                : "bg-gray-400 hover:bg-gray-800"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </nav>

      {/* 에러 */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 마켓 그리드 */}
      <main className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">마켓 로딩 중...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            현재 활성 마켓이 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {events.map((event) => (
              <GamePanel key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}