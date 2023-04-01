import "./home.css";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ShowArticles from "../showArticles";
import {
  Box,
  Container,
  Grid,
  Paper,
  InputBase,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [info, setInfo] = useState({}); //store all user infromation
  const [searchWord, setSearchWord] = useState(""); // search word
  const [searchResult, setSearchResult] = useState([]); //store all search result;
  const [subscribeEmail, setSubscribeEmail] = useState(""); //sotre email for subscribe newsletter

  let url = "http://localhost:5000/";
  //Sending Request To Backend
  async function sendRequest() {
    const res = await axios.get("http://localhost:5000/").catch((err) => {
      console.log(err);
    });
    if (!res) {
      return null;
    }
    const data = await res.data;
    return data;
  }

  //send info to backend

  async function sendInfoRequest() {
    const location = await locationInfo();
    console.log(location);
    localStorage.setItem("ip", `${location.ip}`);
    console.log(localStorage.getItem("ip"));

    const res = await axios.post(url + "info", location);
    console.log(res);
  }

  // request for get user location related infromation
  async function locationInfo() {
    const res = await axios.get("https://ipapi.co/json", {
      withCredentials: false,
    });
    if (!res.data) {
      return null;
    }

    return res.data;
  }

  //handle on change for search box
  const handleSearch = (event) => {
    setSearchWord(event.target.value);
    console.log(event.target.value);
  };
  //send search request
  async function sendSearchRequest() {
    let searchUrl = url + "search";
    try {
      const response = await axios.post(searchUrl, { data: searchWord });
      console.log(response.data.articles);
      if (response.status == 200) {
        setSearchResult(response.data.articles);
      }
    } catch (error) {
      console.log(error.response.data.message);
      setSearchResult([]);
    }
  }
  //button submit handle
  const searchSubmitHandle = () => {
    sendSearchRequest();
  };

  //handling subscribe option
  const handleSubscribeEmail = (event) => {
    setSubscribeEmail(event.target.value);
    console.log(subscribeEmail);
  };
  //send subscribe request
  async function sendSubscribeRequest() {
    let subscribeURL = url + "subscribe";
    try {
      const response = await axios.post(subscribeURL, { data: subscribeEmail });
      console.log(response);
      alert(response.data.message);
    } catch (error) {
      console.log(error.response);
      alert(error.response.data.message);
    }
  }
  //handle subscribe button
  const subscribeClickHandle = () => {
    sendSubscribeRequest();
  };

  useEffect(() => {
    sendRequest().then((data) => {
      if (data != null) {
        console.log(data.articles[0].author);
        console.log(data.articles);

        setArticles(data.articles);
      } else {
        console.log("Cannot Get Information from backend");
      }

      console.log("Loaded Home Page");

      if (!localStorage.getItem("ip")) {
        sendInfoRequest();
      }
    });
  }, []);

  return (
    <>
      <Container container>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "1rem",
            width: 300,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Articles"
            inputProps={{ "aria-label": "search articles" }}
            id="articleSearch"
            name="articleSearch"
            onChange={handleSearch}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={searchSubmitHandle}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <Grid mt={20}>
          
         {searchResult && <ShowArticles articles={searchResult} url={url} />}
          {articles && <ShowArticles articles={articles} url={url} />}
        </Grid>
      </Container>

      <div className="form-group">
        <label htmlFor="articleSearch"></label>
        <input
          type="text"
          id="articleSearch"
          name="articleSearch"
          onChange={handleSearch}
        />
        <button type="button" class="btn btn-info" onClick={searchSubmitHandle}>
          Search
        </button>
      </div>

      

      <div className="form-group">
        <label htmlFor="subscribe">Get Update Of Newest Articles</label>
        <input
          type="email"
          id="subscribe"
          name="subscribe"
          value={subscribeEmail}
          onChange={handleSubscribeEmail}
        />
        <button
          type="button"
          class="btn btn-info"
          onClick={subscribeClickHandle}
        >
          Subscribe
        </button>
      </div>
    </>
  );
}
