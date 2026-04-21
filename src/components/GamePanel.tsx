"use client";

import { useState, useEffect, useRef } from "react";
import { MarketEvent } from "@/lib/types";

interface GamePanelProps {
  event: MarketEvent;
}

export default function GamePanel({ event }: GamePanelProps) {
  // 이전 가격을 저장해서 변동을 보여줌
  const prevPricesRef = useRef<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});

  const parsePrices = (pricesStr: string): number[] => {
    try {
      return JSON.parse(pricesStr).map((p: string) => parseFloat(p));
    } catch {
      return [];
    }
  };

  const parseOutcomes = (outcomesStr: string): string[] => {
    try {
      return JSON.parse(outcomesStr);
    } catch {
      return [];
    }
  };

  const formatPrice = (price: number): string => {
    return `${Math.round(price * 100)}¢`;
  };

  const formatVolume = (vol: string): string => {
    const num = parseFloat(vol || "0");
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const mainMarket = event.markets[0];

  // 가격 변동 추적
  useEffect(() => {
    if (!mainMarket) return;

    const prices = parsePrices(mainMarket.outcomePrices || "[]");
    const outcomes = parseOutcomes(mainMarket.outcomes || "[]");
    const newChanges: Record<string, number> = {};

    outcomes.forEach((outcome, idx) => {
      const currentPrice = prices[idx] || 0;
      const key = `${event.id}-${idx}`;
      const prevPrice = prevPricesRef.current[key];

      if (prevPrice !== undefined) {
        newChanges[key] = currentPrice - prevPrice;
      }

      prevPricesRef.current[key] = currentPrice;
    });

    setChanges(newChanges);
  }, [mainMarket, event.id]);

  if (!mainMarket) return null;

  const prices = parsePrices(mainMarket.outcomePrices || "[]");
  const outcomes = parseOutcomes(mainMarket.outcomes || "[]");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      {/* 상단 */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-green-400 font-medium">● LIVE</span>
        <span className="text-xs text-gray-600">
          Vol {formatVolume(event.volume || "0")}
        </span>
      </div>

      {/* 이벤트 제목 */}
      <h3 className="font-bold text-sm mb-3 text-gray-200 truncate">
        {event.title}
      </h3>

      {/* 오즈 */}
      <div className="space-y-2">
        {outcomes.map((outcome, idx) => {
          const price = prices[idx] || 0;
          const pct = Math.round(price * 100);
          const isHigher = price > 0.5;
          const key = `${event.id}-${idx}`;
          const change = changes[key] || 0;

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-gray-800/50"
            >
              <span className="text-sm text-gray-300 truncate flex-1 min-w-0">
                {outcome}
              </span>

              <div className="flex items-center gap-2">
                {/* 변동 표시 */}
                {change !== 0 && (
                  <span
                    className={`text-xs font-medium ${
                      change > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {change > 0 ? "▲" : "▼"}
                    {Math.abs(Math.round(change * 100))}¢
                  </span>
                )}

                {/* 프로그레스 바 */}
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigher ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* 가격 */}
                <span
                  className={`text-sm font-bold w-12 text-right ${
                    isHigher ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatPrice(price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 */}
      <p className="text-xs text-gray-600 mt-3 truncate">
        {mainMarket.question}
      </p>
    </div>
  );
}