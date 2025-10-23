"use client";

import { Avatar, Box, Button, ButtonBase, Card, CardContent, Checkbox, Chip, CircularProgress, CircularProgressProps, Divider, FormControlLabel, Grid, Input, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import GameHeading from "./game-heading";
import React, { useState } from "react";
import { LooksOne, LooksTwo, CloudUpload } from "@mui/icons-material";
import Image from "next/image";

let avatarSrc: string | undefined;
let setAvatarSrc: (src: string) => void;

export default function NewGame() {
    const steps = ["Basic Information", "Platform Setup", "Game Resources", "Review & Submit"];
    const [currentPage, setCurrentPage] = useState(1);

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
    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Game Screenshots</Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ width: '100%' }}
                    >
                        Upload Game Screenshots
                        <Input type="file" hidden />
                    </Button>
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        {['game_screenshot_1.png', 'game_screenshot_2.png', 'game_screenshot_3.png'].map((file, idx) => (
                            <Grid key={idx}>
                                <Card>
                                    <CardContent>
                                        <Image src={`/${file}`} alt={`Screenshot ${idx + 1}`} style={{ width: '100%' }} />
                                        <Typography variant="body2" align="center" color="textSecondary">
                                            {file}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Installers</Typography>
                    <Grid container spacing={2}>
                        <Grid>
                            <TextField
                                label="Android Installer"
                                value="mygame_v1.0.apk"
                                fullWidth
                            />
                            <Typography variant="body2" color="textSecondary">
                                File Size: N/A MB
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Upload Time: 2024-09-25 14:30
                            </Typography>
                        </Grid>
                        <Grid>
                            <TextField
                                label="iOS Installer"
                                fullWidth
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                            <Typography variant="body2" color="textSecondary">
                                (Not Supported)
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Web Application</Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ width: '100%' }}
                    >
                        Upload Artifacts
                        <Input
                            type="file"
                            hidden
                        />
                    </Button>
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                        The homepage should be index.html
                    </Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Changelog</Typography>
                    <TextField
                        label="Version Name"
                        value="1.0.0"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Version Code"
                        value="1"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Changelog"
                        multiline
                        rows={4}
                        value="The first version"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mininum System Requiement"
                        value="Android 5.0+"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Recommended System Requirement"
                        value="Android 8.0+"
                        fullWidth
                        margin="normal"
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

function BasicInfo() {
    const [gameName, setGameName] = React.useState('');

    return (
        <Paper variant="elevation" sx={{ flex: 3, p: 2 }}>
            <Typography variant="h6">Basic Information</Typography>
            <Grid container component="form" spacing={3} mt={2}>
                <TextField
                    label="Name"
                    sx={{ flex: 1 }}
                    value={gameName}
                    onChange={(e) => { setGameName(e.target.name) }}
                />
                <TextField select label="Type" sx={{ width: '30ch' }}>
                    <MenuItem>
                        Type
                    </MenuItem>
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
