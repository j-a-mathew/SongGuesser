import React, { useState } from 'react';
import styles from '../../styles.module.css';
import { Button, 
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LeaderboardForm } from '../LeaderboardForm';
import { useGetData } from '../../custom-hooks';
import { useSelector } from 'react-redux';
import LeaderboardDataService from '../../services/leaderboard.service';
import { useUser } from 'reactfire';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90, hide: true},
    {field: 'firstName', headerName: 'First Name', flex: 1},
    {field: 'lastName', headerName: 'Last Name', flex: 1},
    {field: 'favSong', headerName: 'Favorite Song', flex: 1},
    {field: 'score', headerName: 'Score', flex: 1},
    {field: 'username', headerName: 'Username', width: 90, hide: true}
]

interface gridData {
    data: {
        id?: string;
    }
}

interface LeaderboardState {
    firstName: string;
    lastName: string;
    favSong: string;
    score: number;
    username: string;
};

export const Leaderboard = () => {

    let { leaderboardData, getData } = useGetData();
    let [ openCreate, setOpenCreate ] = useState(false); // for create new dialog window
    let [ openUpdate, setOpenUpdate ] = useState(false); // for update dialog window
    let [ gridData, setData ] = useState<gridData>({data:{}});
    const [ selectionModel, setSelectionModel ] = useState<any>([]);
    const [ selectedRowData, setSelectedRowData ] = useState<any>([]);
    const score = useSelector<LeaderboardState>((state) => state.score);
    const { status: userStatus, data: user } = useUser();

    // Open dialog box for creating new Leaderboard entry
    let handleOpenCreate = () => {
        console.log("Score is:", score);
        if (score === "None"){
            alert("You must attempt SongGuesser before trying to submit a score!")
        } else{
            setOpenCreate(true);
        }
    };

    // Close dialog box for creating new Leaderboard entry
    let handleCloseCreate = () => {
        setOpenCreate(false);
    }

    // Open dialog box for updating a Leaderboard entry
    // Checks to make sure selected entry was created by logged in user
    let handleOpenUpdate = () => {
        if (checkSelected()){
            if (selectedRowData[0].username === user?.displayName){  // 
                setOpenUpdate(true);
            } else {
                alert("You cannot update an entry that you have not created yourself!")
            }
        } else {
            alert("You have not selected an entry to update!")
        }
    }

    // Close dialog box for updating a Leaderboard entry
    let handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    // Delete data if something is selected and logged in user created that entry
    let deleteData = () => {
        if (checkSelected()){
            if (selectedRowData[0].username === user?.displayName){
                LeaderboardDataService.delete(selectedRowData[0].id);
                getData();
                setTimeout( () => {window.location.reload(); }, 1000)
            } else {
                alert("You cannot delete an entry that you have not created yourself!")
            }
        } else {
            alert("Select one of your created entries to delete!")
        }
    }

    let refresh = () => {
        setTimeout( () => {window.location.reload(); }, 1000)
    }

    // Helper method to check if an entry was actually selected
    let checkSelected = () => {
        if (selectionModel.length === 0){
            return false;
        }
        return true;
    }

    return (
        <div className={styles.backgroundColor}>
            <div className={styles.marginTop}>
                <Typography variant="h2" color="common.white" sx={{mb:4}}>Leaderboard</Typography>
                <Typography variant="h6" color="common.white" sx={{mb:2}}>The Leaderboard is hosted via Glitch, which puts projects to sleep after 5 minutes of inactivity.
                    If you don't see any data just yet, please wait! Glitch will wake the project up shortly! :)
                </Typography>
                <div>
                    <div>
                        <Button onClick={handleOpenCreate} sx={{mt:2, mb: 3}} variant="contained" color="success">Create Entry Using Score</Button>
                    </div>        
                    <div style={{ height: 500, width: '100%' }}> 
                        <DataGrid 
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'score', sort: 'desc' }],
                                },
                                pagination: {
                                    pageSize: 10,
                                },
                            }}
                            sx={{ 
                                color: 'rgba(255,255,255,0.9)',
                                border: 3,
                                borderColor: 'rgba(52, 235, 201, 0.5)' 
                            }}
                            rows={leaderboardData} 
                            columns={columns} 
                            rowsPerPageOptions={[10, 20, 50]}
                            checkboxSelection={true}
                            selectionModel={selectionModel}
                            // This helps ensure only one entry can be selected at a time
                            onSelectionModelChange = { (item) => {
                                if (item.length > 1){
                                    const selectedItems = new Set(selectionModel);
                                    const result = item.filter((s) => !selectedItems.has(s))
                                    const result2 = leaderboardData.filter((row) => result[0] === row.id)
                                    // const selectedRowData = leaderboardData.filter((row) =>
                                    //     selectedItems.has(row.id));
                                    setSelectionModel(result);
                                    setSelectedRowData(result2);
                                } else {
                                    const selectedItems = new Set(item);
                                    const selectedData = leaderboardData.filter((row) =>
                                        selectedItems.has(row.id));
                                    setSelectionModel(item);
                                    setSelectedRowData(selectedData);
                                }
                            }}
                            showCellRightBorder={true} showColumnRightBorder={true}
                        />
                        <div className={styles.center}>
                            <Button onClick={handleOpenUpdate} sx={{mt: 2, mr: 3}} variant="contained">Update</Button>
                            <Button sx={{mt: 2, mr: 3}} variant="contained" color="error" onClick={deleteData}>Delete</Button>
                            <Button sx={{mt: 2}} variant="contained" color="secondary" onClick={refresh}>Refresh</Button>
                        </div>
                    </div>

                    {/* Dialog Box for creating new entry */}
                    <Dialog open={openCreate} onClose={handleCloseCreate} aria-labelledby="form-dialog-title-create">
                        <DialogTitle id="form-dialog-title-create">Create New Leaderboard Entry</DialogTitle>
                        <DialogContent>
                            <LeaderboardForm></LeaderboardForm>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreate} color="primary" className={styles.center}>Cancel</Button>
                            <Button onClick={handleCloseCreate} color="primary" className={styles.center}>Done</Button>
                        </DialogActions>
                    </Dialog>
                
                
                    {/* Dialog Box for updating entry */}
                    <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title-update">
                    <DialogTitle id="form-dialog-title-update">Update Leaderboard Entry with First Name {selectedRowData[0]?.firstName}</DialogTitle>
                    <DialogContent>
                        <LeaderboardForm id={selectedRowData[0]?.id}></LeaderboardForm>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUpdate} color="primary" className={styles.center}>Cancel</Button>
                        <Button onClick={handleCloseUpdate} color="primary" className={styles.center}>Done</Button>
                    </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
