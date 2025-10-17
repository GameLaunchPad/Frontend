"use client";

import { Avatar, Box, ButtonBase, Chip, Divider, Grid, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import GameHeading from "./game-heading";
import React from "react";

let avatarSrc: string | undefined;
let setAvatarSrc: (src: string) => void;

export default function NewGame() {
    const steps = ["Basic Information", "Platform Setup", "Game Resources", "Review & Submit"];

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <GameHeading
                heading="New Game"
                subheading="Game Management &gt; New Game"
                actions={["Save Draft", "Preview"]}
            />
            <Divider />
            <Box mt={4}>
                <Stepper alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                    },
                }}
            >
                <BasicInfo />
                <LivePreview />
                <CreationProgress />
            </Box>
        </Box >
    );
}

function BasicInfo() {
    const [gameName, setGameName] = React.useState('');

    return (
        <Paper variant="elevation" sx={{ flex: 3, p: 2 }}>
            <Typography variant="h6">Basic Information</Typography>
            <Grid container component="form" spacing={3} mt={2}>
                <TextField
                    label="Name"
                    sx={{ width: '50ch' }}
                    value={gameName}
                    onChange={(e) => { setGameName(e.target.name) }}
                />
                <TextField select label="Type" sx={{ width: '30ch' }} />
                <TextField fullWidth multiline label="Introduction" minRows={5} />
                <UploadAvatars />
            </Grid>
        </Paper>
    );
}

function LivePreview() {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2, alignContent: 'center', justifyItems: 'center' }}>
            <Typography variant="h6">Live Preview</Typography>
            <Avatar src={avatarSrc} sx={{ width: 80, height: 80, m: 2 }} />
            <Typography variant="h6">Name</Typography>
            <Typography variant="body1">Introduction</Typography>
            <Box mt={2}>
                <Chip label="Android" />
            </Box>
        </Paper>
    );
}

function CreationProgress() {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2, alignContent: 'center', justifyItems: 'center' }}>
            <Typography variant="h6">Creation Progress</Typography>
            <Avatar src={avatarSrc} sx={{ width: 80, height: 80, m: 2 }} />
            <Typography variant="h6">The 1st step: Basic Information</Typography>
            <Typography variant="body1">Please fill in the basic game information</Typography>
        </Paper>
    );
}

function UploadAvatars() {
    [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} // prevent label from tab focus
            aria-label="Avatar image"
            sx={{
                borderRadius: '40px',
                '&:has(:focus-visible)': {
                    outline: '2px solid',
                    outlineOffset: '2px',
                },
            }}
        >
            <Avatar alt="Upload new avatar" src={avatarSrc} sx={{ width: 80, height: 80 }} />
            <input
                type="file"
                accept="image/*"
                style={{
                    border: 0,
                    clip: 'rect(0 0 0 0)',
                    height: '1px',
                    margin: '-1px',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    width: '1px',
                }}
                onChange={handleAvatarChange}
            />
        </ButtonBase>
    );
}
