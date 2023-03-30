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
      <AppBar sx={{ bgcolor: "white" }} position="static">
        <Container>
          <Toolbar>
            
            <CodeOffIcon />
            <Typography noWrap={true} sx={{fontSize:'1.4rem',fontFamily:'monospace',textDecoration:'none',color:'inherit',cursor:'pointer'}}  ml={1} variant="inherit" 
             onClick={()=>{navigate("/")}} >codeArt</Typography>
            
            
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
                    return <Tab key={index} label={page} />;
                  })}
                </Tabs>

                <Box sx={{ ml: "auto" }}>
                  {/* <Button
                    variant="contained"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Sign Up
                  </Button> */}
                  <Avatar src={avatarImg} />
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
