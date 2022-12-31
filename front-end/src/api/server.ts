import { Buffer } from 'buffer';
import { clientId, clientSecret } from './auth_info';

let playSong: any;
let trackInfo: any;
let playlistInfo: any;

const getToken = async () => {
    const result = await fetch(`https://accounts.spotify.com/api/token`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
            // (new Buffer(clientIdSecret, "base64"))
            // 'Access-Control-Allow-Origin': 'no-cors'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token
}

export const clickedEvent = async (trackNum: number) => {
    let token = await getToken();

    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${token}`]
    ]);
    // https://api.spotify.com/v1/search?q=moon-river&type=track&limit=15
    let request = new Request(`https://api.spotify.com/v1/playlists/2JN32MKyf1fbkgMoBREQsJ`,{
        method: 'GET',
        headers: headers
    });

    let result = await fetch(request);

    let response = await result.json();
    playlistInfo = response;
    console.log("Track Number:", trackNum);

    trackInfo = response.tracks.items[trackNum].track

    // console.log(trackInfo.name, trackInfo.artists[0].name)
    let song = trackInfo.preview_url;

    
    // Before we play a song, first check if playoSng is True, and if so, stop it
    if (playSong){
        stopSnippet();
    }
    
    songSnippet(song);
    
}

export const getPlaylistInfo = () => {
    return playlistInfo;
}

const songSnippet = (url: string) => {
    playSong = new Audio(url);
    return playSong.play()
}

export const getSongInfo = () => {
    return trackInfo;
}

export function getSong(trackNum: number){
    clickedEvent(trackNum);
}

export const stopSnippet = () => {
    return playSong.pause();
}

export const playSnippet = (currentTrack: number) => {
    clickedEvent(currentTrack);
}
