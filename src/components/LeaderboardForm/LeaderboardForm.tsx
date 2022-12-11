import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux'; 
import { useForm } from 'react-hook-form';
import { chooseFirstName, chooseLastName, chooseFavSong, chooseScore} from '../../redux/slices/RootSlice';
import { Input } from '../SharedComponents/Input';
import { Button } from '@mui/material';
// import { server_calls } from '../../api';
import { server_calls } from '../../back-end/controllers/leaderboard_controller.mjs';

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

export const LeaderboardForm = (props: LeaderboardFormProps) => {

    // redux-specific hook that updates store for us
    const dispatch = useDispatch();
    const store = useStore();
    const name = useSelector<LeaderboardState>(state => state.firstName);
    const {register, handleSubmit} = useForm({ });

    const onSubmit = (data: any, event: any) => {
        console.log(props.id)
        if(props.id!){
            server_calls.update(props.id!, data);
            console.log(`Updated: ${data} ${props.id}`)
            console.log(data);
            setTimeout( () => {window.location.reload()}, 1000);
            event.target.reset();
        } else {
            dispatch(chooseFirstName(data.firstName));
            dispatch(chooseLastName(data.lastName));
            dispatch(chooseFavSong(data.favSong));
            dispatch(chooseScore(data.score));
            server_calls.create(store.getState());
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
                {/* <div>
                    <label htmlFor="address">Address</label>
                    <Input {...register('address')} name="address" placeholder="Address" />
                </div> */}
                <Button type="submit">Submit</Button>
            </form>
        </div>
    )
}
