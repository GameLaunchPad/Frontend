"use client";

import { Avatar, Box, Button, ButtonBase, Checkbox, Chip, CircularProgress, CircularProgressProps, Divider, FormControlLabel, Grid, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import GameHeading from "../game-heading";
import React, { useState } from "react";
import { LooksOne, LooksTwo } from "@mui/icons-material";

let avatarSrc: string | undefined;
let setAvatarSrc: (src: string) => void;

export default function NewGame() {
    const steps = ["Basic Information", "Platform Setup", "Game Resources", "Review & Submit"];
    const [currentPage, setCurrentPage] = useState(1);

    const [gameName, setGameName] = useState('');
    const [gameIntro, setGameIntro] = useState('');
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

    const RenderContent = () => {
        switch (currentPage) {
            case 1:
                return <FirstPage />;
            case 2:
                return <SecondPage />;
            default:
                return <Typography>Step Completed</Typography>;
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <GameHeading
                heading="New Game"
                subheading="Game Management &gt; New Game"
                actions={["Save Draft", "Preview"]}
            />
            <Divider />
            <Box mt={4}>
                <Stepper activeStep={currentPage * 2 - 2} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <RenderContent />
            <Grid container spacing={2} mt={4}>
                <Grid container>
                    <Button variant="outlined">Go Back to My Games</Button>
                    <Button variant="outlined">Save Draft</Button>
                </Grid>
                <Grid size="grow">
                </Grid>
                <Grid container>
                    <Button
                        variant="outlined"
                        onClick={() => setCurrentPage(1)}
                    >
                        Reset Form
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setCurrentPage((page) => page + 1)}
                    >
                        Next Step
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

function FirstPage() {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid size={8}>
                <Stack spacing={2}>
                    <BasicInfo />
                    <SupportedPlatforms />
                    <DownloadConfig />
                </Stack>
            </Grid>
            <Grid size={4}>
                <Stack spacing={2}>
                    <LivePreview />
                    <CreationProgress />
                    <Tips />
                </Stack>
            </Grid>
        </Grid>
    );
}

function SecondPage() {
    return (<></>);
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
                    onChange={(e) => { setGameName(e.target.value) }}
                />
                <TextField
                    select
                    label="Type"
                    sx={{ width: '30ch' }}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 250,
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>Select Type</em>
                    </MenuItem>
                    <MenuItem value="Action">Action</MenuItem>
                    <MenuItem value="Adventure">Adventure</MenuItem>
                    <MenuItem value="RPG">RPG (Role-Playing Game)</MenuItem>
                    <MenuItem value="Strategy">Strategy</MenuItem>
                    <MenuItem value="Simulation">Simulation</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Racing">Racing</MenuItem>
                    <MenuItem value="Fighting">Fighting</MenuItem>
                    <MenuItem value="Puzzle">Puzzle</MenuItem>
                    <MenuItem value="Platformer">Platformer</MenuItem>
                    <MenuItem value="Shooter">Shooter</MenuItem>
                    <MenuItem value="MMO">MMO (Massively Multiplayer Online)</MenuItem>
                    <MenuItem value="Music">Music/Rhythm</MenuItem>
                    <MenuItem value="Casual">Casual</MenuItem>
                    <MenuItem value="Card & Board">Card & Board Game</MenuItem>
                    <MenuItem value="Educational">Educational</MenuItem>
                    <MenuItem value="Sandbox">Sandbox</MenuItem>
                    <MenuItem value="Open World">Open World</MenuItem>
                    <MenuItem value="Horror">Horror</MenuItem>
                    <MenuItem value="Stealth">Stealth</MenuItem>
                    <MenuItem value="Survival">Survival</MenuItem>
                </TextField>
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
            <Box p={2}>
                <CircularProgressWithLabel enableTrackSlot variant="determinate" value={25} size={120} />
            </Box>
            <Typography variant="h6">The 1st step: Basic Information</Typography>
            <Typography variant="body1">Please fill in the basic game information</Typography>
        </Paper>
    );
}

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    fontSize={20}
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
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

function Tips() {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
            <List>
                <ListItem>
                    <ListItemText primary="Tips" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LooksOne />
                    </ListItemIcon>
                    <ListItemText primary="Tip 1" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LooksTwo />
                    </ListItemIcon>
                    <ListItemText primary="Tip 2" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LooksTwo />
                    </ListItemIcon>
                    <ListItemText primary="Tip 3" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LooksTwo />
                    </ListItemIcon>
                    <ListItemText primary="Tip 4" />
                </ListItem>
            </List>
        </Paper>
    );
}

function SupportedPlatforms() {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6">Supported Platforms</Typography>
            <FormControlLabel control={<Checkbox />} label="Android" />
            <FormControlLabel control={<Checkbox />} label="iOS" />
            <FormControlLabel control={<Checkbox />} label="Web" />
        </Paper>
    );
}

function DownloadConfig() {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6">Download Configurations</Typography>
            <Stack spacing={2}>
                <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h6">Android Configuration</Typography>
                    <TextField label="Package Name" placeholder="com.example.game" margin="normal" />
                    <TextField select label="Minimum SDK Version" margin="normal" sx={{ marginLeft: 2, minWidth: '24ch' }}>
                        <MenuItem>
                            SDK Version
                        </MenuItem>
                    </TextField>
                </Paper>
                <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h6">iOS Configuration</Typography>
                    <TextField label="Package Name" placeholder="com.example.game" margin="normal" />
                    <TextField select label="Minimum iOS Version" margin="normal" sx={{ marginLeft: 2, minWidth: '24ch' }} >
                        <MenuItem>
                            iOS Version
                        </MenuItem>
                    </TextField>
                </Paper>
                <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h6">Web Configuration</Typography>
                    <TextField label="URL" placeholder="https://game.example.com" margin="normal" />
                    <TextField select label="Supported Browsers" margin="normal" sx={{ marginLeft: 2, minWidth: '24ch' }} >
                        <MenuItem>
                            Browser
                        </MenuItem>
                    </TextField>
                </Paper>
            </Stack>
        </Paper>
    );
}
