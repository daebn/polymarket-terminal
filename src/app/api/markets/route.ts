import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag") || "sports";

    // 태그에 따라 다른 쿼리
    let apiUrl = `https://gamma-api.polymarket.com/events?active=true&closed=false&limit=20`;

    // "sports"는 스포츠 전체, 세부 태그는 해당 종목
    if (tag === "sports") {
      apiUrl += `&tag=sports`;
    } else {
      // nba, nfl 등은 제목 기반 필터링
      apiUrl += `&tag=sports`;
    }

    const response = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Polymarket API 호출 실패" },
        { status: response.status }
      );
    }

    let events = await response.json();

    // 세부 태그 필터링 (NBA, NFL 등)
    if (tag !== "sports") {
      const tagUpper = tag.toUpperCase();
      events = events.filter((event: any) =>
        event.title?.toUpperCase().includes(tagUpper) ||
        event.description?.toUpperCase().includes(tagUpper)
      );
    }

    const markets = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      liquidity: event.liquidity,
      volume: event.volume,
      markets: event.markets?.map((market: any) => ({
        id: market.id,
        question: market.question,
        outcomePrices: market.outcomePrices,
        outcomes: market.outcomes,
        volume: market.volume,
        active: market.active,
      })) || [],
    }));

    return NextResponse.json({ markets });
  } catch (error) {
    console.error("API 에러:", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다" },
      { status: 500 }
    );
  }
}