

const Notes = (props) => {
    return (
        <>
        {props.Notes.map((note)=> (
            <ul key={note.id}>
                <li>
                    <h1>{note.title}</h1>
                    <p>{note.body}</p>
                </li>
            </ul>
        ))}
        </>
    )
}

export default Notes