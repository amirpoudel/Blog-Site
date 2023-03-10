

export default function SearchResult(props){


    return (<>
      <div className="container">
        <h1>Blogs</h1>
        <ShowArticles articles={articles} url={url} />
      </div>
    </>)

}