// diary.tsx

import { useState } from "react";

// selectedUSer 받아와서 return !
const Diary = ({ selectedUser }) => {
  const [user, setUser] = useState(selectedUser);
  const [editableText, setEditableText] = useState(selectedUser.bodyText);
  const [editableTitle, setEditableTitle] = useState(selectedUser.title);
  const [isTextEditMode, setIsTextEditMode] = useState(false);
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const handleTextChange = (event) => {
    setEditableText(event.target.value);
  };
  const handleTitleChange = (event) => {
    setEditableTitle(event.target.value);
  };

  const handleTextClick = () => {
    setIsTextEditMode(true);
    setIsEditMode(true);
  };

  const handleTitleClick = () => {
    setIsTitleEditMode(true);
    setIsEditMode(true);
  }

  const handleSave = () => {
    const updatedUser = { ...user, title: editableTitle, bodyText: editableText };
    setUser(updatedUser);
    
    fetch('http://3.38.118.228:8080/api/dailyReport/user', {
      method: 'PUT', // 수정된 내용을 저장하기 위해 PUT 요청을 사용합니다. API 요청 방식에 따라 다를 수 있습니다.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser), // 수정된 내용을 JSON 형식으로 변환하여 요청의 본문에 포함합니다.
    })
      .then((response) => response.json())
      .then((data) => {
        // 저장 후의 로직을 구현합니다.
        console.log('저장되었습니다.');
        // 필요한 추가적인 작업을 수행합니다.
      })
      .catch((error) => {
        // 에러 처리
        console.error('Error:', error);
      });

    
    // 저장이 완료되면 수정 모드를 해제합니다.
    setIsTextEditMode(false);
    setIsTitleEditMode(false);
    setIsEditMode(false);
  };

  return (
    <div className="dbDiary">
      <div className="dateBg">
        <p className="date">{user.date}</p>
      </div>
      {isTitleEditMode ? (
        <textarea
        className="title"
        value={editableTitle}
        onChange={handleTitleChange}
        style={{
          borderColor: "rgb(7, 45, 87, 0.2)"
        }}
        ></textarea>
      ) : (
        <p className="title" onClick={handleTitleClick}>
          {user.title}
        </p>
      )}
      {/* <p className="title">{user.title}</p> */}

      <hr className="line"></hr>

      {isTextEditMode ? (
        <textarea
          className="body"
          value={editableText}
          onChange={handleTextChange}
          style={{
            height: "500px",
            borderColor: "rgb(7, 45, 87, 0.2)"
          }}
        ></textarea>
      ) : (
        <p className="body" onClick={handleTextClick}>
          {user.bodyText}
        </p>
      )}

      {!isEditMode &&
        <div className="keywords">
          <p className="keyword1st">{user.keyword1st}</p>
          <p className="keyword2nd">{user.keyword2nd}</p>
          <p className="keyword3rd">{user.keyword3rd}</p>
        </div>
      }

      {isEditMode &&
        <button className="btnSave" onClick={handleSave} style={{
          alignSelf: "center"
        }}>
          저장하기
        </button>}
    </div>
  );
};


export default Diary;