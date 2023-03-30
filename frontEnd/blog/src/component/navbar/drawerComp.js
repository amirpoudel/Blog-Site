
import {Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,Typography,useMediaQuery,useTheme} from "@mui/material"
import { useState } from "react"
import MenuIcon from '@mui/icons-material/Menu';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import { Box } from "@mui/system";
export default function DrawerComp(props){
    const [openDrawer,setOpenDrawer] = useState(false);
    console.log(props.pages);

    
    return(<>
        <Drawer open={openDrawer} onClose={()=>{setOpenDrawer(false)}}>
            <List>
                <Box display='inline'>
                
            <Typography><CodeOffIcon/>Code Art</Typography>
                </Box>
           
                {
                    props.pages.map((page,index)=>{
                        return <>
                     
                    <ListItemButton onClick={()=>{setOpenDrawer(false)}} key={index}>
                        <ListItemIcon>
                            <ListItemText>
                                {page}
                            </ListItemText>
                        </ListItemIcon>
                    </ListItemButton>
       
                        </>
                    })
                }
                
            </List>
        </Drawer>
        <IconButton sx={{ml:'auto'}} onClick={()=>setOpenDrawer(!openDrawer)} ><MenuIcon/></IconButton>
    </>)
}