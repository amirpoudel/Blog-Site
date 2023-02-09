import { Link } from "react-router-dom";


export default function ShowArticles(props) {
  let articleUrl =  "article/";
  return (
    <>
      
      {props.articles.map((article) => {
        return (
          <>
        
            <div key={article._id} className="card" style={{ width: "18rem" }}>
        
              <img
                src={props.url + article.imagePath}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{`${article.body.slice(0, 50)}...`}</p>
                <p>{`-${article.author}`}</p>
                <Link to={articleUrl+article._id} className="btn btn-primary" >
                  Read More
                </Link>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}
