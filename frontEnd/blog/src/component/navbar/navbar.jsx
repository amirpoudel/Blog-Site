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
  Tooltip,
  IconButton
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import { useState } from "react";
import DrawerComp from "./drawerComp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountMenu from "./accountMenu";

let url = "http://localhost:5000/";
export default function Navbar() {
  const navigate = useNavigate();
  const pages = ["Latest", "Trending", "Most Read"];

  const [tabValue, SetTabValue] = useState(null);

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  console.log(isMatch);

  const drawerPages = [...pages, "Login", "Sign Up"];

  const [avatarImg, setAvatarImg] = useState("");

  // if user login then change avatar with user profile pic
  const user = useSelector((state) => {
    return state.auth;
  });
  console.log("State User From Navbar", user);
  let userImgPath;
  if (user.isLoggedIn) {
    userImgPath = url + user.user.profileImagePath;
  } else {
    userImgPath = "";
  }

  console.log(userImgPath);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <AppBar sx={{ bgcolor: "black" }} position="static">
        <Container>
          <Toolbar>
            <CodeOffIcon />
            <Typography
              noWrap={true}
              sx={{
                fontSize: "1.4rem",
                fontFamily: "monospace",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
              ml={1}
              variant="inherit"
              onClick={() => {
                SetTabValue(null); //reset tab value
                navigate("/");
              }}
            >
              codeArt
            </Typography>

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
                    return (
                      <Tab sx={{ color: "white" }} key={index} label={page} />
                    );
                  })}
                </Tabs>

                <Box sx={{ ml: "auto" }}>
                      {
                        user.isLoggedIn?(
                        <>
                        <AccountMenu imgPath = {userImgPath}/>
                        </>):(
                          <>
                          
                          <Avatar
                        src={userImgPath}
                        onClick={() => {
                          if (!user.isLoggedIn) {
                            navigate("/login");
                          } 
                        }}
                      />
                          </>
                        )
                      }
                      
                   
                </Box>

           

              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
