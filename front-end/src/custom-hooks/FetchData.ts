import React, { useState, useEffect } from 'react';
// import { server_calls } from '../../../back-end/controllers/leaderboard_controller';
import LeaderboardDataService from '../services/leaderboard.service';

export const useGetData = () => {
    const [leaderboardData, setData] = useState<any[]>([]);

    async function handleDataFetch(){
        console.log("Waiting on data...")
        const result = await LeaderboardDataService.getAll();
        console.log("Pulled data successfully!")
        setData(result.data);
    }

    // do something after render; after 1st render and every update
    useEffect( () => {
        handleDataFetch();
    }, [])

    return {leaderboardData, getData:handleDataFetch}
}
