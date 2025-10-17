import { Button, Grid, Typography } from "@mui/material";

export default function GameHeading({ heading, subheading, actions }: { heading: string, subheading: string, actions: string[] }) {
    return (
        <Grid container spacing={2} sx={{ alignItems: "center", marginBottom: 2 }}>
            <Grid container size={4}>
                <Typography variant="h4">
                    {heading}
                </Typography>
                <Typography variant="h6">
                    {subheading}
                </Typography>
            </Grid>
            <Grid container size="grow">
            </Grid>
            <Grid container size="grow" sx={{ justifyContent: 'end' }}>
                {actions.map((action) => {
                    return <Button variant="outlined">{action}</Button>
                })}
            </Grid>
        </Grid>
    );
}