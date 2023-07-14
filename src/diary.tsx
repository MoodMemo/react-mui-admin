// diary.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

// selectedUSer 받아와서 return !
const Diary = ({ kakaoId, selectedUser, selectedDate }) => {
  const [user, setUser] = useState(selectedUser);
  const [editableText, setEditableText] = useState(selectedUser.bodyText);
  const [editableTitle, setEditableTitle] = useState(selectedUser.title);
  const [editableDate, setEditableDate] = useState(selectedUser.date);
  const [isTextEditMode, setIsTextEditMode] = useState(false);
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isDateEditMode, setIsDateEditMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentDate(new Date(selectedDate)); // selectedDate가 변경될 때마다 currentDate를 업데이트합니다.
  }, [selectedDate]);
  
  useEffect(() => {
    fetch(`http://3.38.118.228:8080/api/imageLet/${selectedUser.kakaoId}/${selectedDate}`)
      .then(response => response.json())
      .then(data => {
        setImageData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [selectedUser, selectedDate]);

  const handleTextChange = (event) => {
    setEditableText(event.target.value);
  };
  const handleTitleChange = (event) => {
    setEditableTitle(event.target.value);
  };
  const handleDateChange = (event) => {
    setEditableDate(event.target.value);
  };

  const handleTextClick = () => {
    setIsTextEditMode(true);
    setIsEditMode(true);
  };

  const handleTitleClick = () => {
    setIsTitleEditMode(true);
    setIsEditMode(true);
  }

  const handleDateClick = () => {
    console.log("달력 아이콘 누름");
    setIsDateEditMode(true);
    setIsEditMode(true); // Enable edit mode when the date is clicked
  }

  const handleSave = () => {
    const updatedUser = { ...user, title: editableTitle, bodyText: editableText, date: editableDate, };
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
    setIsDateEditMode(false);
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

  const handlePrevDate = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
    navigate(`/dailyReport/${kakaoId}/${prevDate.toISOString().split("T")[0]}`);
  };
  
  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
    navigate(`/dailyReport/${kakaoId}/${nextDate.toISOString().split("T")[0]}`);
  };
  
  

  return (
    <>
    <div className="dbDiary">
      <div className="dateBg">
        <svg onClick={handlePrevDate} className="svgArrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.01185 10.995C7.82438 11.1825 7.71907 11.4368 7.71907 11.702C7.71907 11.9672 7.82438 12.2215 8.01185 12.409L12.6049 17.002C12.7911 17.1846 13.042 17.2862 13.3028 17.2849C13.5636 17.2836 13.8134 17.1794 13.9978 16.995C14.1823 16.8105 14.2865 16.5608 14.2878 16.2999C14.2891 16.0391 14.1874 15.7883 14.0049 15.602L10.1049 11.702L14.0049 7.80201C14.1874 7.61572 14.2891 7.36491 14.2878 7.10408C14.2865 6.84325 14.1823 6.59348 13.9978 6.40904C13.8134 6.22461 13.5636 6.12041 13.3028 6.11909C13.042 6.11777 12.7911 6.21944 12.6049 6.40201L8.01185 10.995Z" fill="#ffffff"/>
        </svg>        
        <p className="date">{currentDate.toISOString().split("T")[0]}</p>
        <svg onClick={handleNextDate} className="svgArrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M15.995 10.995C16.1825 11.1825 16.2878 11.4368 16.2878 11.702C16.2878 11.9672 16.1825 12.2215 15.995 12.409L11.402 17.002C11.2158 17.1846 10.9649 17.2862 10.7041 17.2849C10.4433 17.2836 10.1935 17.1794 10.0091 16.995C9.82464 16.8105 9.72045 16.5608 9.71913 16.2999C9.71781 16.0391 9.81948 15.7883 10.002 15.602L13.902 11.702L10.002 7.80201C9.81948 7.61572 9.71781 7.36491 9.71913 7.10408C9.72045 6.84325 9.82464 6.59348 10.0091 6.40904C10.1935 6.22461 10.4433 6.12041 10.7041 6.11909C10.9649 6.11777 11.2158 6.21944 11.402 6.40201L15.995 10.995Z" fill="#ffffff"/>
        </svg>
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