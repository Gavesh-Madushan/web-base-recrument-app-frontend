import { Card, Grid, List, ListItem, ListItemAvatar, ListItemText, Skeleton } from '@mui/material';

const SkeletonIncomeCard = () => (
    <Card sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 2 }}>
                <ListItemText
                    sx={{ py: 0 }}
                    primary={<Skeleton variant="rectangular" height={40} />}
                />
            </ListItem>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                    <Skeleton variant="rectangular" width={44} height={44} />
                </ListItemAvatar>
                <ListItemText
                    sx={{ py: 0 }}
                    primary={<Skeleton variant="rectangular" height={40} />}
                    secondary={<Skeleton variant="text" height={20} />}
                />
            </ListItem>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                        <ListItemAvatar>
                            <Skeleton variant="rectangular" width={44} height={44} />
                        </ListItemAvatar>
                        <ListItemText
                            sx={{ py: 0 }}
                            primary={<Skeleton variant="rectangular" height={40} />}
                            secondary={<Skeleton variant="text" height={20} />}
                        />
                    </ListItem>
                </Grid>
                <Grid item xs={6}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                        <ListItemAvatar>
                            <Skeleton variant="rectangular" width={44} height={44} />
                        </ListItemAvatar>
                        <ListItemText
                            sx={{ py: 0 }}
                            primary={<Skeleton variant="rectangular" height={40} />}
                            secondary={<Skeleton variant="text" height={20} />}
                        />
                    </ListItem>
                </Grid>
            </Grid>
        </List>
    </Card>
);

export default SkeletonIncomeCard;