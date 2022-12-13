import React, { useState, useEffect } from 'react';
import { server_calls } from '../../back-end/controllers/leaderboard_controller';

export const useGetData = () => {
    const [leaderboardData, setData] = useState<[]>([]);

    async function handleDataFetch(){
        console.log("WAITING ON DATA")
        const result = await server_calls.findAll();
        console.log("PULLED DATA")
        setData(result);
    }

    // do something after render; after 1st render and every update
    useEffect( () => {
        handleDataFetch();
    }, [])

    return {leaderboardData, getData:handleDataFetch}
}
