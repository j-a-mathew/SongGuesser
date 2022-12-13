import {server_calls as leaderboard_routes} from '../controllers/leaderboard_controller';
import * as express from 'express';

export const routes = (app: any) => {
  
    const router = express.Router();
  
    // Create a new Leaderboard
    router.post("/", leaderboard_routes.create);
  
    // Retrieve all Leaderboard entries
    router.get("/", leaderboard_routes.findAll);
  
    // Retrieve all published Leaderboard entries
    // router.get("/published", leaderboard_routes.findAllPublished);
  
    // Retrieve a single Leaderboard entry with id
    router.get("/:id", leaderboard_routes.findOne);
  
    // Update a Leaderboard entry with id
    router.put("/:id", leaderboard_routes.update);
  
    // Delete a Leaderboard entry with id
    router.delete("/:id", leaderboard_routes.delete);
  
    // Create a new Leaderboard
    router.delete("/", leaderboard_routes.deleteAll);
  
    app.use('/api/leaderboard', router);
};
 