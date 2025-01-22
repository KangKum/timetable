document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
///////////////////////////////////////////////////////////////////////////////////////////////// 변수
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
//FOOTER
const btnAddPage = document.querySelector(".btnAddPage");
const modal = document.querySelector(".modalBackground");
const modalNameOrDelete = document.querySelector(".modalNameOrDelete");
const modalDeleteBtn = document.querySelector(".btnDeletePage");
const modalNameBtn = document.querySelector(".btnRenamePage");
const modalNameInput = document.querySelector(".rename");
//HEADER
const selectTime = document.querySelector(".selectTime");
const selectDate = document.querySelector(".selectDate");
const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const time = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
const btnAddRow = document.querySelector(".btnAddRow");
const btnDeleteRow = document.querySelector(".btnDeleteRow");
const btnAddColumn = document.querySelector(".btnAddColumn");
const btnDeleteColumn = document.querySelector(".btnDeleteColumn");
const btnHideTable = document.querySelector(".btnHideTable");
const selectScreenRatio = document.querySelector(".selectScreenRatio");
const textCell = document.querySelectorAll(".textCell");
const markCurrentCell = document.querySelector(".markCurrentCell");
let currentPageOrder;
let tempPageOrder;
let currentPage;
let clickedTable;
//
let currentTable;
let currentCell;
let colIdx;
let rowIdx;
let lastCol;
let lastRow;
/////////////////////////////////////////////////////////////////////////////////////////////////// 함수
/////////////////////////////////////////////////////////HEADER////////////////////////////////////////
// 현재 테이블 확인
function findClickedTable(event) {
  if (document.querySelector(".tableClicked")) {
    clickedTable = document.querySelector(".tableClicked");
    if (clickedTable === event.target.parentNode.parentNode) {
      clickedTable.classList.remove("tableClicked");
      clickedTable = "";
    } else {
      clickedTable.classList.remove("tableClicked");
      clickedTable = event.target.parentNode.parentNode;
      clickedTable.classList.add("tableClicked");
    }
  } else {
    clickedTable = event.target.parentNode.parentNode;
    clickedTable.classList.add("tableClicked");
  }
}
//헤더 초기화화
function headerInit() {
  //날짜짜
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  selectDate.value = formattedDate;
  //시간
  selectTime.value = "09:00";
  //배율
  if (currentPage) {
    if (currentPage.style.transform === "") {
      selectScreenRatio.value = "100%";
    } else {
      selectScreenRatio.value = currentPage.style.transform.slice(6).slice(0, -1) * 100 + "%";
    }
  } else {
    selectScreenRatio.value = "100%";
  }
}
//테이블 날짜 세팅
function settingDate() {
  const selectedDate = new Date(selectDate.value);
  if (currentPage) {
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + i);
      currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerText = "";
      currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerText = newDate.toISOString().split("T")[0].slice(5) + ` (${week[i]})`;
    }
  }
  if (clickedTable) {
    clickedTable.classList.remove("tableClicked");
    clickedTable = "";
  }
}
//테이블 시간 세팅
function settingTime() {
  if (!currentPage) {
    return;
  }

  //인덱스 찾기
  let timeIndex = time.indexOf(selectTime.value);
  if (!clickedTable) {
    //전체 테이블블
    for (let i = 0; i < 7; i++) {
      for (let j = 1; j <= currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length - 1; j++) {
        if (time[timeIndex + j] === undefined) {
          currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerText = "";
        } else {
          currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerText = time[timeIndex + j - 1] + " - " + time[timeIndex + j];
        }
      }
    }
  } else {
    //한개 테이블블
    for (let j = 1; j <= clickedTable.querySelectorAll(".timeCell").length - 1; j++) {
      if (time[timeIndex + j] === undefined) {
        clickedTable.querySelectorAll(".timeCell")[j].innerText = "";
      } else {
        clickedTable.querySelectorAll(".timeCell")[j].innerText = time[timeIndex + j - 1] + " - " + time[timeIndex + j];
      }
    }
  }
}
//테이블 숨기기기
function hideTable() {
  if (!clickedTable) {
    return;
  }
  if (clickedTable.querySelector(".textColumn")) {
    if (clickedTable.querySelector(".textColumn").classList.contains("hide")) {
      clickedTable.querySelectorAll(".textColumn").forEach((cols) => {
        cols.classList.remove("hide");
      });
    } else {
      clickedTable.querySelectorAll(".textColumn").forEach((cols) => {
        cols.classList.add("hide");
      });
    }
  }
}
function addCol() {
  if (!currentPage) {
    return;
  }

  if (clickedTable) {
    //테이블 하나
    let newTextColumn = document.createElement("div");
    newTextColumn.classList.add("textColumn");
    let numOfTextColumn = clickedTable.querySelectorAll(".textColumn").length;
    for (let j = 0; j < clickedTable.querySelectorAll(".timeCell").length; j++) {
      let newTextCell = document.createElement("div");
      newTextCell.classList.add("textCell");
      newTextCell.setAttribute("contenteditable", true);
      newTextCell.setAttribute("rowIndex", j);
      newTextCell.setAttribute("colIndex", numOfTextColumn);
      newTextCell.addEventListener("keydown", cellMove);
      newTextCell.addEventListener("click", findCurrentCell);
      newTextColumn.appendChild(newTextCell);
    }
    clickedTable.appendChild(newTextColumn);
  } else {
    //테이블 전체
    for (let i = 0; i < 7; i++) {
      let numOfRow = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length;
      let newTextColumn = document.createElement("div");
      newTextColumn.classList.add("textColumn");
      let numOfTextColumn = document.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn").length;
      for (let j = 0; j < numOfRow; j++) {
        let newTextCell = document.createElement("div");
        newTextCell.classList.add("textCell");
        newTextCell.setAttribute("contenteditable", true);
        newTextCell.setAttribute("rowIndex", j);
        newTextCell.setAttribute("colIndex", numOfTextColumn);
        newTextCell.addEventListener("keydown", cellMove);
        newTextCell.addEventListener("click", findCurrentCell);
        newTextColumn.appendChild(newTextCell);
      }
      currentPage.querySelectorAll(".dayTable")[i].appendChild(newTextColumn);
    }
  }
}
function deleteCol() {
  if (!currentPage) {
    return;
  }
  if (clickedTable) {
    //한개 테이블
    if (clickedTable.querySelector(".textColumn")) {
      let numOfCol = clickedTable.querySelectorAll(".timeColumn").length;
      clickedTable.querySelectorAll(".textColumn")[numOfCol - 1].remove();
    }
  } else {
    //전체 테이블
    for (let i = 0; i < 7; i++) {
      if (currentPage.querySelectorAll(".dayTable")[i].querySelector(".textColumn")) {
        let numOfCol = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeColumn").length;
        currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn")[numOfCol - 1].remove();
      }
    }
  }
}
function addRow() {
  if (!currentPage) {
    return;
  }

  if (clickedTable) {
    //한개 테이블
    //timeCell
    let newTimeCell = document.createElement("div");
    newTimeCell.classList.add("timeCell");
    clickedTable.querySelector(".timeColumn").appendChild(newTimeCell);

    //textCell
    let numOfCol = clickedTable.querySelectorAll(".textColumn").length;
    let numOfRow = clickedTable.querySelectorAll(".timeCell").length - 1;
    for (let j = 0; j < numOfCol; j++) {
      let newTextCell = document.createElement("div");
      newTextCell.classList.add("textCell");
      newTextCell.setAttribute("contenteditable", true);
      newTextCell.setAttribute("rowIndex", numOfRow);
      newTextCell.setAttribute("colIndex", j);
      newTextCell.addEventListener("keydown", cellMove);
      newTextCell.addEventListener("click", findCurrentCell);
      clickedTable.querySelectorAll(".textColumn")[j].appendChild(newTextCell);
    }
  } else {
    //전체 테이블
    for (let i = 0; i < 7; i++) {
      //timeCell
      let newTimeCell = document.createElement("div");
      newTimeCell.classList.add("timeCell");
      currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeColumn").appendChild(newTimeCell);

      //textCell
      let numOfCol = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn").length;
      let numOfRow = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length - 1;
      for (let j = 0; j < numOfCol; j++) {
        let newTextCell = document.createElement("div");
        newTextCell.classList.add("textCell");
        newTextCell.setAttribute("contenteditable", true);
        newTextCell.setAttribute("rowIndex", numOfRow);
        newTextCell.setAttribute("colIndex", j);
        newTextCell.addEventListener("keydown", cellMove);
        newTextCell.addEventListener("click", findCurrentCell);
        currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn")[j].appendChild(newTextCell);
      }
    }
  }
}
function deleteRow() {
  if (!currentPage) {
    return;
  }

  if (clickedTable) {
    //한개 테이블
    //timeCell
    let numOfRow = clickedTable.querySelectorAll(".timeCell").length;
    if (numOfRow < 2) {
      return;
    }
    clickedTable.querySelector(".timeColumn").querySelectorAll(".timeCell")[numOfRow - 1].remove();
    //textCell
    let numOfCol = clickedTable.querySelectorAll(".textColumn").length;
    for (let j = 0; j < numOfCol; j++) {
      clickedTable.querySelectorAll(".textColumn")[j].querySelectorAll(".textCell")[numOfRow - 1].remove();
    }
  } else {
    //전체 테이블
    for (let i = 0; i < 7; i++) {
      //timeCell
      let numOfRow = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length;
      if (numOfRow > 1) {
        currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeColumn").querySelectorAll(".timeCell")[numOfRow - 1].remove();

        //textCell
        let numOfCol = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn").length;
        for (let j = 0; j < numOfCol; j++) {
          currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn")[j].querySelectorAll(".textCell")[numOfRow - 1].remove();
        }
      }
    }
  }
}
function adjustScreenRatio() {
  if (!currentPage) {
    return;
  }
  let abc = selectScreenRatio.value.slice(0, -1) * 1 * 0.01;
  currentPage.style.transform = `scale(${abc})`;
}
/////////////////////////////////////////////////////////MAIN///////////////////////////////////////////////////////////
function findCurrentCell(event) {
  currentCell = event.target;
  currentTable = currentCell.parentNode.parentNode;
  lastCol = currentTable.querySelectorAll(".textColumn").length - 1;
  lastRow = currentTable.querySelectorAll(".timeCell").length - 1;
  colIdx = Number(currentCell.getAttribute("colIndex"));
  rowIdx = Number(currentCell.getAttribute("rowIndex"));
  //표시
  markCurrentCell.innerText = "";
  markCurrentCell.innerText = rowIdx + ", " + colIdx;
}
function cellMove(event) {
  if (event.ctrlKey) {
    // 현재칸 다음칸의 '빈칸' or '글자칸'에 따라 이동경로 정하기
    console.log("ctrl");
  }
  if (event.shiftKey) {
    // 드래그처럼 셀 연속블럭잡기기
    console.log("shift");
  }
  if (event.ctrlKey && event.shiftKey) {
    // 알지? 이거 ctrl 밑에 shift 넣어야할듯?
    console.log("ctrl + shift");
  }

  if (event.key === "ArrowUp" && rowIdx > 1) {
    rowIdx--;
  } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
    rowIdx++;
  } else if (event.key === "ArrowLeft" && colIdx > 0) {
    colIdx--;
  } else if (event.key === "ArrowRight" && colIdx < lastCol) {
    colIdx++;
  }
  currentCell = currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx];
  currentCell.focus();
  //표시
  markCurrentCell.innerText = "";
  markCurrentCell.innerText = rowIdx + ", " + colIdx;
}

/////////////////////////////////////////////////////////FOOTER///////////////////////////////////////////////////////////
// 버튼 좌클릭시 버튼+페이지 추가
function addPage() {
  // 개수 카운팅
  let matchOrder;
  if (document.querySelectorAll(".btnPage").length === 0) {
    matchOrder = 0;
  } else {
    matchOrder = Number(document.querySelectorAll(".btnPage")[document.querySelectorAll(".btnPage").length - 1].getAttribute("order")) + 1;
  }
  // 버튼 생성
  const newBtnPage = document.createElement("button");
  newBtnPage.classList.add("btnPage");
  newBtnPage.setAttribute("order", matchOrder);
  newBtnPage.addEventListener("click", openPage);
  newBtnPage.addEventListener("contextmenu", openModal);
  footer.appendChild(newBtnPage);
  // 페이지 생성
  const newPage = document.createElement("div");
  newPage.classList.add("page");
  newPage.setAttribute("order", matchOrder);
  main.appendChild(newPage);
  // 클릭전까지 페이지 숨기기
  newPage.classList.add("hide");
}
// 버튼 좌클릭시 페이지 전환 or 페이지 내 테이블 생성
function openPage(event) {
  currentPageOrder = event.target.getAttribute("order");
  currentPage = document.querySelector(`.page[order="${currentPageOrder}"]`);

  document.querySelectorAll(".btnPage").forEach((div) => {
    div.classList.remove("btnClicked");
  });
  event.target.classList.add("btnClicked");

  document.querySelectorAll(".page").forEach((div) => {
    div.classList.add("hide");
  });
  document.querySelector(`.page[order="${currentPageOrder}"]`).classList.remove("hide");

  //첫 클릭시 테이블 7개 생성(월-일)
  if (currentPage.childElementCount === 0) {
    for (let i = 0; i < 7; i++) {
      const newTable = document.createElement("div");
      newTable.classList.add("dayTable");
      currentPage.appendChild(newTable);

      const newTimeColumn = document.createElement("div");
      newTimeColumn.classList.add("timeColumn");
      newTimeColumn.addEventListener("click", findClickedTable);
      newTable.appendChild(newTimeColumn);

      for (let j = 0; j < 26; j++) {
        const newTimeCell = document.createElement("div");
        newTimeCell.classList.add("timeCell");
        newTimeColumn.appendChild(newTimeCell);
      }

      newTable.querySelector(".timeCell").innerText = week[i];
    }
  }

  headerInit();
}
// 버튼 우클릭시 모달 띄우기 - 이름설정 / 버튼+페이지 삭제
function openModal(event) {
  tempPageOrder = event.target.getAttribute("order");
  modal.classList.remove("hide");
}
function modalNaming() {
  modalDeleteBtn.classList.add("hide");
  modalNameBtn.classList.add("hide");
  modalNameInput.classList.remove("hide");
  modalNameInput.focus();
}
function modalDelete() {
  document.querySelector(`.page[order="${tempPageOrder}"]`).remove();
  document.querySelector(`.btnPage[order="${tempPageOrder}"]`).remove();
  modal.classList.add("hide");
}
function btnPageNaming(event) {
  if (event.key === "Enter") {
    document.querySelector(`.btnPage[order="${tempPageOrder}"]`).innerText = modalNameInput.value.trim();
    modalNameInput.value = "";
    modalDeleteBtn.classList.remove("hide");
    modalNameBtn.classList.remove("hide");
    modalNameInput.classList.add("hide");
    modal.classList.add("hide");
  }
}
function closeModal() {
  modal.classList.add("hide");
}
function closePreventModal(event) {
  event.stopPropagation();
}
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 이벤트
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// headerInit();
btnAddPage.addEventListener("click", addPage);
modalDeleteBtn.addEventListener("click", modalDelete);
modalNameBtn.addEventListener("click", modalNaming);
modalNameInput.addEventListener("keydown", btnPageNaming);
modal.addEventListener("click", closeModal);
modalNameOrDelete.addEventListener("click", closePreventModal);
selectTime.addEventListener("change", settingTime);
selectDate.addEventListener("change", settingDate);
btnAddColumn.addEventListener("click", addCol);
btnDeleteColumn.addEventListener("click", deleteCol);
btnAddRow.addEventListener("click", addRow);
btnDeleteRow.addEventListener("click", deleteRow);
btnHideTable.addEventListener("click", hideTable);
selectScreenRatio.addEventListener("change", adjustScreenRatio);
