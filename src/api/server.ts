import { Buffer } from 'buffer';

let playSong: any;
let trackInfo: any;
let playlistInfo: any;

const clientId = '4888a7311f4f49f8a30a704f200e4e0c';
const clientSecret = '2f176e0bd71847bb8919696a393764f4';
const clientIdSecret = clientId + ':' + clientSecret;
// console.log(clientIdSecret)
const buffer = Buffer.from(clientIdSecret);
// console.log("BUFFER: ", buffer)

const getToken = async () => {
    const result = await fetch(`https://accounts.spotify.com/api/token`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
            // (new Buffer(clientIdSecret, "base64"))
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token
}

export const clickedEvent = async (trackNum: number) => {
    let token = await getToken();
    console.log("Token: ", token)

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
    console.log("Track num", trackNum, "Response is ", response);

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
    // console.log("CLICKED");
    // event.stopPropagation();
    clickedEvent(trackNum);
}

export const stopSnippet = () => {
    return playSong.pause();
}

export const playSnippet = (currentTrack: number) => {
    console.log("Moving on!");
    clickedEvent(currentTrack);
}
