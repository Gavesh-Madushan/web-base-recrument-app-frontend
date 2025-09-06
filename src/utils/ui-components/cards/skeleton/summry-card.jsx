import { Card, Grid, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

const SkeletonSummaryCard = () => (
    <Card sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 2 }}>
                <Grid container>
                    <Grid item xs={5}>
                        <ListItemText
                            sx={{ py: 0 }}
                            primary={<Skeleton variant="rectangular" height={20} />}
                            secondary={<Skeleton variant="text" height={40} />}
                        />
                    </Grid>
                    <Grid item xs={7} display="flex" justifyContent="end" alignItems="center">
                        <ListItemAvatar>
                            <Skeleton variant="rectangular" width={50} height={50} />
                        </ListItemAvatar>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemText
                    sx={{ py: 0 }}
                    primary={<Skeleton variant="rectangular" height={20} />}
                />
            </ListItem>
        </List>
    </Card>
);

export default SkeletonSummaryCard;