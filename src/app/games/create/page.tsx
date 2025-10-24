"use client";

import { Avatar, Box, Button, ButtonBase, Card, CardContent, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Grid, Input, List, ListItem, ListItemIcon, ListItemText, MenuItem, Paper, Stack, TextField, Typography, Alert, CircularProgress, AlertTitle, IconButton, Collapse } from "@mui/material";
import React, { useState, useEffect } from "react";
import { CloudUpload, LooksOne, LooksTwo, Gamepad, ArrowBack, Android, Apple, Language as WebIcon, Info, Image as ImageIcon, CheckCircle, Save, Warning, Close, ErrorOutline } from "@mui/icons-material";
import { PlatformSupport } from "../page";
import { saveGameFormData, loadGameFormData, clearGameFormData, publishGame, getPublishedGames, updateGame } from '@/utils/gameLocalStorage';
import { useRouter, useSearchParams } from 'next/navigation';

interface PlatformConfigs {
    androidPackageName: string;
    androidDownloadUrl: string;
    iosPackageName: string;
    iosDownloadUrl: string;
    webUrl: string;
}

interface FirstPageProps {
    gameName: string;
    onGameNameChange: (name: string) => void;
    gameIntro: string;
    onGameIntroChange: (intro: string) => void;
    avatarSrc?: string;
    onAvatarUpdate: (src: string) => void;
    headerImage?: string;
    onHeaderImageUpdate: (src: string) => void;
    gameType: string;
    onGameTypeChange: (type: string) => void;
    platforms: PlatformSupport,
    onPlatformChange: (platforms: PlatformSupport) => void;
    platformConfigs: PlatformConfigs;
    onPlatformConfigsChange: (configs: PlatformConfigs) => void;
    screenshots: string[];
    onScreenshotsChange: (screenshots: string[]) => void;
}

function FirstPage({ gameName, onGameNameChange, gameIntro, onGameIntroChange, avatarSrc, onAvatarUpdate, headerImage, onHeaderImageUpdate, gameType, onGameTypeChange, platforms, onPlatformChange, platformConfigs, onPlatformConfigsChange, screenshots, onScreenshotsChange }: FirstPageProps) {
    return (
        <Grid container spacing={2} mt={2}>
            <Grid size={9}>
                <Stack spacing={3}>
                    <BasicInfo
                        gameName={gameName}
                        onGameNameChange={onGameNameChange}
                        gameIntro={gameIntro}
                        onGameIntroChange={onGameIntroChange}
                        gameType={gameType}
                        onGameTypeChange={onGameTypeChange}
                    />
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'grey.200'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    mb: 0.5,
                                    color: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                🎮 Game Icon
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Upload your game&apos;s icon (required)
                            </Typography>
                            <Divider />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <UploadAvatars onAvatarUpdate={onAvatarUpdate} initialAvatarSrc={avatarSrc} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Recommended size: 512x512px
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Format: PNG, JPG
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Max size: 5MB
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                    <HeaderImageUpload
                        headerImage={headerImage}
                        onHeaderImageUpdate={onHeaderImageUpdate}
                    />
                    <SupportedPlatforms
                        platforms={platforms}
                        onPlatformChange={onPlatformChange}
                        platformConfigs={platformConfigs}
                        onPlatformConfigsChange={onPlatformConfigsChange}
                    />
                    {(platforms.android == true || platforms.ios == true || platforms.web == true) && <DownloadConfig platforms={platforms} />}
                    <GameScreenshots
                        screenshots={screenshots}
                        onScreenshotsChange={onScreenshotsChange}
                    />
                    <Artifacts platforms={platforms} />
                </Stack>
            </Grid>
            <Grid size={3} sx={{ position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
                <Stack spacing={4}>
                    <LivePreview
                        name={gameName}
                        introduction={gameIntro}
                        avatarSrc={avatarSrc}
                        headerImage={headerImage}
                        platforms={platforms}
                        gameType={gameType}
                        platformConfigs={platformConfigs}
                        screenshots={screenshots}
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const editGameId = searchParams.get('id'); // 获取编辑的游戏 ID
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage] = useState(1);

    const [gameName, setGameName] = useState('');
    const [gameIntro, setGameIntro] = useState('');
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [headerImage, setHeaderImage] = useState<string | undefined>(undefined);
    const [gameType, setGameType] = useState('');
    const [platforms, setPlatforms] = useState(new PlatformSupport());
    const [platformConfigs, setPlatformConfigs] = useState({
        androidPackageName: '',
        androidDownloadUrl: '',
        iosPackageName: '',
        iosDownloadUrl: '',
        webUrl: ''
    });
    const [screenshots, setScreenshots] = useState<string[]>([]);

    const [open, setOpen] = React.useState(false);
    const [showAutoSaveHint, setShowAutoSaveHint] = useState(false);
    const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    
    // 审核拒绝相关状态
    const [gameStatus, setGameStatus] = useState<'published' | 'reviewing' | 'draft' | 'rejected'>('draft');
    const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined);
    const [rejectedAt, setRejectedAt] = useState<number | undefined>(undefined);
    const [showRejectionAlert, setShowRejectionAlert] = useState(true);

    // 从 Local Storage 加载数据（草稿或编辑模式）
    useEffect(() => {
        const loadGameData = () => {
            // 如果是编辑模式，加载已发布游戏数据
            if (editGameId) {
                console.log('📝 编辑模式，游戏 ID:', editGameId);
                setIsEditMode(true);

                const publishedGames = getPublishedGames();
                const gameToEdit = publishedGames.find(g => g.id === editGameId);

                if (gameToEdit) {
                    console.log('✅ 找到要编辑的游戏:', gameToEdit.gameName);
                    setGameName(gameToEdit.gameName)
                    setGameIntro(gameToEdit.gameIntro)
                    setGameType(gameToEdit.gameType)
                    setAvatarSrc(gameToEdit.avatarSrc || undefined)
                    setHeaderImage(gameToEdit.headerImage || undefined)
                    setPlatforms({
                        android: gameToEdit.platforms.android,
                        ios: gameToEdit.platforms.ios,
                        web: gameToEdit.platforms.web
                    })
                    setPlatformConfigs({
                        androidPackageName: gameToEdit.platformConfigs?.androidPackageName || '',
                        androidDownloadUrl: gameToEdit.platformConfigs?.androidDownloadUrl || '',
                        iosPackageName: gameToEdit.platformConfigs?.iosPackageName || '',
                        iosDownloadUrl: gameToEdit.platformConfigs?.iosDownloadUrl || '',
                        webUrl: gameToEdit.platformConfigs?.webUrl || ''
                    })
                    setScreenshots(gameToEdit.screenshots || [])
                    
                    // 加载审核状态和拒绝原因
                    setGameStatus(gameToEdit.status)
                    setRejectionReason(gameToEdit.rejectionReason)
                    setRejectedAt(gameToEdit.rejectedAt)
                    
                    console.log('📊 游戏状态:', gameToEdit.status);
                    if (gameToEdit.status === 'rejected') {
                        console.log('❌ 游戏被拒绝，原因:', gameToEdit.rejectionReason);
                    }
                    
                    return; // 编辑模式不加载草稿
                } else {
                    console.warn('⚠️ 未找到要编辑的游戏:', editGameId);
                }
            }

            // 非编辑模式，加载草稿数据
            const savedData = loadGameFormData()
            if (savedData) {
                setGameName(savedData.gameName)
                setGameIntro(savedData.gameIntro)
                setGameType(savedData.gameType)
                setAvatarSrc(savedData.avatarSrc || undefined)
                setHeaderImage(savedData.headerImage || undefined)
                setPlatforms({
                    android: savedData.platforms.android,
                    ios: savedData.platforms.ios,
                    web: savedData.platforms.web
                })
                setPlatformConfigs({
                    androidPackageName: savedData.platformConfigs?.androidPackageName || '',
                    androidDownloadUrl: savedData.platformConfigs?.androidDownloadUrl || '',
                    iosPackageName: savedData.platformConfigs?.iosPackageName || '',
                    iosDownloadUrl: savedData.platformConfigs?.iosDownloadUrl || '',
                    webUrl: savedData.platformConfigs?.webUrl || ''
                })
                setScreenshots(savedData.screenshots || [])
                console.log('📦 已从缓存恢复游戏表单数据')
            }
        };

        // 初始加载
        loadGameData();

        // 监听 storage 事件，当其他标签页修改了 localStorage 时重新加载
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'published_games' && editGameId) {
                console.log('🔄 检测到游戏数据变化（跨标签页），重新加载...');
                loadGameData();
            }
        };

        // 监听页面可见性变化，当页面重新可见时刷新数据
        const handleVisibilityChange = () => {
            if (!document.hidden && editGameId) {
                console.log('👁️ 页面重新可见，检查游戏状态...');
                loadGameData();
            }
        };

        // 定期检查游戏状态（每3秒），用于检测控制台修改
        let intervalId: NodeJS.Timeout | null = null;
        if (editGameId) {
            intervalId = setInterval(() => {
                const publishedGames = getPublishedGames();
                const currentGame = publishedGames.find(g => g.id === editGameId);
                if (currentGame && currentGame.status !== gameStatus) {
                    console.log('🔄 检测到游戏状态变化（控制台修改）:', currentGame.status);
                    loadGameData();
                }
            }, 3000); // 每3秒检查一次
        }

        window.addEventListener('storage', handleStorageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (intervalId) clearInterval(intervalId);
        };
    }, [editGameId, gameStatus])

    // 保存表单数据到 Local Storage（防抖）
    useEffect(() => {
        // 编辑模式下不自动保存草稿（避免覆盖其他草稿）
        if (isEditMode) {
            return;
        }

        // 显示自动保存提示
        setShowAutoSaveHint(true)

        const timer = setTimeout(() => {
            saveGameFormData({
                gameName,
                gameIntro,
                gameType,
                avatarSrc: avatarSrc || '',
                headerImage: headerImage || '',
                platforms: {
                    android: platforms.android,
                    ios: platforms.ios,
                    web: platforms.web
                },
                platformConfigs: {
                    androidPackageName: platformConfigs.androidPackageName,
                    androidDownloadUrl: platformConfigs.androidDownloadUrl,
                    iosPackageName: platformConfigs.iosPackageName,
                    iosDownloadUrl: platformConfigs.iosDownloadUrl,
                    webUrl: platformConfigs.webUrl
                },
                screenshots: screenshots,
                savedAt: Date.now()
            })
            // 隐藏提示
            setTimeout(() => setShowAutoSaveHint(false), 2000)
        }, 500)  // 500ms 防抖

        return () => clearTimeout(timer)
    }, [gameName, gameIntro, gameType, avatarSrc, headerImage, platforms, platformConfigs, screenshots, isEditMode])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (confirmed: boolean) => {
        setOpen(false);

        if (confirmed) {
            // 清除 localStorage
            clearGameFormData()
            // 重置表单
            setGameName('')
            setGameIntro('')
            setGameType('')
            setAvatarSrc(undefined)
            setHeaderImage(undefined)
            setPlatforms(new PlatformSupport())
            setPlatformConfigs({
                androidPackageName: '',
                androidDownloadUrl: '',
                iosPackageName: '',
                iosDownloadUrl: '',
                webUrl: ''
            })
            setScreenshots([])
            console.log('✅ 表单已重置，缓存已清除')
        }
    };

    const handleSaveDraft = () => {
        console.log('💾 保存草稿 - 编辑模式:', isEditMode, '游戏ID:', editGameId);
        
        // 如果是编辑模式（包括编辑被拒绝的游戏），更新原游戏状态为draft
        if (isEditMode && editGameId) {
            console.log('🔄 编辑模式：将游戏状态更新为draft');
            updateGame(editGameId, {
                gameName,
                gameIntro,
                gameType,
                avatarSrc: avatarSrc || '',
                headerImage: headerImage || '',
                platforms: {
                    android: platforms.android,
                    ios: platforms.ios,
                    web: platforms.web
                },
                platformConfigs: {
                    androidPackageName: platformConfigs.androidPackageName,
                    androidDownloadUrl: platformConfigs.androidDownloadUrl,
                    iosPackageName: platformConfigs.iosPackageName,
                    iosDownloadUrl: platformConfigs.iosDownloadUrl,
                    webUrl: platformConfigs.webUrl
                },
                screenshots: screenshots,
                savedAt: Date.now(),
                // 将状态设为草稿
                status: 'draft',
                // 清除拒绝相关字段
                rejectionReason: undefined,
                rejectedAt: undefined
            });
            
            // 更新本地状态
            setGameStatus('draft');
            setRejectionReason(undefined);
            setRejectedAt(undefined);
            setShowRejectionAlert(false);
            
            console.log('✅ 游戏已更新为草稿状态');
            
            // 触发游戏列表刷新
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('gamesListRefresh'));
            }
        } else {
            // 非编辑模式，保存为新草稿
            console.log('📝 新建模式：保存草稿到 game_form_data');
            saveGameFormData({
                gameName,
                gameIntro,
                gameType,
                avatarSrc: avatarSrc || '',
                headerImage: headerImage || '',
                platforms: {
                    android: platforms.android,
                    ios: platforms.ios,
                    web: platforms.web
                },
                platformConfigs: {
                    androidPackageName: platformConfigs.androidPackageName,
                    androidDownloadUrl: platformConfigs.androidDownloadUrl,
                    iosPackageName: platformConfigs.iosPackageName,
                    iosDownloadUrl: platformConfigs.iosDownloadUrl,
                    webUrl: platformConfigs.webUrl
                },
                screenshots: screenshots,
                savedAt: Date.now()
            });
            
            // 触发游戏列表刷新（新草稿会在游戏列表中显示）
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('gamesListRefresh'));
            }
        }
        
        setShowSaveDraftDialog(true);
    };

    const handleSubmitGame = () => {
        console.log('🎯 handleSubmitGame 被调用');
        console.log('📝 当前表单数据:', { gameName, gameType, avatarSrc, platforms });
        console.log('🔧 编辑模式:', isEditMode, '游戏 ID:', editGameId);

        // 验证必填字段
        if (!gameName || !gameType || !avatarSrc) {
            console.warn('⚠️ 验证失败：缺少必填字段');
            alert('Please fill in all required fields: Game Name, Game Type, and Game Icon')
            return
        }

        if (!platforms.android && !platforms.ios && !platforms.web) {
            console.warn('⚠️ 验证失败：未选择平台');
            alert('Please select at least one platform')
            return
        }

        console.log('✅ 验证通过，开始' + (isEditMode ? '更新' : '提交审核') + '游戏...');

        try {
            if (isEditMode && editGameId) {
                // 编辑模式：更新现有游戏
                console.log('🔄 更新游戏:', editGameId);
                updateGame(editGameId, {
                    gameName,
                    gameIntro,
                    gameType,
                    avatarSrc: avatarSrc || '',
                    headerImage: headerImage || '',
                    platforms: {
                        android: platforms.android,
                        ios: platforms.ios,
                        web: platforms.web
                    },
                    platformConfigs: {
                        androidPackageName: platformConfigs.androidPackageName,
                        androidDownloadUrl: platformConfigs.androidDownloadUrl,
                        iosPackageName: platformConfigs.iosPackageName,
                        iosDownloadUrl: platformConfigs.iosDownloadUrl,
                        webUrl: platformConfigs.webUrl
                    },
                    screenshots: screenshots,
                    savedAt: Date.now(),
                    // 如果是草稿或被拒绝的游戏提交/重新提交，更新状态为审核中
                    status: (gameStatus === 'draft' || gameStatus === 'rejected') ? 'reviewing' : gameStatus,
                    // 清除拒绝相关字段
                    rejectionReason: gameStatus === 'rejected' ? undefined : rejectionReason,
                    rejectedAt: gameStatus === 'rejected' ? undefined : rejectedAt
                });

                console.log('✅ Game updated successfully');
            } else {
                // 新建模式：提交审核
                console.log('🆕 创建新游戏并提交审核');
                const publishedGame = publishGame({
                    gameName,
                    gameIntro,
                    gameType,
                    avatarSrc: avatarSrc || '',
                    headerImage: headerImage || '',
                    platforms: {
                        android: platforms.android,
                        ios: platforms.ios,
                        web: platforms.web
                    },
                    platformConfigs: {
                        androidPackageName: platformConfigs.androidPackageName,
                        androidDownloadUrl: platformConfigs.androidDownloadUrl,
                        iosPackageName: platformConfigs.iosPackageName,
                        iosDownloadUrl: platformConfigs.iosDownloadUrl,
                        webUrl: platformConfigs.webUrl
                    },
                    screenshots: screenshots,
                    savedAt: Date.now()
                })

                console.log('✅ Game submitted for review:', publishedGame)
            }

            // 清除草稿（仅在新建模式下）
            if (!isEditMode) {
                clearGameFormData()
            }

            // 触发自定义事件通知游戏列表刷新
            window.dispatchEvent(new Event('gamesListRefresh'))

            // 显示成功对话框
            setShowSubmitDialog(true)
        } catch (error) {
            console.error('Failed to ' + (isEditMode ? 'update' : 'publish') + ' game:', error)
            alert('Failed to ' + (isEditMode ? 'update' : 'publish') + ' game. Please try again.')
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBack />}
                    variant="text"
                    color="primary"
                    href="/games"
                    sx={{ mb: 2 }}
                >
                    Back to My Games
                </Button>

                {/* Beautiful Title Card */}
                <Box sx={{ mb: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: 'white',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                transform: 'translate(30%, -30%)',
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Gamepad sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="h5"
                                        component="h1"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            letterSpacing: '-0.5px'
                                        }}
                                    >
                                        {isEditMode ? 'Edit Game' : 'Create New Game'}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            opacity: 0.95,
                                            fontWeight: 400
                                        }}
                                    >
                                        {isEditMode
                                            ? 'Update your game information and settings'
                                            : 'Submit your game to the platform and reach millions of players'}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Rejection Reason Alert */}
                {isEditMode && gameStatus === 'rejected' && rejectionReason && showRejectionAlert && (
                    <Box sx={{ mb: 3 }}>
                        <Collapse in={showRejectionAlert}>
                            <Alert
                                severity="error"
                                variant="filled"
                                icon={<ErrorOutline sx={{ fontSize: 28 }} />}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => setShowRejectionAlert(false)}
                                    >
                                        <Close fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{
                                    borderRadius: 3,
                                    py: 2,
                                    px: 3,
                                    boxShadow: 6,
                                    animation: 'slideDown 0.5s ease-out',
                                    '@keyframes slideDown': {
                                        from: { opacity: 0, transform: 'translateY(-20px)' },
                                        to: { opacity: 1, transform: 'translateY(0)' }
                                    }
                                }}
                            >
                                <AlertTitle sx={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1
                                }}>
                                    <Warning sx={{ fontSize: 24 }} />
                                    审核未通过 - Review Rejected
                                </AlertTitle>
                                <Box sx={{ ml: 4 }}>
                                    <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500 }}>
                                        您的游戏未通过审核，请根据以下原因进行修改后重新提交：
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 2,
                                            mb: 1.5
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ 
                                            color: 'white',
                                            fontWeight: 500,
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            📋 拒绝原因：{rejectionReason}
                                        </Typography>
                                    </Paper>
                                    {rejectedAt && (
                                        <Typography variant="caption" sx={{ 
                                            opacity: 0.9,
                                            display: 'block'
                                        }}>
                                            ⏰ 拒绝时间：{new Date(rejectedAt).toLocaleString('zh-CN')}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
                                        💡 提示：修改完成后，点击"重新提交审核"按钮即可再次提交
                                    </Typography>
                                </Box>
                            </Alert>
                        </Collapse>
                    </Box>
                )}

                {/* Auto-save Indicator */}
                {showAutoSaveHint && (
                    <Box sx={{ mb: 2 }}>
                        <Alert
                            severity="success"
                            variant="filled"
                            sx={{
                                borderRadius: 2,
                                py: 0.5,
                                animation: 'fadeIn 0.3s ease-in-out',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0, transform: 'translateY(-10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                },
                                '& .MuiAlert-message': {
                                    fontSize: '0.875rem'
                                }
                            }}
                        >
                            💾 Draft auto-saved
                        </Alert>
                    </Box>
                )}

                {currentPage === 1 && (
                    <FirstPage
                        gameName={gameName}
                        onGameNameChange={setGameName}
                        gameIntro={gameIntro}
                        onGameIntroChange={setGameIntro}
                        avatarSrc={avatarSrc}
                        onAvatarUpdate={setAvatarSrc}
                        headerImage={headerImage}
                        onHeaderImageUpdate={setHeaderImage}
                        gameType={gameType}
                        onGameTypeChange={setGameType}
                        platforms={platforms}
                        onPlatformChange={setPlatforms}
                        platformConfigs={platformConfigs}
                        onPlatformConfigsChange={setPlatformConfigs}
                        screenshots={screenshots}
                        onScreenshotsChange={setScreenshots}
                    />
                )}
                {currentPage === 2 && <SecondPage />}
                {currentPage > 2 && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                        <Typography variant="h6">✅ Step Completed</Typography>
                    </Alert>
                )}

                {/* Bottom Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    pt: 4,
                    borderTop: '2px solid',
                    borderColor: 'divider',
                    mt: 5
                }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            href="/games"
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            Go Back to My Games
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClickOpen}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            Reset Form
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleSaveDraft}
                            startIcon={<Save />}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            Save Draft
                        </Button>
                        <Dialog
                            open={open}
                            onClose={() => handleClose(false)}
                            maxWidth="sm"
                            fullWidth
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    p: 2
                                }
                            }}
                        >
                            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                                <Typography fontSize={20} fontWeight={700} color="error.main">
                                    Discard Changes?
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{ textAlign: 'center', py: 2 }}>
                                    All changes on this page will not be saved. This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    onClick={() => handleClose(false)}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleClose(true)}
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Confirm Reset
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={handleSubmitGame}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                minWidth: 160,
                                background: (isEditMode && gameStatus === 'rejected')
                                    ? 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)'
                                    : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                }
                            }}
                        >
                            {isEditMode 
                                ? (gameStatus === 'rejected' 
                                    ? '🔄 重新提交审核' 
                                    : gameStatus === 'draft'
                                    ? 'Submit for Review'
                                    : 'Update Game')
                                : 'Submit for Review'}
                        </Button>
                    </Box>
                </Box>

                {/* 保存草稿成功弹窗 */}
                <Dialog
                    open={showSaveDraftDialog}
                    onClose={() => setShowSaveDraftDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    bgcolor: 'info.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: 'bounce 1s ease-in-out',
                                    '@keyframes bounce': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                    }
                                }}
                            >
                                <Save sx={{ fontSize: 40, color: 'info.main' }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} color="info.main">
                                Draft Saved!
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body1" paragraph>
                                Your game draft has been saved successfully.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                You can continue editing and submit when you&apos;re ready.
                            </Typography>
                            <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                                <Typography variant="body2">
                                    💡 Your draft is automatically saved. You can access it anytime by returning to this page.
                                </Typography>
                            </Alert>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowSaveDraftDialog(false)}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1
                            }}
                        >
                            Continue Editing
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setShowSaveDraftDialog(false)}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1,
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 提交成功弹窗 */}
                <Dialog
                    open={showSubmitDialog}
                    onClose={() => {
                        setShowSubmitDialog(false)
                        router.push('/games')
                    }}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            p: 2
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'success.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: 'bounce 1s ease-in-out',
                                    '@keyframes bounce': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                    }
                                }}
                            >
                                <CheckCircle sx={{ fontSize: 50, color: 'success.main' }} />
                            </Box>
                            <Typography variant="h5" fontWeight={700} color="success.main">
                                {isEditMode 
                                    ? (gameStatus === 'rejected' 
                                        ? 'Game Resubmitted for Review!' 
                                        : gameStatus === 'draft'
                                        ? 'Game Submitted for Review!'
                                        : 'Game Updated Successfully!')
                                    : 'Game Submitted for Review!'}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body1" paragraph>
                                {isEditMode
                                    ? (gameStatus === 'rejected' 
                                        ? '🎉 Your game has been resubmitted for review!'
                                        : gameStatus === 'draft'
                                        ? '🎉 Congratulations! Your game has been submitted for review.'
                                        : '✅ Your game has been updated successfully.')
                                    : '🎉 Congratulations! Your game has been submitted for review.'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {isEditMode
                                    ? (gameStatus === 'rejected' || gameStatus === 'draft'
                                        ? 'Your game will be reviewed by our team. You can track the status in your game list.'
                                        : 'You can now view the updated game in your game list.')
                                    : 'Your game will be reviewed by our team. You can track the status in your game list.'}
                            </Typography>
                            <Alert severity={isEditMode && gameStatus !== 'rejected' && gameStatus !== 'draft' ? "success" : "info"} sx={{ mt: 2, textAlign: 'left' }}>
                                <Typography variant="body2">
                                    {isEditMode && gameStatus !== 'rejected' && gameStatus !== 'draft'
                                        ? '💫 All changes have been saved and applied.'
                                        : '⏳ Review typically takes 3-5 business days. You will be notified once approved.'}
                                </Typography>
                            </Alert>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setShowSubmitDialog(false)
                                router.push('/games')
                            }}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.2,
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                fontWeight: 600
                            }}
                        >
                            Go to My Games
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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

function BasicInfo({ gameName, onGameNameChange, gameIntro, onGameIntroChange, gameType, onGameTypeChange }: BasicInfoProps) {
    return (
        <Paper
            elevation={2}
            sx={{
                flex: 3,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            {/* Section Title */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    📋 Basic Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enter your game&apos;s name, type, and introduction
                </Typography>
                <Divider />
            </Box>
            <Grid container component="form" spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <TextField
                        label="Game Name"
                        fullWidth
                        value={gameName}
                        onChange={(e) => onGameNameChange(e.target.value)}
                        placeholder="Enter your game name"
                        required
                        helperText="* Required field"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                        select
                        label="Game Type"
                        fullWidth
                        value={gameType}
                        onChange={(e) => onGameTypeChange(e.target.value)}
                        required
                        helperText="* Required field"
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
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        multiline
                        label="Game Introduction"
                        minRows={5}
                        value={gameIntro}
                        onChange={(e) => onGameIntroChange(e.target.value)}
                        placeholder="Describe your game, gameplay features, and what makes it unique..."
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

interface LivePreviewProps {
    name: string;
    introduction: string;
    avatarSrc?: string;
    headerImage?: string;
    platforms: PlatformSupport;
    gameType: string;
    platformConfigs: PlatformConfigs;
    screenshots: string[];
}

function LivePreview({ name, introduction, avatarSrc, headerImage, platforms, gameType, platformConfigs, screenshots }: LivePreviewProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                flex: 1,
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}
                >
                    👁️ Live Preview
                </Typography>
            </Box>

            {/* Header Image */}
            {headerImage ? (
                <Box
                    sx={{
                        width: '100%',
                        height: 140,
                        position: 'relative' as const,
                        bgcolor: 'grey.200'
                    }}
                >
                    <Box
                        component="img"
                        src={headerImage}
                        alt="Game Header"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        height: 140,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Header Image Preview
                    </Typography>
                </Box>
            )}

            {/* Content */}
            <Box sx={{ p: 2.5 }}>
                {/* Game Icon & Title */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar
                        src={avatarSrc}
                        variant="rounded"
                        sx={{
                            width: 60,
                            height: 60,
                            border: '2px solid',
                            borderColor: avatarSrc ? 'primary.main' : 'grey.300',
                            boxShadow: avatarSrc ? 2 : 0
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.2 }}>
                            {name || 'Game Name'}
                        </Typography>
                        <Chip
                            label={gameType || 'Type'}
                            size="small"
                            color="primary"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                    </Box>
                </Box>

                {/* Start Game Button */}
                <Button
                    variant="contained"
                    fullWidth
                    disabled
                    sx={{
                        mb: 2,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                    }}
                >
                    Start Game
                </Button>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label="All" size="small" color="primary" sx={{ borderRadius: 1 }} />
                        <Chip label="Videos" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                        <Chip label="Info" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                    </Box>
                </Box>

                {/* Game Introduction */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ mb: 0.5, display: 'block' }}>
                        Game Introduction
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.8rem',
                            lineHeight: 1.5,
                            minHeight: 60,
                            maxHeight: 120,
                            overflow: 'auto'
                        }}
                    >
                        {introduction || 'Game introduction will appear here...'}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Screenshots Preview */}
                {screenshots.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ mb: 1, display: 'block' }}>
                            Screenshots ({screenshots.length})
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 0.5, 
                            overflowX: 'auto',
                            pb: 1,
                            '&::-webkit-scrollbar': {
                                height: 4
                            },
                            '&::-webkit-scrollbar-thumb': {
                                bgcolor: 'primary.main',
                                borderRadius: 2
                            }
                        }}>
                            {screenshots.map((screenshot, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={screenshot}
                                    alt={`Screenshot ${idx + 1}`}
                                    sx={{
                                        width: 80,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            zIndex: 1
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {screenshots.length > 0 && <Divider sx={{ mb: 2 }} />}

                {/* Platforms */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ mb: 1, display: 'block' }}>
                        Available Platforms
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {platforms.android && (
                            <Chip
                                icon={<Android />}
                                label="Android"
                                size="small"
                                color="success"
                                variant="filled"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        )}
                        {platforms.ios && (
                            <Chip
                                icon={<Apple />}
                                label="iOS"
                                size="small"
                                color="primary"
                                variant="filled"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        )}
                        {platforms.web && (
                            <Chip
                                icon={<WebIcon />}
                                label="Web"
                                size="small"
                                color="info"
                                variant="filled"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        )}
                        {!platforms.android && !platforms.ios && !platforms.web && (
                            <Typography variant="caption" color="text.secondary">
                                No platform selected
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Download Info */}
                {(platformConfigs.androidDownloadUrl || platformConfigs.iosDownloadUrl || platformConfigs.webUrl) && (
                    <>
                        <Divider sx={{ mb: 2 }} />
                        <Box>
                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ mb: 1, display: 'block' }}>
                                Download Links
                            </Typography>
                            <Stack spacing={0.5}>
                                {platformConfigs.androidDownloadUrl && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Android sx={{ fontSize: 14, color: 'success.main' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                            Google Play
                                        </Typography>
                                    </Box>
                                )}
                                {platformConfigs.iosDownloadUrl && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Apple sx={{ fontSize: 14, color: 'primary.main' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                            App Store
                                        </Typography>
                                    </Box>
                                )}
                                {platformConfigs.webUrl && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <WebIcon sx={{ fontSize: 14, color: 'info.main' }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                            Web Version
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
}

interface UploadAvatarsProps {
    onAvatarUpdate: (src: string) => void;
    initialAvatarSrc?: string;
}

interface HeaderImageUploadProps {
    headerImage?: string;
    onHeaderImageUpdate: (src: string) => void;
}

function HeaderImageUpload({ headerImage, onHeaderImageUpdate }: HeaderImageUploadProps) {
    const [previewSrc, setPreviewSrc] = useState<string | undefined>(headerImage);

    useEffect(() => {
        setPreviewSrc(headerImage);
    }, [headerImage]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Header image file size should not exceed 10MB')
                return
            }

            // Convert to base64 for local preview
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setPreviewSrc(result);
                onHeaderImageUpdate(result);
                console.log('✅ Header image uploaded (base64 preview)')
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    🖼️ Header Image
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload a header image for your game&apos;s detail page
                </Typography>
                <Divider />
            </Box>

            {/* Preview or Upload Area */}
            {!previewSrc ? (
                <Card
                    variant="outlined"
                    sx={{
                        border: '3px dashed',
                        borderColor: 'grey.300',
                        textAlign: 'center',
                        p: 4,
                        bgcolor: 'grey.50',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                        }
                    }}
                >
                    <CardContent>
                        <ImageIcon
                            sx={{
                                fontSize: 56,
                                color: 'primary.main',
                                mb: 2,
                                opacity: 0.6
                            }}
                        />
                        <input
                            type="file"
                            id="header-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="contained"
                            component="label"
                            htmlFor="header-upload"
                            startIcon={<CloudUpload />}
                            size="large"
                            sx={{
                                mb: 2,
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            Upload Header Image
                        </Button>
                        <Typography variant="body1" color="text.primary" gutterBottom fontWeight={500}>
                            Click to upload header image
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Supports JPG, PNG formats • Max 10MB
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box>
                    {/* Preview Area */}
                    <Box
                        sx={{
                            width: '100%',
                            height: 280,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 2,
                            border: '3px solid',
                            borderColor: 'primary.main',
                            boxShadow: 4,
                            position: 'relative' as const,
                            bgcolor: 'grey.100'
                        }}
                    >
                        <Box
                            component="img"
                            src={previewSrc}
                            alt="Header Preview"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                        {/* Success Badge */}
                        <Chip
                            icon={<CheckCircle />}
                            label="Uploaded"
                            color="success"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                fontWeight: 700
                            }}
                        />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <input
                            type="file"
                            id="header-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            htmlFor="header-upload"
                            startIcon={<CloudUpload />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                px: 3,
                                py: 1
                            }}
                        >
                            Change Image
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                setPreviewSrc(undefined)
                                onHeaderImageUpdate('')
                            }}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                px: 3,
                                py: 1
                            }}
                        >
                            Remove
                        </Button>
                    </Box>
                </Box>
            )}

            {previewSrc && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                    💡 Recommended: 16:9 aspect ratio (e.g., 1920x1080px), JPG or PNG format, max 10MB
                </Typography>
            )}
        </Paper>
    );
}

function UploadAvatars({ onAvatarUpdate, initialAvatarSrc }: UploadAvatarsProps) {
    const [previewSrc, setPreviewSrc] = useState<string | undefined>(initialAvatarSrc);

    useEffect(() => {
        setPreviewSrc(initialAvatarSrc);
    }, [initialAvatarSrc]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Icon file size should not exceed 5MB')
                return
            }

            // Convert to base64 for local preview
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setPreviewSrc(result);
                onAvatarUpdate(result);
                console.log('✅ Game icon uploaded (base64 preview)')
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <ButtonBase
                component="label"
                role={undefined}
                tabIndex={-1}
                aria-label="Avatar image"
                sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                    '&:has(:focus-visible)': {
                        outline: '3px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '4px',
                    },
                }}
            >
                <Avatar
                    alt="Upload new avatar"
                    src={previewSrc}
                    sx={{
                        width: 100,
                        height: 100,
                        border: '3px solid',
                        borderColor: previewSrc ? 'primary.main' : 'grey.300',
                        boxShadow: previewSrc ? 3 : 0,
                        transition: 'all 0.3s ease'
                    }}
                />
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
            <Chip
                label="Click to upload"
                size="small"
                color="primary"
                sx={{
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                }}
            />
        </Box>
    );
}

interface GameScreenshotsProps {
    screenshots: string[];
    onScreenshotsChange: (screenshots: string[]) => void;
}

function GameScreenshots({ screenshots, onScreenshotsChange }: GameScreenshotsProps) {
    const [uploading, setUploading] = useState(false);

    const handleScreenshotsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const newScreenshots: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file size (5MB per screenshot)
                if (file.size > 5 * 1024 * 1024) {
                    alert(`Screenshot ${file.name} exceeds 5MB`);
                    continue;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert(`File ${file.name} is not an image`);
                    continue;
                }

                // Convert to base64
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                const base64 = await base64Promise;
                newScreenshots.push(base64);
            }

            onScreenshotsChange([...screenshots, ...newScreenshots]);
            console.log(`✅ Uploaded ${newScreenshots.length} screenshot(s)`);
        } catch (error) {
            console.error('Screenshot upload failed:', error);
            alert('Screenshot upload failed, please retry');
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleRemoveScreenshot = (index: number) => {
        onScreenshotsChange(screenshots.filter((_, i) => i !== index));
    };

    return (
        <Paper
            elevation={2}
            sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    📸 Game Screenshots
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload screenshots to showcase your game ({screenshots.length} uploaded)
                </Typography>
                <Divider />
            </Box>

            {/* Upload Button */}
            <Card
                variant="outlined"
                sx={{
                    border: '3px dashed',
                    borderColor: screenshots.length > 0 ? 'primary.main' : 'grey.300',
                    textAlign: 'center',
                    p: 4,
                    bgcolor: screenshots.length > 0 ? 'primary.50' : 'grey.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                    }
                }}
            >
                <CardContent>
                    <ImageIcon
                        sx={{
                            fontSize: 56,
                            color: 'primary.main',
                            mb: 2,
                            opacity: 0.6
                        }}
                    />
                    <input
                        type="file"
                        id="screenshots-upload"
                        accept="image/*"
                        multiple
                        onChange={handleScreenshotsChange}
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        component="label"
                        htmlFor="screenshots-upload"
                        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                        disabled={uploading}
                        size="large"
                        sx={{
                            mb: 2,
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Choose Screenshots to Upload'}
                    </Button>
                    <Typography variant="body1" color="text.primary" gutterBottom fontWeight={500}>
                        Click to upload or drag files to this area
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Supports JPG, PNG formats • Max 5MB per file
                    </Typography>
                </CardContent>
            </Card>

            {/* Screenshots Grid */}
            {screenshots.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.primary"
                        sx={{ mb: 2 }}
                    >
                        📎 Uploaded Screenshots ({screenshots.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {screenshots.map((screenshot, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        position: 'relative' as const,
                                        transition: 'all 0.3s ease',
                                        border: '2px solid',
                                        borderColor: 'grey.200',
                                        '&:hover': {
                                            boxShadow: 4,
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 180,
                                            overflow: 'hidden',
                                            bgcolor: 'grey.100',
                                            position: 'relative' as const
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={screenshot}
                                            alt={`Screenshot ${idx + 1}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                        {/* Screenshot Number Badge */}
                                        <Chip
                                            label={`#${idx + 1}`}
                                            size="small"
                                            color="primary"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                left: 8,
                                                fontWeight: 700
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                Screenshot {idx + 1}
                                            </Typography>
                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() => handleRemoveScreenshot(idx)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    fontSize: '0.75rem',
                                                    borderRadius: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 600
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {screenshots.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        💡 Tip: Upload 3-6 high-quality screenshots to showcase your game&apos;s features and gameplay.
                    </Typography>
                </Alert>
            )}
        </Paper>
    );
}

function Artifacts({ platforms }: { platforms: PlatformSupport }) {
    const AndroidInstaller = () => (
        <Grid size={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Android sx={{ color: 'success.main', fontSize: 28 }} />
                    <Typography variant="subtitle1" fontWeight={600}>Android Installer</Typography>
                </Box>
                <TextField
                    label="Package File"
                    fullWidth
                    placeholder="Select APK file"
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        File Size: N/A MB
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Upload Time: 2024-09-25 14:30
                    </Typography>
                </Box>
            </Card>
        </Grid>
    );

    const IosInstaller = () => (
        <Grid size={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Apple sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="subtitle1" fontWeight={600}>iOS Installer</Typography>
                </Box>
                <TextField
                    label="Package File"
                    fullWidth
                    placeholder="Select IPA file"
                    disabled
                />
            </Card>
        </Grid>
    );

    const WebApp = () => (
        <Grid size={12}>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <WebIcon sx={{ color: 'info.main', fontSize: 28 }} />
                    <Typography variant="subtitle1" fontWeight={600}>Web Application</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{
                        width: '100%',
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    Upload Artifacts
                    <Input
                        type="file"
                        hidden
                    />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    💡 The homepage should be index.html
                </Typography>
            </Card>
        </Grid>
    );

    return (
        <Paper
            elevation={2}
            sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    📦 Artifacts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload installation packages for different platforms
                </Typography>
                <Divider />
            </Box>
            <Grid container spacing={2}>
                {platforms.android && <AndroidInstaller />}
                {platforms.ios && <IosInstaller />}
                {platforms.web && <WebApp />}
            </Grid>
        </Paper>
    );
}

function Tips() {
    return (
        <Paper
            elevation={2}
            sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                bgcolor: 'info.50'
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: 'info.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    💡 Tips
                </Typography>
            </Box>
            <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <LooksOne color="info" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Fill all required fields"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <LooksTwo color="info" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Upload clear game screenshots"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Info color="info" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Your draft is auto-saved"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Review takes 3-5 business days"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItem>
            </List>
        </Paper>
    );
}

interface SupportedPlatformsProps {
    platforms: PlatformSupport;
    onPlatformChange: (platforms: PlatformSupport) => void;
    platformConfigs: PlatformConfigs,
    onPlatformConfigsChange: (configs: PlatformConfigs) => void;
}

function SupportedPlatforms({ platforms, onPlatformChange, platformConfigs, onPlatformConfigsChange }: SupportedPlatformsProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPlatformChange({
            ...platforms,
            [event.target.name]: event.target.checked,
        });
    };

    const handleConfigChange = (field: string, value: string) => {
        onPlatformConfigsChange({
            ...platformConfigs,
            [field]: value
        });
    };

    return (
        <Paper
            elevation={2}
            sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    📱 Supported Platforms & Download Links
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select platforms and configure download information
                </Typography>
                <Divider />
            </Box>
            <Stack spacing={3}>
                {/* Android */}
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
                    <FormControlLabel
                        control={<Checkbox checked={platforms.android} onChange={handleChange} name="android" />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Android color="success" />
                                <Typography fontWeight={600}>Android</Typography>
                            </Box>
                        }
                    />
                    {platforms.android && (
                        <Box sx={{ mt: 2, ml: 4 }}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Package Name"
                                        placeholder="com.example.game"
                                        value={platformConfigs.androidPackageName}
                                        onChange={(e) => handleConfigChange('androidPackageName', e.target.value)}
                                        required
                                        helperText="* Required field"
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Download URL"
                                        placeholder="https://play.google.com/store/apps/details?id=..."
                                        value={platformConfigs.androidDownloadUrl}
                                        onChange={(e) => handleConfigChange('androidDownloadUrl', e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Card>

                {/* iOS */}
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
                    <FormControlLabel
                        control={<Checkbox checked={platforms.ios} onChange={handleChange} name="ios" />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Apple color="primary" />
                                <Typography fontWeight={600}>iOS</Typography>
                            </Box>
                        }
                    />
                    {platforms.ios && (
                        <Box sx={{ mt: 2, ml: 4 }}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Bundle ID"
                                        placeholder="com.example.game"
                                        value={platformConfigs.iosPackageName}
                                        onChange={(e) => handleConfigChange('iosPackageName', e.target.value)}
                                        required
                                        helperText="* Required field"
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Download URL"
                                        placeholder="https://apps.apple.com/app/..."
                                        value={platformConfigs.iosDownloadUrl}
                                        onChange={(e) => handleConfigChange('iosDownloadUrl', e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Card>

                {/* Web */}
                <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
                    <FormControlLabel
                        control={<Checkbox checked={platforms.web} onChange={handleChange} name="web" />}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WebIcon color="info" />
                                <Typography fontWeight={600}>Web</Typography>
                            </Box>
                        }
                    />
                    {platforms.web && (
                        <Box sx={{ mt: 2, ml: 4 }}>
                            <TextField
                                fullWidth
                                label="Game URL"
                                placeholder="https://game.example.com"
                                value={platformConfigs.webUrl}
                                onChange={(e) => handleConfigChange('webUrl', e.target.value)}
                                required
                                helperText="* Required field"
                                size="small"
                            />
                        </Box>
                    )}
                </Card>
            </Stack>
        </Paper>
    );
}

function DownloadConfig({ platforms }: { platforms: PlatformSupport }) {
    const AndroidConfig = () => (
        <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Android sx={{ color: 'success.main', fontSize: 26 }} />
                <Typography variant="subtitle1" fontWeight={600}>Android Configuration</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Package Name"
                        placeholder="com.example.game"
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        select
                        label="Minimum SDK Version"
                        fullWidth
                        defaultValue=""
                    >
                        <MenuItem value="">Select SDK Version</MenuItem>
                        <MenuItem value="21">Android 5.0 (API 21)</MenuItem>
                        <MenuItem value="23">Android 6.0 (API 23)</MenuItem>
                        <MenuItem value="26">Android 8.0 (API 26)</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Card>
    );

    const IosConfig = () => (
        <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Apple sx={{ color: 'primary.main', fontSize: 26 }} />
                <Typography variant="subtitle1" fontWeight={600}>iOS Configuration</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Bundle ID"
                        placeholder="com.example.game"
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        select
                        label="Minimum iOS Version"
                        fullWidth
                        defaultValue=""
                    >
                        <MenuItem value="">Select iOS Version</MenuItem>
                        <MenuItem value="13">iOS 13.0</MenuItem>
                        <MenuItem value="14">iOS 14.0</MenuItem>
                        <MenuItem value="15">iOS 15.0</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Card>
    );

    const WebConfig = () => (
        <Card variant="outlined" sx={{ p: 2.5, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <WebIcon sx={{ color: 'info.main', fontSize: 26 }} />
                <Typography variant="subtitle1" fontWeight={600}>Web Configuration</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="URL"
                        placeholder="https://game.example.com"
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        select
                        label="Supported Browsers"
                        fullWidth
                        defaultValue=""
                    >
                        <MenuItem value="">Select Browser</MenuItem>
                        <MenuItem value="chrome">Chrome</MenuItem>
                        <MenuItem value="firefox">Firefox</MenuItem>
                        <MenuItem value="safari">Safari</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Card>
    );

    return (
        <Paper
            elevation={2}
            sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    ⚙️ Download Configurations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Configure platform-specific settings
                </Typography>
                <Divider />
            </Box>
            <Stack spacing={3}>
                {platforms.android && <AndroidConfig />}
                {platforms.ios && <IosConfig />}
                {platforms.web && <WebConfig />}
            </Stack>
        </Paper>
    );
}
