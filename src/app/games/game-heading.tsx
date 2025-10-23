import { Button, Grid, Typography, Box, Stack } from "@mui/material";
import Link from 'next/link';

export default function GameHeading({ heading, subheading, actions }: { heading: string, subheading: string, actions?: string[] }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>

            {/* 左侧标题部分 */}
            <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Typography variant="h4">
                    {heading}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    {subheading}
                </Typography>
            </Box>

            {/* 右侧按钮部分 */}
            <Box>
                 <Stack direction="row" spacing={1}>
                    {actions && actions.map((action) => (
                        action === "New Game" ? (
                            // 移除 legacyBehavior, passHref 通常也不再需要显式添加
                            // Button 直接作为 Link 的子元素
                            <Link key={action} href="/games/create">
                                <Button variant="outlined"> {/* 移除 component="a" */}
                                    {action}
                                </Button>
                            </Link>
                        ) : (
                            <Button key={action} variant="outlined">
                                {action}
                            </Button>
                        )
                    ))}
                 </Stack>
            </Box>
        </Box>
    );
}