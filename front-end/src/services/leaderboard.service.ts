import http from "../http-common";

class LeaderboardDataService {
    getAll() {
      return http.get("/leaderboard");
    }
  
    get(id: any) {
      return http.get(`/leaderboard/${id}`);
    }
  
    create(data: any) {
      return http.post("/leaderboard", data);
    }
  
    update(id: any, data: any) {
      return http.put(`/leaderboard/${id}`, data);
    }
  
    delete(id: any) {
      return http.delete(`/leaderboard/${id}`);
    }
  
    deleteAll() {
      return http.delete(`/leaderboard`);
    }
  
    findByTitle(title:any) {
      return http.get(`/leaderboard?title=${title}`);
    }
  }
  
  export default new LeaderboardDataService();