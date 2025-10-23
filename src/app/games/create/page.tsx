"use client";

import { Avatar, Box, Button, ButtonBase, Checkbox, Chip, Divider, FormControlLabel, Grid, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import GameHeading from "../game-heading";
import React, { useState, useEffect } from "react";
import { LooksOne, LooksTwo } from "@mui/icons-material";

interface FirstPageProps {
    gameName: string;
    onGameNameChange: (name: string) => void;
    gameIntro: string;
    onGameIntroChange: (intro: string) => void;
    avatarSrc?: string;
    onAvatarUpdate: (src: string) => void;
    gameType: string;
    onGameTypeChange: (type: string) => void;
    platforms: { android: boolean; ios: boolean; web: boolean; };
    onPlatformChange: (platforms: { android: boolean; ios: boolean; web: boolean; }) => void;
}

function FirstPage({ gameName, onGameNameChange, gameIntro, onGameIntroChange, avatarSrc, onAvatarUpdate, gameType, onGameTypeChange, platforms, onPlatformChange, }: FirstPageProps) {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid item size={9}>
                <Stack spacing={3}>
                    <BasicInfo
                        gameName={gameName}
                        onGameNameChange={onGameNameChange}
                        gameIntro={gameIntro}
                        onGameIntroChange={onGameIntroChange}
                        gameType={gameType}
                        onGameTypeChange={onGameTypeChange}
                    />
                    <Paper variant="elevation" sx={{ p: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Game Icon *</Typography>
                        <UploadAvatars onAvatarUpdate={onAvatarUpdate} initialAvatarSrc={avatarSrc} />
                    </Paper>
                    <SupportedPlatforms
                        platforms={platforms}
                        onPlatformChange={onPlatformChange}
                    />
                    <DownloadConfig />
                </Stack>
            </Grid>
            <Grid item size={3} sx={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
                <Stack spacing={4}>
                    <LivePreview
                        name={gameName}
                        introduction={gameIntro}
                        avatarSrc={avatarSrc}
                        platforms={platforms}
                        gameType={gameType}
                    />
                    <Tips />
                </Stack>
            </Grid>
        </Grid>
    );
}

function SecondPage() {
    return (<></>);
}

export default function NewGame() {
    const [currentPage, setCurrentPage] = useState(1);

    const [gameName, setGameName] = useState('');
    const [gameIntro, setGameIntro] = useState('');
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [gameType, setGameType] = useState('');
    const [platforms, setPlatforms] = useState({
        android: false,
        ios: false,
        web: false,
    });

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <GameHeading
                heading="New Game"
                subheading="Game Management &gt; New Game"
            />
            <Divider />
            {currentPage === 1 && (
                <FirstPage
                    gameName={gameName}
                    onGameNameChange={setGameName}
                    gameIntro={gameIntro}
                    onGameIntroChange={setGameIntro}
                    avatarSrc={avatarSrc}
                    onAvatarUpdate={setAvatarSrc}
                    gameType={gameType}
                    onGameTypeChange={setGameType}
                    platforms={platforms}
                    onPlatformChange={setPlatforms}
                />
            )}
            {currentPage === 2 && <SecondPage />}
            {currentPage > 2 && <Typography>Step Completed</Typography>}
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

interface BasicInfoProps {
    gameName: string;
    onGameNameChange: (name: string) => void;
    gameIntro: string;
    onGameIntroChange: (intro: string) => void;
    gameType: string;
    onGameTypeChange: (type: string) => void;
}

function BasicInfo({ gameName, onGameNameChange, gameIntro, onGameIntroChange, gameType, onGameTypeChange }: BasicInfoProps)  {

    return (
        <Paper variant="elevation" sx={{ flex: 3, p: 2 }}>
            <Typography variant="h6">Basic Information</Typography>
            <Grid container component="form" spacing={3} mt={2}>
                <TextField
                    label="Name"
                    sx={{ width: '50ch' }}
                    value={gameName}
                    onChange={(e) => onGameNameChange(e.target.value)}
                />
                <TextField
                    select
                    label="Type"
                    sx={{ width: '30ch' }}
                    value={gameType}
                    onChange={(e) => onGameTypeChange(e.target.value)}
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
                <TextField
                    fullWidth
                    multiline
                    label="Introduction"
                    minRows={5}
                    value={gameIntro}
                    onChange={(e) => onGameIntroChange(e.target.value)}
                />
            </Grid>
        </Paper>
    );
}

interface LivePreviewProps {
    name: string;
    introduction: string;
    avatarSrc?: string;
    platforms: { android: boolean; ios: boolean; web: boolean; };
    gameType: string;
}

function LivePreview({ name, introduction, avatarSrc, platforms, gameType }: LivePreviewProps) {
    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2, alignContent: 'center', justifyItems: 'center' }}>
            <Typography variant="h6">Live Preview</Typography>
            <Avatar src={avatarSrc} sx={{ width: 80, height: 80, m: 2 }} />
            <Typography variant="h6">{name || 'Name'}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {gameType || 'Type'}
            </Typography>
            <Typography variant="body1">{introduction || 'Introduction'}</Typography>
            <Box mt={2}>
                {platforms.android && <Chip label="Android" size="small" sx={{ mr: 0.5 }} />}
                {platforms.ios && <Chip label="iOS" size="small" sx={{ mr: 0.5 }} />}
                {platforms.web && <Chip label="Web" size="small" />}
            </Box>
        </Paper>
    );
}

interface UploadAvatarsProps {
    onAvatarUpdate: (src: string) => void;
    initialAvatarSrc?: string;
}

function UploadAvatars({ onAvatarUpdate, initialAvatarSrc }: UploadAvatarsProps) {
    const [previewSrc, setPreviewSrc] = useState<string | undefined>(initialAvatarSrc);

    useEffect(() => {
        setPreviewSrc(initialAvatarSrc);
    }, [initialAvatarSrc]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setPreviewSrc(result);
                onAvatarUpdate(result);
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
            <Avatar alt="Upload new avatar" src={previewSrc} sx={{ width: 80, height: 80 }} />
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

interface SupportedPlatformsProps {
    platforms: { android: boolean; ios: boolean; web: boolean; };
    onPlatformChange: (platforms: { android: boolean; ios: boolean; web: boolean; }) => void;
}

function SupportedPlatforms({ platforms, onPlatformChange }: SupportedPlatformsProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPlatformChange({
            ...platforms,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Paper variant="elevation" sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6">Supported Platforms</Typography>
            <FormControlLabel control={<Checkbox checked={platforms.android} onChange={handleChange} name="android" />} label="Android" />
            <FormControlLabel control={<Checkbox checked={platforms.ios} onChange={handleChange} name="ios" />} label="iOS" />
            <FormControlLabel control={<Checkbox checked={platforms.web} onChange={handleChange} name="web" />} label="Web" />
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
