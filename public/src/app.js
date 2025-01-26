document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 변수
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const printPage = document.querySelector(".printPage");
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
const btnMerge = document.querySelector(".btnMerge");
// const textCell = document.querySelectorAll(".textCell");
const markCurrentCell = document.querySelector(".markCurrentCell");
const viewFont = document.querySelector(".viewFont");
const btnFontUp = document.querySelector(".btnFontSizeUp");
const btnFontDown = document.querySelector(".btnFontSizeDown");
const btnFontBold = document.querySelector(".btnFontBold");
const btnFontCancel = document.querySelector(".btnFontCancel");
const btnViewTeachers = document.querySelector(".btnViewTeachers");
const btnPrint = document.querySelector(".btnPrint");
//
let currentPageOrder;
let tempPageOrder;
let currentPage;
let clickedTable;
//
let currentTable;
let currentColumn;
let currentCell;
let colIdx;
let rowIdx;
let dragIdx;
let lastCol;
let lastRow;
//
let dataCtrl = [];
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 함수
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////HEADER////////////////////////////////////////
// 클릭된된 테이블 확인
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
      if (j === 0) {
        newTextCell.classList.add("nameCell");
        newTextCell.addEventListener("input", teacherNaming);
      }
      newTextCell.setAttribute("contenteditable", true);
      newTextCell.setAttribute("rowIndex", j);
      newTextCell.setAttribute("colIndex", numOfTextColumn);
      newTextCell.style.flex = 1;
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
        if (j === 0) {
          newTextCell.classList.add("nameCell");
          newTextCell.addEventListener("input", teacherNaming);
        }
        newTextCell.setAttribute("contenteditable", true);
        newTextCell.setAttribute("rowIndex", j);
        newTextCell.setAttribute("colIndex", numOfTextColumn);
        newTextCell.style.flex = 1;
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
      newTextCell.style.flex = 1;
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
        newTextCell.style.flex = 1;
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
function viewTeachers() {
  // 클론방식
  if (!currentPage) {
    return;
  }
  lastCol = currentPage.querySelector(".dayTable").querySelectorAll(".textColumn").length;
  lastRow = currentPage.querySelector(".timeColumn").querySelectorAll(".timeCell").length;

  const newDiv = document.createElement("div");
  newDiv.classList.add("teacherPage");
  let tempWeek = [];
  for (let i = 0; i < 5; i++) {
    tempWeek.push(currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerText);
  }

  for (let i = 0; i < lastCol; i++) {
    let newTeacherTable = document.createElement("div");
    newTeacherTable.classList.add("teacherTable");

    let cloneTimeColumn = currentPage.querySelector(".dayTable").querySelector(".timeColumn").cloneNode(true);
    cloneTimeColumn.querySelector(".timeCell").innerText = currentPage.querySelector(".dayTable").querySelectorAll(".textColumn")[i].querySelector(".nameCell").innerText;
    newTeacherTable.appendChild(cloneTimeColumn);

    for (let j = 0; j < 5; j++) {
      let cloneTextColumn = currentPage.querySelectorAll(".dayTable")[j].querySelectorAll(".textColumn")[i].cloneNode(true);
      cloneTextColumn.querySelector(".textCell").innerText = currentPage.querySelectorAll(".dayTable")[j].querySelector(".timeCell").innerText;
      newTeacherTable.appendChild(cloneTextColumn);
    }
    newTeacherTable.querySelectorAll(".textCell").forEach((txtcell) => {
      txtcell.contentEditable = false;
    });
    newDiv.appendChild(newTeacherTable);
  }

  if (btnViewTeachers.innerText === "선생님별") {
    currentPage.classList.add("hide");
    btnViewTeachers.innerText = "요일별";
    main.appendChild(newDiv);
  } else {
    document.querySelector(".teacherPage").remove();
    currentPage.classList.remove("hide");
    btnViewTeachers.innerText = "선생님별";
  }
}
function customizedPrint() {
  if (!currentPage) {
    return;
  }
  if (document.querySelector(".teacherPage")) {
    //선생님별
    for (let i = 0; i < lastCol; i++) {
      let clonePage = document.querySelectorAll(".teacherTable")[i].cloneNode(true);
      printPage.appendChild(clonePage);
      window.print();
      printPage.innerHTML = "";
    }
  } else {
    //요일별별
    let mainWidth = Number(window.getComputedStyle(main).width.slice(0, -2));
    for (let i = 0; i < 7; i++) {
      let clonePage = document.querySelectorAll(".dayTable")[i].cloneNode(true);
      let clonePageWidth = Number(window.getComputedStyle(document.querySelectorAll(".dayTable")[i]).width.slice(0, -2));
      if (clonePageWidth > mainWidth + 0.1) {
        let ratio = (clonePageWidth - mainWidth) / mainWidth + 0.1;
        clonePage.style.transform = `scale(${1 - ratio})`;
      }
      printPage.appendChild(clonePage);
      window.print();
      printPage.innerHTML = "";
    }
  }
}
// function viewTeachers() {
// 새로 다 만들기
//   if (!currentPage) {
//     return;
//   }
//   lastCol = currentPage.querySelector(".dayTable").querySelectorAll(".textColumn").length;
//   lastRow = currentPage.querySelector(".timeColumn").querySelectorAll(".timeCell").length;

//   const newDiv = document.createElement("div");
//   newDiv.classList.add("teacherPage");

//   for (let i = 0; i < lastCol; i++) {
//     let teacherTable = document.createElement("div");
//     teacherTable.classList.add("teacherTable");

//     let newTimeColumn = document.createElement("div");
//     newTimeColumn.classList.add("timeColumn");
//     for (let k = 0; k < lastRow; k++) {
//       let newTimeCell = document.createElement("div");
//       newTimeCell.classList.add("timeCell");
//       if (k > 0) {
//         newTimeCell.innerText = currentPage.querySelector(".timeColumn").querySelectorAll(".timeCell")[k].innerText;
//       }
//       newTimeColumn.appendChild(newTimeCell);
//     }
//     teacherTable.appendChild(newTimeColumn);

//     for (let j = 0; j < 5; j++) {
//       let newTextColumn = document.createElement("div");
//       newTextColumn.classList.add("textColumn");
//       for (let k = 0; k < lastRow; k++) {
//         let newTextCell = document.createElement("div");
//         newTextCell.classList.add("textCell");
//         k === 0 ? newTextCell.classList.add("nameCell") : "";
//         if (k === 0) {
//           newTextCell.innerText = currentPage.querySelectorAll(".dayTable")[j].querySelector(".timeCell").innerText;
//         }
//         newTextCell.style.flex = 1;
//         newTextColumn.appendChild(newTextCell);
//       }
//       teacherTable.appendChild(newTextColumn);
//     }
//     newDiv.appendChild(teacherTable);
//   }
//   console.log(currentPage);

//   if (btnViewTeachers.innerText === "선생님별") {
//     currentPage.classList.add("hide");
//     btnViewTeachers.innerText = "요일별";
//     main.appendChild(newDiv);
//   } else {
//     document.querySelector(".teacherPage").remove();
//     currentPage.classList.remove("hide");
//     btnViewTeachers.innerText = "선생님별";
//   }
// }

function findCurrentCell(event) {
  currentCell = event.target;
  currentColumn = currentCell.parentNode;
  currentTable = currentCell.parentNode.parentNode;
  lastCol = currentTable.querySelectorAll(".textColumn").length - 1;
  lastRow = currentTable.querySelectorAll(".timeCell").length - 1;
  colIdx = Number(currentCell.getAttribute("colIndex"));
  rowIdx = Number(currentCell.getAttribute("rowIndex"));
  dragIdx = rowIdx;
  clearDrag();
  findFontSize();
  //표시
  markCurrentCell.innerText = "";
  markCurrentCell.innerText = rowIdx + ", " + colIdx;
}
function teacherNaming(event) {
  let index = event.target.getAttribute("colIndex");
  let namingTableIndex = event.target.parentNode.parentNode.getAttribute("tableIndex");
  for (let i = 0; i < 7; i++) {
    if (i !== Number(namingTableIndex)) {
      currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".nameCell")[index].innerText = event.target.innerText;
    }
  }
}
//////////// 8.ctrl+X,Z 9.시수and수업 확인 10.데이터 저장 및 불러오기
function cellMove(event) {
  let previousCell;
  if (event.ctrlKey && event.shiftKey) {
    if (event.key === "ArrowUp" && rowIdx > 1) {
      verticalCellDrag(-1);
      cellDrag();
    } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
      verticalCellDrag(1);
      cellDrag();
    }
  } else if (event.ctrlKey) {
    if (event.key === "ArrowUp" && rowIdx > 1) {
      verticalMove(-1);
    } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
      verticalMove(1);
    } else if (event.key === "ArrowLeft" && colIdx > 0) {
      horizontalMove(-1);
    } else if (event.key === "ArrowRight" && colIdx < lastCol) {
      horizontalMove(1);
    } else if (event.key === "c" || event.key === "C") {
      event.preventDefault();
      ctrlC();
    } else if (event.key === "x" || event.key === "X") {
      event.preventDefault();
      ctrlX();
    } else if (event.key === "v" || event.key === "V") {
      event.preventDefault();
      ctrlV();
    } else if (event.key === "z" || event.key === "Z") {
      event.preventDefault();
      ctrlZ();
    }
    // dragIdx = rowIdx;
    // clearDrag();
  } else if (event.shiftKey) {
    let vertical = currentColumn.querySelectorAll(".textCell");
    if (event.key === "ArrowUp" && rowIdx > 1) {
      event.preventDefault();
      dragIdx--;
      while (vertical[dragIdx].classList.contains("hide")) {
        dragIdx--;
      }
      cellDrag();
    } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
      event.preventDefault();
      dragIdx++;
      while (vertical[dragIdx].classList.contains("hide")) {
        dragIdx++;
      }
      cellDrag();
    } else if (event.key === "Enter") {
      //줄바꿈 금지
      event.preventDefault();
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    previousCell = currentCell;
    if (rowIdx < lastRow) {
      rowIdx++;
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx++;
      }
    }
    previousCell.classList.remove("f2Cell");
  } else if (event.key === "Tab") {
    event.preventDefault();
    previousCell = currentCell;
    if (colIdx < lastCol) {
      colIdx++;
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
    }
    previousCell.classList.remove("f2Cell");
  } else if (event.altKey) {
    event.preventDefault();
  } else if (event.key === "Delete") {
    let draggedCells = currentColumn.querySelectorAll(".dragged");
    if (draggedCells.length > 1) {
      draggedCells.forEach((cell) => {
        cell.innerText = "";
      });
    } else {
      currentCell.innerText = "";
    }
  } else if (event.key === "F2") {
    event.preventDefault();
    previousCell = currentCell;
    currentCell.classList.add("f2Cell");
  } else {
    if (currentCell.classList.contains("f2Cell")) {
      return;
    }
    if (event.key === "ArrowUp" && rowIdx > 1) {
      rowIdx--;
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
      previousCell = currentCell;
    } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
      rowIdx++;
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx++;
      }
      previousCell = currentCell;
    } else if (event.key === "ArrowLeft" && colIdx > 0) {
      colIdx--;
      while (currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
      previousCell = currentCell;
    } else if (event.key === "ArrowRight" && colIdx < lastCol) {
      colIdx++;
      while (currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
      previousCell = currentCell;
    } else {
      if (!currentCell.classList.contains("cursorOn")) {
        currentCell.innerText = "";
      }
      currentCell.classList.add("cursorOn");
    }
    dragIdx = rowIdx;
    clearDrag();
  }
  previousCell?.classList.remove("cursorOn");
  currentCell = currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx];
  currentColumn = currentCell.parentNode;
  currentTable = currentColumn.parentNode;
  currentCell.focus();
  findFontSize();
  //표시
  markCurrentCell.innerText = "";
  markCurrentCell.innerText = rowIdx + ", " + colIdx;
}
function verticalCellDrag(i) {
  let vertical = currentCell.parentNode.querySelectorAll(".textCell");
  //현재 셀이 빈셀이면
  if (vertical[dragIdx].innerText.trim() === "") {
    if (i < 0) {
      while (dragIdx > 1 && vertical[dragIdx].innerText.trim() === "") {
        dragIdx--;
      }
    } else {
      while (dragIdx < lastRow && vertical[dragIdx].innerText.trim() === "") {
        dragIdx++;
      }
    }
  } else {
    //현재 셀이 글자셀이면 // 다음 셀이 빈셀 or 글자셀이면
    if (i < 0) {
      if (vertical[dragIdx - 1].innerText.trim() === "") {
        //다음 셀이 빈셀
        while (dragIdx > 1 && vertical[dragIdx - 1].innerText.trim() === "") {
          dragIdx--;
        }
      } else {
        //다음 셀이 글자셀
        while (dragIdx > 1 && vertical[dragIdx].innerText.trim() !== "") {
          dragIdx--;
        }
        dragIdx++;
      }
    } else {
      if (vertical[dragIdx + 1].innerText.trim() === "") {
        while (dragIdx < lastRow && vertical[dragIdx + 1].innerText.trim() === "") {
          dragIdx++;
        }
      } else {
        while (dragIdx < lastRow && vertical[dragIdx].innerText.trim() !== "") {
          dragIdx++;
        }
        dragIdx--;
      }
    }
  }
}
function verticalMove(i) {
  let vertical = currentCell.parentNode.querySelectorAll(".textCell");
  if (currentCell.innerText.trim() === "") {
    //현재셀 빈칸
    if (i < 0) {
      while (rowIdx + i > 1 && vertical[rowIdx + i].innerText.trim() === "") {
        rowIdx--;
      }
      rowIdx--;
    } else {
      while (rowIdx + i < lastRow && vertical[rowIdx + i].innerText.trim() === "") {
        rowIdx++;
      }
      rowIdx++;
    }
  } else {
    //현재셀 글자칸
    if (vertical[rowIdx + i].innerText.trim() === "") {
      //다음셀 빈칸
      if (i < 0) {
        while (rowIdx + i > 1 && vertical[rowIdx + i].innerText.trim() === "") {
          rowIdx--;
        }
        rowIdx--;
      } else {
        while (rowIdx + i < lastRow && vertical[rowIdx + i].innerText.trim() === "") {
          rowIdx++;
        }
        rowIdx++;
      }
    } else {
      //다음셀 글자칸
      if (i < 0) {
        while (rowIdx + i > 1 && vertical[rowIdx + i].innerText.trim() !== "") {
          rowIdx--;
        }
      } else {
        while (rowIdx + i < lastRow && vertical[rowIdx + i].innerText.trim() !== "") {
          rowIdx++;
        }
      }
    }
  }
  dragIdx = rowIdx;
  clearDrag();
}
function horizontalMove(i) {
  let columnsInThisTable = currentTable.querySelectorAll(".textColumn");
  let horizontal = [];
  for (let j = 0; j < columnsInThisTable.length; j++) {
    horizontal.push(columnsInThisTable[j].querySelectorAll(".textCell")[rowIdx]);
  }
  if (currentCell.innerText.trim() === "") {
    //현재셀 빈칸
    if (i < 0) {
      while (colIdx + i > 0 && horizontal[colIdx + i].innerText.trim() === "") {
        colIdx--;
      }
      colIdx--;
    } else {
      while (colIdx + i < lastCol && horizontal[colIdx + i].innerText.trim() === "") {
        colIdx++;
      }
      colIdx++;
    }
  } else {
    //현재셀 글자칸
    if (horizontal[colIdx + i].innerText.trim() === "") {
      // 다음셀 빈칸
      if (i < 0) {
        while (colIdx + i > 0 && horizontal[colIdx + i].innerText.trim() === "") {
          colIdx--;
        }
        colIdx--;
      } else {
        while (colIdx + i < lastCol && horizontal[colIdx + i].innerText.trim() === "") {
          colIdx++;
        }
        colIdx++;
      }
    } else {
      // 다음셀 글자칸
      if (i < 0) {
        while (colIdx + i > 0 && horizontal[colIdx + i].innerText.trim() !== "") {
          colIdx--;
        }
      } else {
        while (colIdx + i < lastCol && horizontal[colIdx + i].innerText.trim() !== "") {
          colIdx++;
        }
      }
    }
  }
  dragIdx = rowIdx;
  clearDrag();
}
function cellDrag() {
  clearDrag();
  let vertical = currentColumn.querySelectorAll(".textCell");
  if (rowIdx > dragIdx && dragIdx > 0) {
    for (let i = dragIdx; i <= rowIdx; i++) {
      vertical[i].classList.add("dragged");
    }
  } else if (dragIdx <= lastRow) {
    for (let i = rowIdx; i <= dragIdx; i++) {
      vertical[i].classList.add("dragged");
    }
  }
}
function clearDrag() {
  let cellsInThisTable = currentTable.querySelectorAll(".textCell");
  for (let i = 0; i < cellsInThisTable.length; i++) {
    cellsInThisTable[i].classList.remove("dragged");
  }
}
function mergeCell() {
  if (!currentPage) {
    return;
  }
  if (currentTable.querySelectorAll(".dragged").length > 1) {
    //병합
    let draggedCells = currentColumn.querySelectorAll(".dragged");
    let numOfDraggedCells = draggedCells.length;
    let totalLength = 0;
    for (let i = 0; i < numOfDraggedCells; i++) {
      totalLength += Number(draggedCells[i].style.flexGrow);
    }
    currentColumn.querySelectorAll(".dragged")[0].style.flex = totalLength;
    for (let i = 1; i < numOfDraggedCells; i++) {
      draggedCells[i].classList.add("hide");
      draggedCells[i].style.flex = 0;
      draggedCells[i].innerText = "";
    }
    currentCell = draggedCells[0];
    currentCell.focus();
    dragIdx = rowIdx;
    clearDrag();
  } else {
    //해제
    let numOfHiddenCells = currentCell.style.flexGrow - 1;
    currentCell.style.flex = 1;
    for (let i = 1; i <= numOfHiddenCells; i++) {
      currentColumn.querySelectorAll(".textCell")[rowIdx + i].classList.remove("hide");
      currentColumn.querySelectorAll(".textCell")[rowIdx + i].style.flex = 1;
    }
    currentCell.focus();
  }
}
function fontSizeUp() {
  if (!currentPage || !currentColumn) {
    return;
  }
  let draggedCells = currentColumn.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      if (cell.style.fontSize === "") {
        cell.style.fontSize = "100%";
      }
      cell.style.fontSize = Number(cell.style.fontSize.slice(0, -1)) + 10 + "%";
    });
  } else {
    if (currentCell.style.fontSize === "") {
      currentCell.style.fontSize = "100%";
    }
    currentCell.style.fontSize = Number(currentCell.style.fontSize.slice(0, -1)) + 10 + "%";
  }
  findFontSize();
}
function fontSizeDown() {
  if (!currentPage || !currentColumn) {
    return;
  }
  let draggedCells = currentColumn.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      if (cell.style.fontSize === "") {
        cell.style.fontSize = "100%";
      }
      cell.style.fontSize = Number(cell.style.fontSize.slice(0, -1)) - 10 + "%";
    });
  } else {
    if (currentCell.style.fontSize === "") {
      currentCell.style.fontSize = "100%";
    }
    currentCell.style.fontSize = Number(currentCell.style.fontSize.slice(0, -1)) - 10 + "%";
  }
  findFontSize();
}
function fontBold() {
  if (!currentPage || !currentColumn) {
    return;
  }
  let draggedCells = currentColumn.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      cell.classList.toggle("fontBold");
    });
  } else {
    currentCell.classList.toggle("fontBold");
  }
}
function fontCancel() {
  if (!currentPage || !currentColumn) {
    return;
  }
  let draggedCells = currentColumn.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      cell.classList.toggle("fontCancel");
    });
  } else {
    currentCell.classList.toggle("fontCancel");
  }
}
function findFontSize() {
  //here
  if (currentCell.style.fontSize === "") {
    viewFont.innerText = "100%";
  } else {
    viewFont.innerText = currentCell.style.fontSize;
  }
}
function cancelCtrl() {
  if (currentPage.querySelector(".ctrlCells")) {
    let allCtrlCells = currentPage.querySelectorAll(".ctrlCells");
    for (let i = 0; i < allCtrlCells.length; i++) {
      allCtrlCells[i].classList.remove("ctrlCells");
    }
  }
}
function ctrlC() {
  dataCtrl = [];
  cancelCtrl();

  let draggedCells = currentTable.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      cell.classList.add("ctrlCells");
      let tempData = {};
      tempData.flexGrow = Number(cell.style.flexGrow); // 1
      tempData.text = cell.innerText; // 2
      tempData.fontSize = cell.style.fontSize; // 3
      if (cell.classList.contains("fontBold")) {
        tempData.fontBold = "bold"; // 4
      }
      if (cell.classList.contains("fontCancel")) {
        tempData.fontCancel = "cancel"; // 5
      }
      dataCtrl.push(tempData);
    });
    console.log(dataCtrl);
  } else {
    currentCell.classList.add("ctrlCells");
    let tempData = {};
    tempData.flexGrow = Number(currentCell.style.flexGrow); // 1
    tempData.text = currentCell.innerText; // 2
    tempData.fontSize = currentCell.style.fontSize; // 3
    if (currentCell.classList.contains("fontBold")) {
      tempData.fontBold = "bold"; // 4
    }
    if (currentCell.classList.contains("fontCancel")) {
      tempData.fontCancel = "cancel"; // 5
    }
    dataCtrl.push(tempData);
    console.log(dataCtrl);
  }
}
function ctrlX() {
  dataCtrl = [];
  cancelCtrl();

  let draggedCells = currentTable.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      cell.classList.add("ctrlX");
    });
  } else {
    currentCell.classList.add("ctrlX");
  }
}
function ctrlV() {
  let startingCell = currentColumn.querySelectorAll(".textCell");

  //기존셀에 자리있나 확인
  let totalFlexGrow = dataCtrl.reduce((sum, obj) => sum + obj.flexGrow, 0) - 1;
  if (rowIdx + totalFlexGrow > lastRow || dataCtrl[0].flexGrow < startingCell[rowIdx].style.flexGrow || (startingCell[rowIdx + totalFlexGrow].classList.contains("hide") && startingCell[rowIdx + totalFlexGrow + 1].classList.contains("hide")) || startingCell[rowIdx + totalFlexGrow].style.flexGrow > 1) {
    alert("범위가 맞지 않습니다");
    return;
  }

  for (let i = 0; i < dataCtrl.length; i++) {
    if (dataCtrl[i].flexGrow > 1) {
      for (let j = 1; j < dataCtrl[i].flexGrow; j++) {
        startingCell[rowIdx + i + j].classList.add("hide");
      }
    }
    startingCell[rowIdx + i].style.flexGrow = dataCtrl[i].flexGrow; // 1
    startingCell[rowIdx + i].innerText = dataCtrl[i].text; // 2
    startingCell[rowIdx + i].style.fontSize = dataCtrl[i].fontSize; // 3
    if (dataCtrl[i].fontBold) {
      startingCell[rowIdx + i].classList.add("fontBold"); // 4
    }
    if (dataCtrl[i].fontCancel) {
      startingCell[rowIdx + i].classList.add("fontCancel"); // 5
    }
  }
}
function ctrlZ() {
  console.log("ctrlZ");
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
      newTable.setAttribute("tableIndex", i);
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
btnMerge.addEventListener("click", mergeCell);
btnFontUp.addEventListener("click", fontSizeUp);
btnFontDown.addEventListener("click", fontSizeDown);
btnFontBold.addEventListener("click", fontBold);
btnFontCancel.addEventListener("click", fontCancel);
btnViewTeachers.addEventListener("click", viewTeachers);
btnPrint.addEventListener("click", customizedPrint);
