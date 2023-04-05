import { Avatar, Button, Card,CardActions,CardContent,CardHeader,CardMedia, Container, Grid, Typography,Link } from "@mui/material";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ShowArticles(props) {
  let articleUrl =  "article/";
  const navigate = useNavigate();

  const imageURL = process.env.REACT_APP_URL 
 

  return (
    <>
     <Container>
            <Grid container rowGap={5}>
              {props.articles.map((article,index)=>{
                return (<>
                  <Grid  item  key={index} lg={4} md={6} sm={12} spacing={3}>
                    <Card raised sx={{width:300 , maxWidth:345, }}>
                      <CardHeader
                      avatar={
                        <Avatar src={imageURL+article.authorId.profileImagePath}>

                        </Avatar>
                        
                      } 
                      title={article.author}
                      subheader={article.date.split('T')[0]}
                      >
                        
                      </CardHeader>
                      <CardMedia
                        component="img"
                        height="194"
                      alt='image'
                      
                      image={props.url+article.imagePath}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component='div'>
                          {article.title}
                        </Typography>
                        <Typography variant="body2">
                          {`${article.body.slice(0,50)}....`}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button variant="outlined" size="small" onClick={()=>navigate(`${articleUrl+article._id}`)}>Read More</Button>
                        
                      </CardActions>

                      
                    </Card>
                  </Grid>
                </>)
              })}
            </Grid>
          </Container>
    
    </>
  );
}
