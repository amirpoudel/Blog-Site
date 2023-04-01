import "./navbar.css";

import {
  Grid,
  Box,
  Link,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  ButtonGroup,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  colors,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import { useState } from "react";
import DrawerComp from "./drawerComp";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const pages = ["Latest", "Trending", "Most Read"];

  const [tabValue, SetTabValue] = useState(null);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  console.log(isMatch);

  const drawerPages = [...pages, "Login", "Sign Up"];

  const [avatarImg,setAvatarImg] = useState("");
  
  return (
    <>
      <AppBar sx={{bgcolor:"black" }} position="static">
        <Container>
          <Toolbar>
            
            <CodeOffIcon />
            <Typography noWrap={true} sx={{fontSize:'1.4rem',fontFamily:'monospace',textDecoration:'none',color:'inherit',cursor:'pointer'}}  ml={1} variant="inherit" 
             onClick={()=>{
              SetTabValue(null);//reset tab value
              navigate("/")}} >codeArt</Typography>
            
            
            {isMatch ? (
              <>
                <DrawerComp pages={drawerPages} />
              </>
            ) : (
              <>
                <Tabs
                  value={tabValue}
                  
                  onChange={(e, value) => {
                    SetTabValue(value);
                  }}
                >
                  {pages.map((page, index) => {
                    return <Tab sx={{color:'white'}} key={index} label={page} />;
                  })}
                </Tabs>

                <Box sx={{ ml: "auto" }}>
                 
                  <Avatar src={avatarImg} sx={{cursor:'pointer'}} onClick={()=>{
                    navigate("/login")
                  }}/>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
