

export default function ShowComment(props){

    return(
        <>
            
            {
                props.comments.map(( comment)=>{
                    return(
                        <p>-{comment.comment}</p>
                    )
                    
                    
                })
            }
        </>
    )
}