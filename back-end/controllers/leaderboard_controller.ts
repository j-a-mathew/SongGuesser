//testing

import { database as db_control } from '../models/leaderboard_model';
const Leaderboard_control = db_control.Leaderboard;

export const server_calls = {
    
    // Create and Save a new Leaderboard entry
    create: (data: any = {}) => {
        const leaderboard_entry = {
            firstName: data.firstName,
            lastName: data.lastName,
            favSong: data.favSong ? data.favSong : "None selected",
            score: data.score
        };

        Leaderboard_control.create(leaderboard_entry);
        
        // // Validate request
        // if (!req.body.firstName) {
        //     res.status(400).send({
        //         message: "First name is required!"
        // });
        //     return;
        // }
    
        // // Create a Leaderboard entry
        // const leaderboard_entry = {
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     favSong: req.body.favSong ? req.body.favSong : "None selected",
        //     score: req.body.score
        // };
    
        // // Save Leaderboard entry in the database
        // Leaderboard_control.create(leaderboard_entry)
        // .then(data => {
        //     res.send(data);
        // })
        // .catch(err => {
        //     res.status(500).send({
        //     message:
        //         err.message || "An error occurred when trying to create the Leaderboard entry."
        //     });
        // });
    },
    
    // Retrieve all Leaderboard entries from the database.
    findAll: async () => {
        const response = (await Leaderboard_control.findAll()).map(elem => elem.get({plain: true}))

        if (!response){
            throw new Error("Failed to fetch data from the server!")
        }

        return await JSON.parse(JSON.stringify(response, null, 2));


        // return Leaderboard_control.findAll()
        // .then(data => {
        //     res.send(data);
        // })
        // .catch(err => {
        //     res.status(500).send({
        //         message:
        //             err.message || "An error occured while trying to retrive the Leaderboard."
        //     })
        // })
    },

    // Find a single Leaderboard entry with an id
    findOne: (req:any, res:any) => {
        const id = req.params.id;

        Leaderboard_control.findByPk(id)
        .then(data => {
            if (data) {
                // res.send.data;
            } else {
                res.status(404).send({
                    message: `Cannot find Leaderboard entry with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error retrieving Leaderboard with id=${id}`
            });
        });
    },

    // Update a Leaderboard entry by the id in the request
    update: (req:any, res:any) => {
        const id = req.params.id;

        Leaderboard_control.update(req.body, {
            where: {id: id}
        })
        .then(num => {
            // update
            if (id) {
                res.send({
                    message: "Leaderboard was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Leaderboard entry with id=${id}. Entry may not have been found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating Leaderboard entry with id=${id}`
            });
        });
    },

    // Delete a Leaderboard entry with the specified id in the request
    delete: (id: string) => {
        // const id = req.params.id;

        Leaderboard_control.destroy({
            where: {id: id}
        })
        // .then(num => {
        //     if (num == 1){
        //         res.send({
        //             message: "Leaderboard entry was deleted successfully!"
        //         });
        //     } else {
        //         res.send({
        //             message: `Cannot delete Leaderboard entry with id=${id}. Entry may not have been found!`
        //         });
        //     }  
        // })
        // .catch (err => {
        //     res.status(500).send({
        //         message: `Could not delete Leaderboard entry with id=${id}`
        //     });
        // });
    },

    // Delete all Leaderboard entries from the database.
    deleteAll: (req: any, res: any) => {
        Leaderboard_control.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Leaderboard entries were deleted successfully.`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while removing all Leaderboard entries."
            });
        });
    },

}

// // Create and Save a new Leaderboard entry
// exports.create = (req, res) => {
//     // Validate request
//     if (!req.body.firstName) {
//         res.status(400).send({
//             message: "First name is required!"
//     });
//         return;
//     }

//     // Create a Leaderboard entry
//     const leaderboard_entry = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         favSong: req.body.favSong ? req.body.favSong : "None selected",
//         score: req.body.score
//     };

//     // Save Leaderboard entry in the database
//     Leaderboard_control.create(leaderboard_entry)
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//         message:
//             err.message || "An error occurred when trying to create the Leaderboard entry."
//         });
//     });
// };

// // Retrieve all Leaderboard entries from the database.
// exports.findAll = (req, res) => {
//     return Leaderboard_control.findAll()
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//                 err.message || "An error occured while trying to retrive the Leaderboard."
//         })
//     })
// };

// // Find a single Leaderboard entry with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     Leaderboard_control.findByPk(id)
//     .then(data => {
//         if (data) {
//             res.send.data;
//         } else {
//             res.status(404).send({
//                 message: `Cannot find Leaderboard entry with id=${id}.`
//             });
//         }
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: `Error retrieving Leaderboard with id=${id}`
//         });
//     });
// };

// // Update a Leaderboard entry by the id in the request
// exports.update = (req, res) => {
//     const id = req.params.id;

//     Leaderboard_control.update(req.body, {
//         where: {id: id}
//     })
//     .then(num => {
//         if (num == 1) {
//             res.send({
//                 message: "Leaderboard was updated successfully."
//             });
//         } else {
//             res.send({
//                 message: `Cannot update Leaderboard entry with id=${id}. Entry may not have been found or req.body is empty!`
//             });
//         }
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: `Error updating Leaderboard entry with id=${id}`
//         });
//     });
// };

// // Delete a Leaderboard entry with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;

//     Leaderboard_control.destroy({
//         where: {id: id}
//     })
//     .then(num => {
//         if (num == 1){
//             res.send({
//                 message: "Leaderboard entry was deleted successfully!"
//             });
//         } else {
//             res.send({
//                 message: `Cannot delete Leaderboard entry with id=${id}. Entry may not have been found!`
//             });
//         }  
//     })
//     .catch (err => {
//         res.status(500).send({
//             message: `Could not delete Leaderboard entry with id=${id}`
//         });
//     });
// };

// // Delete all Leaderboard entries from the database.
// exports.deleteAll = (req, res) => {
//     Leaderboard_control.destroy({
//         where: {},
//         truncate: false
//     })
//     .then(nums => {
//         res.send({ message: `${nums} Leaderboard entries were deleted successfully.`});
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//                 err.message || "An error occurred while removing all Leaderboard entries."
//         });
//     });
// };

// // Find all published Leaderboard entries
// exports.findAllPublished = (req, res) => {
  
// };