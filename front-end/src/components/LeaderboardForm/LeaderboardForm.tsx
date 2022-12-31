import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux'; 
import { useForm } from 'react-hook-form';
import { chooseFirstName, chooseLastName, chooseFavSong, setScore} from '../../redux/slices/RootSlice';
import { Input } from '../SharedComponents/Input';
import { Button } from '@mui/material';
import LeaderboardDataService from '../../services/leaderboard.service';

interface LeaderboardFormProps {
    id?: string;
    data?: {};
};

interface LeaderboardState {
    firstName: string;
    lastName: string;
    favSong: string;
    score: number;
};

// General form that can be reused for both creation and updating dialog boxes

export const LeaderboardForm = (props: LeaderboardFormProps) => {

    // redux-specific hook that updates store for us
    const dispatch = useDispatch();
    const store = useStore();
    const name = useSelector<LeaderboardState>(state => state.firstName);
    const {register, handleSubmit} = useForm({ });

    const onSubmit = (data: any, event: any) => {
        console.log(props.id)
        if(props.id!){
            LeaderboardDataService.update(props.id!, data);
            console.log(`Updated: ${data} ${props.id}`)
            console.log(data);
            setTimeout( () => {window.location.reload()}, 1000);
            event.target.reset();
        } else {
            dispatch(chooseFirstName(data.firstName));
            dispatch(chooseLastName(data.lastName));
            dispatch(chooseFavSong(data.favSong));
            // dispatch(setScore(data.score));
            LeaderboardDataService.create(store.getState());
            setTimeout( () => {window.location.reload()}, 1000)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <Input {...register('firstName')} name="firstName" placeholder="First Name" />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <Input {...register('lastName')} name="lastName" placeholder="Last Name" />
                </div>
                <div>
                    <label htmlFor="favSong">Favorite Song from the Playlist?</label>
                    <Input {...register('favSong')} name="favSong" placeholder="Favorite Song" />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    )
}
