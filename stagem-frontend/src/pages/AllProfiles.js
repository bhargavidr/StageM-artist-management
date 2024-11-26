import React, { useEffect, useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import ProfileCard from '../components/ProfileCard';
import axios from '../config/axios';
import CircularLoader from '../components/CircularLoader';
import { useLocation, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import BackButton from '../components/Buttons/BackButton';
import SearchBar from '../components/SearchBar';

export default function AllProfiles() {
    const [profiles, setProfiles] = useState(null);
    const [type, setType] = useState('');
    const [search, setSearch] = useState('')
    const location = useLocation(); 

    const {tag} = useParams()
    
    const url = useMemo(() => {
        if(tag){
            return `/artists/${tag}`
        }
        if (location.pathname === '/artists') {
            setType('artists')
            return '/artists';
        }
        if (location.pathname === '/artistManagers') {
            setType('artistManagers')
            return '/artistManagers';
        }
    }, [location.pathname]);

    useEffect(() => {
        const getProfiles = async () => {
            const response = await axios.get(url, {
                params: {search}
            }); 
            if (response) {
                setProfiles(response.data);
            }
        };
        getProfiles();      
    }, [url, search]); 

    return (
        <><SearchBar action={setSearch} type={type}/>
        {profiles ? profiles.length < 1 ? <p align='center'>No profiles found</p> : 
        <>{tag && <Typography variant='h4' align='center' sx={{mt: 2}}> 
            <BackButton style={{mx:5}} variant='outlined' />
            Profiles with {tag} in their artist titles             
        </Typography>}        
        <Grid container spacing={1} sx={{ padding: '2%' }}>            
            {profiles.map((ele, index) => (
                <Grid item key={index} xs={6} sm={4} md={2}>
                    <ProfileCard profile={ele} />
                </Grid>
            ))}
        </Grid></> : <CircularLoader />}
        </>
    );
}
