export default function ShowGroup({group}){
    return(
        <div id='eventGroupPreview'>
            <div id="preview">
                <img src={group.previewImage} alt="" />
            </div>
            <div id='previewInfo'>
                <h4>{group.name}</h4>
                <p>{group.private ? 'Private':'Public'}</p>
            </div>
        </div>
    )
}
