// diary.tsx

import { useState, useEffect } from "react";
import html2canvas from "html2canvas";

// selectedUSer 받아와서 return !
const Diary = ({ selectedUser }) => {
  const [user, setUser] = useState(selectedUser);
  const [editableText, setEditableText] = useState(selectedUser.bodyText);
  const [editableTitle, setEditableTitle] = useState(selectedUser.title);
  const [isTextEditMode, setIsTextEditMode] = useState(false);
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageData, setImageData] = useState([]);
  
  useEffect(() => {
    fetch(`http://3.38.118.228:8080/api/imageLet/${selectedUser.kakaoId}`)
      .then(response => response.json())
      .then(data => {
        setImageData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

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

  const captureAndSave = () => {
    const dbDiaryElement = document.querySelector(".dbDiary");
  
    // html2canvas을 사용하여 dbDiary 요소를 캡처합니다.
    html2canvas(dbDiaryElement).then((canvas) => {
      // 캔버스를 이미지 URL로 변환합니다.
      const dataURL = canvas.toDataURL();
  
      // a 태그를 생성하여 다운로드 링크로 사용합니다.
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "diary_screenshot.png";
  
      // 다운로드 링크를 클릭하여 이미지를 저장합니다.
      downloadLink.click();
    });
  };

  const like = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const formattedDate = currentDate.toISOString().split('T')[0];

    console.log(user.kakaoId, formattedDate);
    fetch('http://3.38.118.228:8080/api/dailyReport/like', {
      method: 'PUT', // 수정된 내용을 저장하기 위해 PUT 요청을 사용합니다. API 요청 방식에 따라 다를 수 있습니다.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({kakaoId: user.kakaoId, date: formattedDate}), // 수정된 내용을 JSON 형식으로 변환하여 요청의 본문에 포함합니다.
    })
      .then((response) => response.json())
      .then((data) => {
        // 저장 후의 로직을 구현합니다.
        console.log(data);
        console.log('저장되었습니다.');
        // 필요한 추가적인 작업을 수행합니다.
      })
      .catch((error) => {
        // 에러 처리
        console.error('Error:', error);
      });
  };
  

  return (
    <>
    <div className="dbDiary">
      <div className="dateBg">
        <div className="dateContainer">
          <svg onClick={handleDateClick} className="svgDate" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.995 9H23.005C24.107 9 25 9.895 25 10.994V23.006C25 23.2679 24.9484 23.5273 24.8481 23.7693C24.7478 24.0113 24.6009 24.2312 24.4156 24.4163C24.2304 24.6015 24.0104 24.7484 23.7684 24.8485C23.5263 24.9487 23.2669 25.0001 23.005 25H8.995C8.46607 25 7.95878 24.7899 7.58468 24.416C7.21057 24.0421 7.00027 23.5349 7 23.006V10.994C7 9.893 7.892 9 8.995 9ZM9 13V22C9 22.2652 9.10536 22.5196 9.29289 22.7071C9.48043 22.8946 9.73478 23 10 23H22C22.2652 23 22.5196 22.8946 22.7071 22.7071C22.8946 22.5196 23 22.2652 23 22V13H9ZM10 8C10 7.73478 10.1054 7.48043 10.2929 7.29289C10.4804 7.10536 10.7348 7 11 7C11.2652 7 11.5196 7.10536 11.7071 7.29289C11.8946 7.48043 12 7.73478 12 8V9H10V8ZM20 8C20 7.73478 20.1054 7.48043 20.2929 7.29289C20.4804 7.10536 20.7348 7 21 7C21.2652 7 21.5196 7.10536 21.7071 7.29289C21.8946 7.48043 22 7.73478 22 8V9H20V8ZM11 17V14.999H13V17H11ZM19 17V14.999H21V17H19ZM15 17V14.999H17.001V17H15ZM11 21V19H13V21H11ZM15 21V19H17.001V21H15ZM19 21V19H21V21H19Z" fill="#ffffff"/>
          </svg>
        </div>
        <p className="date">{user.date}</p>
      </div>
      <div className="heartContainer">
        <svg onClick={like} className="svgHeart" xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
          <g clipPath="url(#clip0_15_16)">
            <path d="M51.5625 9.375C46.125 9.375 40.9062 11.9063 37.5 15.9063C34.0938 11.9063 28.875 9.375 23.4375 9.375C13.8125 9.375 6.25 16.9375 6.25 26.5625C6.25 38.375 16.875 48 32.9688 62.625L37.5 66.7188L42.0312 62.5938C58.125 48 68.75 38.375 68.75 26.5625C68.75 16.9375 61.1875 9.375 51.5625 9.375ZM37.8125 57.9687L37.5 58.2812L37.1875 57.9687C22.3125 44.5 12.5 35.5938 12.5 26.5625C12.5 20.3125 17.1875 15.625 23.4375 15.625C28.25 15.625 32.9375 18.7188 34.5938 23H40.4375C42.0625 18.7188 46.75 15.625 51.5625 15.625C57.8125 15.625 62.5 20.3125 62.5 26.5625C62.5 35.5938 52.6875 44.5 37.8125 57.9687Z" fill="#AFAFAF"/>
          </g>
          <defs>
            <clipPath id="clip0_15_16">
              <rect width="75" height="75" fill="white"/>
            </clipPath>
          </defs>
        </svg>
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
      {imageData &&
        <div className="imageContainer">
          {imageData.map((item, index) => (
            <img key={index} src={item.imageUrl} alt={`Image ${index}`} />
          ))}
        </div>
      }

      {!isEditMode &&
        <>
          <div className="keywords">
            <p className="keyword1st">{user.keyword1st}</p>
            <p className="keyword2nd">{user.keyword2nd}</p>
            <p className="keyword3rd">{user.keyword3rd}</p>
          </div>
        </>
      }

      {isEditMode &&
        <button className="btnSave" onClick={handleSave} style={{
          alignSelf: "center"
        }}>
          저장하기
        </button>
      }
      
    </div>
    <button className="btnSave" onClick={captureAndSave} style={{ marginTop: "20px", marginLeft: "auto", marginRight: "auto", alignSelf: "center"}}>
      캡쳐 후 저장하기
    </button>
    </>
  );
};


export default Diary;