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
import { server_calls } from '../../../back-end/controllers/leaderboard_controller';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90, hide: true},
    {field: 'firstName', headerName: 'First Name', flex: 1},
    {field: 'lastName', headerName: 'Last Name', flex: 1},
    {field: 'favSong', headerName: 'Favorite Song', flex: 1},
    {field: 'score', headerName: 'Score', flex: 1},
]

interface gridData {
    data: {
        id?: string;
    }
}

export const Leaderboard = () => {

    let { leaderboardData, getData } = useGetData();
    let [ openCreate, setOpenCreate ] = useState(false);
    let [ openUpdate, setOpenUpdate ] = useState(false);
    let [ gridData, setData ] = useState<gridData>({data:{}});
    const [ selectionModel, setSelectionModel ] = useState<any>([]);

    let handleOpenCreate = () => {
        console.log("test")
        setOpenCreate(true);
    };

    let handleCloseCreate = () => {
        setOpenCreate(false);
    }

    let handleOpenUpdate = () => {
        if (checkSelected()){
            setOpenUpdate(true);
        } else {
            alert("You have not selected an entry to update!")
        }
    }

    let handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    let deleteData = () => {
        if (selectionModel.length != 0){
            server_calls.delete(selectionModel);
            getData();
            setTimeout( () => {window.location.reload(); }, 1000)
        }
    }

    let refresh = () => {
        setTimeout( () => {window.location.reload(); }, 1000)
    }

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
                <div>
                    <div>
                        <Button onClick={handleOpenCreate} sx={{mt:2, mb: 3}} variant="contained" color="success">Create New</Button>
                    </div>        
                    <div style={{ height: 400, width: '100%' }}> 
                        <DataGrid rows={leaderboardData} columns={columns} pageSize={5} checkboxSelection={true}
                            rowsPerPageOptions={ [5] }
                            onSelectionModelChange = { (item) => {
                                console.log(item)
                                setSelectionModel(item)
                            }}
                            showCellRightBorder={true} showColumnRightBorder={true}></DataGrid>
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
                            {/* <MemeForm></MemeForm> */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreate} color="primary" className={styles.center}>Cancel</Button>
                            <Button onClick={handleCloseCreate} color="primary" className={styles.center}>Done</Button>
                        </DialogActions>
                    </Dialog>
                
                
                    {/* Dialog Box for updating entry */}
                    
                    <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title-update">
                    <DialogTitle id="form-dialog-title-update">Update Leaderboard Entry with ID {selectionModel}</DialogTitle>
                    <DialogContent>
                        {/* <MemeForm id={selectionModel!}></MemeForm> */}
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
