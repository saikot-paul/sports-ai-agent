import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const team = searchParams.get('team');
        const sport = searchParams.get('sport') || 'soccer';  // Default to 'soccer' if not specified
        const apiKey = process.env.ODD_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
        }

        // API query parameters
        const params = new URLSearchParams({
            apiKey: apiKey,
            regions: searchParams.get('regions') || 'us',  // Default to 'us'
            markets: searchParams.get('markets') || 'h2h,spreads',  // Default to 'h2h,spreads'
            dateFormat: searchParams.get('dateFormat') || 'iso',  // Default to 'iso'
            oddsFormat: searchParams.get('oddsFormat') || 'decimal',  // Default to 'decimal'
            commenceTimeFrom: searchParams.get('commenceTimeFrom') || '2023-09-09T00:00:00Z',  // Default start time
            commenceTimeTo: searchParams.get('commenceTimeTo') || '2023-09-09T00:00:00Z',  // Default end time
            includeLinks: searchParams.get('includeLinks') || 'true',  // Default to true
            includeSids: searchParams.get('includeSids') || 'true',  // Default to true
            includeBetLimits: searchParams.get('includeBetLimits') || 'true'  // Default to true
        });

        const eventIds = searchParams.get('eventIds');
        const bookmakers = searchParams.get('bookmakers');

        if (eventIds) {
            params.append('eventIds', eventIds);
        }

        if (bookmakers) {
            params.append('bookmakers', bookmakers);
        }

        // Construct API URL with the dynamic sport path
        const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds?${params.toString()}`;

        // Fetch data from API
        const response = await fetch(oddsApiUrl);

        if (!response.ok) {
            throw new Error(`Odds API responded with status: ${response.status}`);
        }

        let data = await response.json();

        // If a team parameter is provided, filter the results
        if (team) {
            data = data.filter((game: any) =>
                game.home_team.toLowerCase().includes(team.toLowerCase()) ||
                game.away_team.toLowerCase().includes(team.toLowerCase())
            );
        }

        const transformedData = data.map((game: any) => ({
            id: game.id,
            sport_key: game.sport_key,
            sport_title: game.sport_title,
            commence_time: game.commence_time,
            home_team: game.home_team,
            away_team: game.away_team,
            bookmakers: game.bookmakers.map((bookmaker: any) => ({
                key: bookmaker.key,
                title: bookmaker.title,
                last_update: bookmaker.last_update,
                link: bookmaker.link,
                sid: bookmaker.sid,
                markets: bookmaker.markets.map((market: any) => ({
                    key: market.key,
                    last_update: market.last_update,
                    outcomes: market.outcomes.map((outcome: any) => ({
                        name: outcome.name,
                        price: outcome.price,
                        link: outcome.link,
                        sid: outcome.sid,
                        bet_limit: outcome.bet_limit
                    }))
                }))
            }))
        }));

        return NextResponse.json({ data: transformedData });

    } catch (error) {
        console.error('Error fetching odds data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch odds data' },
            { status: 500 }
        );
    }
}
