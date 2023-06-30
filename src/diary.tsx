
// selectedUSer 받아와서 return !
const Diary = ({selectedUser}) => {
  return(
    <div className="dbDiary">
      <div className="dateBg">
        <p className="date">{selectedUser.date}</p>
      </div>

      <p className="title">{selectedUser.title}</p>
      
      <hr className="line"></hr>

      <p className="body">{selectedUser.bodyText}</p>

      <div className="keywords">
        <p className="keyword1st">{selectedUser.keyword1st}</p>
        <p className="keyword2nd">{selectedUser.keyword2nd}</p>
        <p className="keyword3rd">{selectedUser.keyword3rd}</p>
      </div>

      {/* <p>{selectedUser.time}</p> */}
    </div>
  )
}

export default Diary;