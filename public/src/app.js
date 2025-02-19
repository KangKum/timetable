import { getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
const db = getFirestore();
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const printPage = document.querySelector(".printPage");
//FOOTER
const btnAddPage = document.querySelector(".btnAddPage");
const modal = document.querySelector(".modalBackground");
const modalNameOrDelete = document.querySelector(".modalNameOrDelete");
const modalReproduceBtn = document.querySelector(".btnReproducePage");
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
const btnAlign = document.querySelector(".btnAlign");
const markCurrentCell = document.querySelector(".markCurrentCell");
const viewFont = document.querySelector(".viewFont");
const btnFontUp = document.querySelector(".btnFontSizeUp");
const btnFontDown = document.querySelector(".btnFontSizeDown");
const btnFontBold = document.querySelector(".btnFontBold");
const btnFontCancel = document.querySelector(".btnFontCancel");
const btnViewTeachers = document.querySelector(".btnViewTeachers");
const btnPrint = document.querySelector(".btnPrint");
const btnSave = document.querySelector(".btnSave");
const btnClass = document.querySelector(".btnClass");
const btnTime = document.querySelector(".btnTime");
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
let ctrlX = false;
let previousMovement = [];
//
let pageName = [];
let createNumOfPage;
let createNumOfTable;
let createNumOfColumn;
let createNumOfRow;
let allColumn = [];
//
let login = false;

while (!login) {
  const userInfo = prompt("비밀번호");

  if (parseInt(userInfo) === 366366) {
    login = true;
  }
}
//클릭된된 테이블 확인
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

  if (clickedTable && clickedTable.getAttribute("tableIndex") === "5") {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate());
    clickedTable.querySelector(".timeCell").innerHTML = "";
    clickedTable.querySelector(".timeCell").innerHTML = newDate.toISOString().split("T")[0].slice(5) + ` (Sat)`;
  } else if (clickedTable && clickedTable.getAttribute("tableIndex") === "6") {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate());
    clickedTable.querySelector(".timeCell").innerHTML = "";
    clickedTable.querySelector(".timeCell").innerHTML = newDate.toISOString().split("T")[0].slice(5) + ` (Sun)`;
  } else {
    if (currentPage) {
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + i);
        currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerHTML = "";
        currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerHTML = newDate.toISOString().split("T")[0].slice(5) + ` (${week[i]})`;
      }
    }
  }
  clickedTable.classList.remove("tableClicked");
  clickedTable = "";
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
          currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerHTML = "";
        } else {
          currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerHTML = time[timeIndex + j - 1] + " - " + time[timeIndex + j];
        }
      }
    }
  } else {
    //한개 테이블블
    for (let j = 1; j <= clickedTable.querySelectorAll(".timeCell").length - 1; j++) {
      if (time[timeIndex + j] === undefined) {
        clickedTable.querySelectorAll(".timeCell")[j].innerHTML = "";
      } else {
        clickedTable.querySelectorAll(".timeCell")[j].innerHTML = time[timeIndex + j - 1] + " - " + time[timeIndex + j];
      }
    }
  }
}
//테이블 숨기기
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

  //테이블 전체
  for (let i = 0; i < 7; i++) {
    let numOfRow = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length;
    let newTextColumn = document.createElement("div");
    newTextColumn.classList.add("textColumn");
    let numOfTextColumn = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn").length;
    for (let j = 0; j < numOfRow; j++) {
      let newTextCell = document.createElement("div");
      newTextCell.classList.add("textCell");
      if (j === 0) {
        newTextCell.classList.add("nameCell");
        newTextCell.addEventListener("keydown", teacherNaming);
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
function deleteCol() {
  if (!currentPage) {
    return;
  }
  const result = confirm("선생님 열을 제거하시겠습니까?");
  // alert("선생님 열을 제거하시겠습니까?");
  if (result) {
    //전체 테이블
    for (let i = 0; i < 7; i++) {
      if (currentPage.querySelectorAll(".dayTable")[i].querySelector(".textColumn")) {
        let numOfCol = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn").length;
        currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn")[numOfCol - 1].remove();
      }
    }
  }
}
function addRow() {
  if (!currentPage) {
    return;
  }

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
function deleteRow() {
  if (!currentPage) {
    return;
  }
  const result = confirm("마지막 행을 제거하시겠습니까?");

  if (result) {
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
    tempWeek.push(currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerHTML);
  }

  for (let i = 0; i < lastCol; i++) {
    let newTeacherTable = document.createElement("div");
    newTeacherTable.classList.add("teacherTable");

    let cloneTimeColumn = currentPage.querySelector(".dayTable").querySelector(".timeColumn").cloneNode(true);
    cloneTimeColumn.addEventListener("click", findClickedTable);
    cloneTimeColumn.querySelector(".timeCell").innerHTML = currentPage.querySelector(".dayTable").querySelectorAll(".textColumn")[i].querySelector(".nameCell").innerHTML;
    newTeacherTable.appendChild(cloneTimeColumn);

    for (let j = 0; j < 5; j++) {
      let cloneTextColumn = currentPage.querySelectorAll(".dayTable")[j].querySelectorAll(".textColumn")[i].cloneNode(true);
      cloneTextColumn.querySelector(".textCell").innerHTML = currentPage.querySelectorAll(".dayTable")[j].querySelector(".timeCell").innerHTML;
      newTeacherTable.appendChild(cloneTextColumn);
    }
    newTeacherTable.querySelectorAll(".textCell").forEach((txtcell) => {
      txtcell.contentEditable = false;
    });
    newDiv.appendChild(newTeacherTable);
  }

  if (btnViewTeachers.innerHTML === "선생님별") {
    currentPage.classList.add("hide");
    btnViewTeachers.innerHTML = "요일별";
    main.appendChild(newDiv);
  } else {
    document.querySelector(".teacherPage").remove();
    currentPage.classList.remove("hide");
    btnViewTeachers.innerHTML = "선생님별";
  }
}
function customizedPrint() {
  if (!currentPage) {
    return;
  }
  let mainWidth = Number(window.getComputedStyle(main).width.slice(0, -2));
  if (clickedTable) {
    let clonePage = clickedTable.cloneNode(true);
    let clonePageWidth = Number(window.getComputedStyle(clickedTable).width.slice(0, -2));

    // if (clonePageWidth > mainWidth - 50) {
    // let ratio = (clonePageWidth - mainWidth) / mainWidth + 0.2;
    clonePage.style.transform = `scale(${0.8})`;
    // }
    printPage.appendChild(clonePage);
    window.print();
    printPage.innerHTML = "";
  } else {
    console.log(currentPage);
    if (currentPage.classList.contains('hide')) {
      //선생님별
      for (let i = 0; i < lastCol; i++) {
        let clonePage = main.querySelectorAll(".teacherTable")[i].cloneNode(true);
        clonePage.style.transform = `scale(${1})`;

        printPage.appendChild(clonePage);
        window.print();
        printPage.innerHTML = "";
      }
    } else {
      //요일별별
      // let mainWidth = Number(window.getComputedStyle(main).width.slice(0, -2));
      for (let i = 0; i < 7; i++) {
        let clonePage = currentPage.querySelectorAll(".dayTable")[i].cloneNode(true);
        let clonePageWidth = Number(window.getComputedStyle(currentPage.querySelectorAll(".dayTable")[i]).width.slice(0, -2));
        // console.log("mainWidth: " + mainWidth);
        // console.log("pageWidth: " + clonePageWidth);
        // if (clonePageWidth > mainWidth - 50) {
        // let ratio = (clonePageWidth - mainWidth) / mainWidth + 0.2;
        clonePage.style.transform = `scale(${0.8})`;
        // }
        printPage.appendChild(clonePage);
        window.print();
        printPage.innerHTML = "";
      }
    }
  }
}
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
  if (rowIdx === 0) {
    markCurrentCell.innerHTML = currentTable.querySelectorAll(".timeCell")[rowIdx].innerHTML;
  } else {
    markCurrentCell.innerHTML = currentTable.querySelectorAll(".timeCell")[rowIdx].innerHTML.split("-")[0];
  }
}
function cellMove(event) {
  let previousCell;

  if (event.ctrlKey && event.shiftKey) {
    if (event.key === "ArrowUp" && rowIdx > 1) {
      event.preventDefault();
      verticalCellDrag(-1);
      cellDrag();
    } else if (event.key === "ArrowDown" && rowIdx < lastRow) {
      event.preventDefault();
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
      ctrlC(false);
    } else if (event.key === "x" || event.key === "X") {
      event.preventDefault();
      ctrlC(true);
    } else if (event.key === "v" || event.key === "V") {
      event.preventDefault();
      ctrlV();
    } else if (event.key === "z" || event.key === "Z") {
      event.preventDefault();
      ctrlZ();
    } else if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      saveData();
    } else if (event.key === "Enter") {
      mergeCell();
    } else if (event.key === "b" || event.key === "B") {
      fontBold();
    }
    // dragIdx = rowIdx;
    // clearDrag();
  } else if (event.shiftKey) {
    let vertical = currentColumn.querySelectorAll(".textCell");
    if (event.key === "ArrowUp" && dragIdx > 1) {
      event.preventDefault();
      dragIdx--;
      while (vertical[dragIdx].classList.contains("hide")) {
        dragIdx--;
      }
      cellDrag();
    } else if (event.key === "ArrowDown" && dragIdx < lastRow) {
      event.preventDefault();
      dragIdx++;
      let tempMove = 0;

      while (vertical[dragIdx].classList.contains("hide")) {
        dragIdx++;
        tempMove++;
        if (dragIdx >= lastRow) {
          dragIdx -= tempMove + 1;
          return;
        }
      }
      cellDrag();
    } else if (event.key === "Enter") {
      //줄바꿈 금지
      // event.preventDefault();
    } else if (event.key === "Tab") {
      event.preventDefault();
      previousCell = currentCell;
      if (colIdx > 0) {
        colIdx--;
        while (currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
          rowIdx--;
        }
      } else if (colIdx === 0) {
        if (currentTable.getAttribute("tableIndex") === "0") {
          currentTable = currentPage.querySelectorAll(".dayTable")[6];
        } else {
          currentTable = currentPage.querySelectorAll(".dayTable")[Number(currentTable.getAttribute("tableIndex")) - 1];
        }
        rowIdx = 1;
        colIdx = 0;
      }
      if (document.querySelector(".mark")) {
        document.querySelector(".mark").classList.remove("mark");
      }
      previousCell.classList.remove("f2Cell");
    } else {
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    previousCell = currentCell;

    if (rowIdx < lastRow) {
      rowIdx++;
      while (rowIdx < lastRow && currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx++;
      }
    }
    if (rowIdx === lastRow && currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
    }
    dragIdx = rowIdx;
    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.remove("f2Cell");
  } else if (event.key === "Tab") {
    event.preventDefault();
    previousCell = currentCell;
    if (colIdx < lastCol) {
      colIdx++;
      while (currentTable.querySelectorAll(".textColumn")[colIdx].querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx--;
      }
    } else if (colIdx === lastCol) {
      if (currentTable.getAttribute("tableIndex") === "6") {
        currentTable = currentPage.querySelectorAll(".dayTable")[0];
      } else {
        currentTable = currentPage.querySelectorAll(".dayTable")[Number(currentTable.getAttribute("tableIndex")) + 1];
      }
      rowIdx = 1;
      colIdx = 0;
    }
    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.remove("f2Cell");
  } else if (event.altKey) {
    event.preventDefault();
  } else if (event.key === "delete" || event.key === "Delete") {
    let draggedCells = currentColumn.querySelectorAll(".dragged");
    if (draggedCells.length > 1) {
      draggedCells.forEach((cell) => {
        rememberMovement(cell, "delete", cell.innerHTML, 0, draggedCells.length);
        cell.classList.remove("texting");
        cell.innerHTML = "";
      });
    } else {
      rememberMovement(currentCell, "delete", currentCell.innerHTML, 0, 0);
      currentCell.innerHTML = "";
      currentCell.classList.remove("texting");
    }
    // console.log(previousMovement);
  } else if (event.key === "F2") {
    event.preventDefault();
    previousCell = currentCell;
    currentCell.classList.add("f2Cell");
    currentCell.classList.remove("texting");

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(event.target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (event.key === "Escape") {
    currentCell.classList.remove("cursorOn");
    currentCell.classList.remove("f2Cell");
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
      let tempMove = 0;
      while (currentColumn.querySelectorAll(".textCell")[rowIdx].classList.contains("hide")) {
        rowIdx++;
        tempMove++;
        if (rowIdx >= lastRow) {
          rowIdx -= tempMove + 1;
          return;
        }
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
      //기존 텍스트 저장
      rememberMovement(currentCell, "text", currentCell.innerHTML);

      if (!currentCell.classList.contains("cursorOn") && event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        currentCell.innerHTML = "";
        currentCell.classList.add("cursorOn");
        currentCell.classList.remove("texting");
      }
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
  if (rowIdx === 0) {
    markCurrentCell.innerHTML = currentTable.querySelectorAll(".timeCell")[rowIdx].innerHTML;
  } else {
    markCurrentCell.innerHTML = currentTable.querySelectorAll(".timeCell")[rowIdx].innerHTML.split("-")[0];
  }
}
function allCellTexting() {
  let allCells = currentPage.querySelectorAll(".textCell");
  for (let i = 0; i < allCells.length; i++) {
    if (allCells[i].innerHTML.trim() !== "") {
      allCells[i].classList.add("texting");
    } else {
      allCells[i].classList.remove("texting");
    }
  }
  timeCellBordering();
}
function timeCellBordering() {
  let tables = currentPage.querySelectorAll(".dayTable .timeColumn");
  for (let j = 0; j < tables.length; j++) {
    let timeCells = tables[j].querySelectorAll(".timeCell");
    for (let i = 0; i < timeCells.length; i++) {
      if (timeCells[i].innerText.slice(-2) === "00") {
        timeCells[i].style.borderBottom = "1px solid black";
        // console.log(Array.from(timeCells[i].parentNode.children).indexOf(timeCells[i]) + 1);
      } else {
        timeCells[i].style.borderBottom = "1px dotted gray";
        timeCells[i].style.fontWeight = "bold";
      }
    }
  }

  let teacherTables = main.querySelectorAll(".teacherTable .timeColumn");
  for (let j = 0; j < teacherTables.length; j++) {
    let timeCells = teacherTables[j].querySelectorAll(".timeCell");
    for (let i = 0; i < timeCells.length; i++) {
      if (timeCells[i].innerText.slice(-2) === "00") {
        timeCells[i].style.borderBottom = "1px solid black";
      } else {
        timeCells[i].style.borderBottom = "1px dotted gray";
        timeCells[i].style.fontWeight = "bold";
      }
    }
  }
}
function verticalCellDrag(i) {
  let vertical = currentCell.parentNode.querySelectorAll(".textCell");
  //현재 셀이 빈셀이면
  if (vertical[dragIdx].innerHTML.trim() === "") {
    if (i < 0) {
      while (dragIdx > 1 && vertical[dragIdx].innerHTML.trim() === "") {
        dragIdx--;
      }
    } else {
      while (dragIdx < lastRow && vertical[dragIdx].innerHTML.trim() === "") {
        dragIdx++;
      }
    }
  } else {
    //현재 셀이 글자셀이면 // 다음 셀이 빈셀 or 글자셀이면
    if (i < 0) {
      if (vertical[dragIdx - 1].innerHTML.trim() === "") {
        //다음 셀이 빈셀
        while (dragIdx > 1 && vertical[dragIdx - 1].innerHTML.trim() === "") {
          dragIdx--;
        }
        if (vertical[dragIdx].classList.contains("hide")) {
          dragIdx--;
        }
      } else {
        //다음 셀이 글자셀
        while (dragIdx > 1 && vertical[dragIdx].innerHTML.trim() !== "") {
          dragIdx--;
        }
        dragIdx++;
      }
    } else {
      if (vertical[dragIdx + 1].innerHTML.trim() === "") {
        //다음 셀이 빈셀
        while (dragIdx < lastRow && vertical[dragIdx + 1].innerHTML.trim() === "") {
          dragIdx++;
        }
        if (vertical[dragIdx].classList.contains("hide")) {
          dragIdx++;
        }
      } else {
        //다음 셀이 글자셀
        while (dragIdx < lastRow && vertical[dragIdx].innerHTML.trim() !== "") {
          dragIdx++;
        }
        dragIdx--;
      }
    }
  }
}
function verticalMove(i) {
  let vertical = currentCell.parentNode.querySelectorAll(".textCell");
  if (currentCell.innerHTML.trim() === "") {
    //현재셀 빈칸
    if (i < 0) {
      while (rowIdx + i > 1 && vertical[rowIdx + i].innerHTML.trim() === "") {
        rowIdx--;
      }
      rowIdx--;
    } else {
      while (rowIdx + i < lastRow && vertical[rowIdx + i].innerHTML.trim() === "") {
        rowIdx++;
      }
      rowIdx++;

      if (rowIdx === lastRow && vertical[rowIdx].classList.contains("hide")) {
        while (vertical[rowIdx].classList.contains("hide")) {
          rowIdx--;
        }
      }
    }
  } else {
    //현재셀 글자칸
    if (vertical[rowIdx + i].innerHTML.trim() === "") {
      //다음셀 빈칸
      if (i < 0) {
        while (rowIdx + i > 1 && vertical[rowIdx + i].innerHTML.trim() === "") {
          rowIdx--;
        }
        rowIdx--;
      } else {
        while (rowIdx + i < lastRow && vertical[rowIdx + i].innerHTML.trim() === "") {
          rowIdx++;
        }
        rowIdx++;

        if (rowIdx === lastRow && vertical[rowIdx].classList.contains("hide")) {
          while (vertical[rowIdx].classList.contains("hide")) {
            rowIdx--;
          }
        }
      }
    } else {
      //다음셀 글자칸
      if (i < 0) {
        while (rowIdx + i > 0 && vertical[rowIdx + i].innerHTML.trim() !== "") {
          rowIdx--;
        }
      } else {
        while (rowIdx + i <= lastRow && vertical[rowIdx + i].innerHTML.trim() !== "") {
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
  if (currentCell.innerHTML.trim() === "") {
    //현재셀 빈칸
    if (i < 0) {
      while (colIdx + i > 0 && horizontal[colIdx + i].innerHTML.trim() === "") {
        colIdx--;
      }
      colIdx--;
    } else {
      while (colIdx + i < lastCol && horizontal[colIdx + i].innerHTML.trim() === "") {
        colIdx++;
      }
      colIdx++;
    }
  } else {
    //현재셀 글자칸
    if (horizontal[colIdx + i].innerHTML.trim() === "") {
      // 다음셀 빈칸
      if (i < 0) {
        while (colIdx + i > 0 && horizontal[colIdx + i].innerHTML.trim() === "") {
          colIdx--;
        }
        colIdx--;
      } else {
        while (colIdx + i < lastCol && horizontal[colIdx + i].innerHTML.trim() === "") {
          colIdx++;
        }
        colIdx++;
      }
    } else {
      // 다음셀 글자칸
      if (i < 0) {
        while (colIdx + i >= 0 && horizontal[colIdx + i].innerHTML.trim() !== "") {
          colIdx--;
        }
      } else {
        while (colIdx + i <= lastCol && horizontal[colIdx + i].innerHTML.trim() !== "") {
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
  let cellsInThisTable = currentPage.querySelectorAll(".textCell");
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
    // CTRLZ
    for (let i = 0; i < draggedCells.length; i++) {
      rememberMovement(draggedCells[i], "merge", draggedCells[i].innerHTML, Number(draggedCells[i].style.flexGrow), draggedCells.length, 0);
    }
    //
    let numOfDraggedCells = draggedCells.length;
    let totalLength = 0;
    for (let i = 0; i < numOfDraggedCells; i++) {
      totalLength += Number(draggedCells[i].style.flexGrow);
    }
    currentColumn.querySelectorAll(".dragged")[0].style.flex = totalLength;
    for (let i = 1; i < numOfDraggedCells; i++) {
      draggedCells[i].classList.add("hide");
      draggedCells[i].style.flex = 0;
      draggedCells[i].innerHTML = "";
    }
    currentCell = draggedCells[0];
    currentCell.focus();

    dragIdx = rowIdx;
    clearDrag();
  } else {
    //해제
    let numOfHiddenCells = Number(currentCell.style.flexGrow) - 1;
    // CTRLZ
    rememberMovement(currentCell, "demerge", currentCell.innerHTML, numOfHiddenCells, 0);
    //
    currentCell.style.flex = 1;
    for (let i = 1; i <= numOfHiddenCells; i++) {
      currentColumn.querySelectorAll(".textCell")[rowIdx + i].classList.remove("hide");
      currentColumn.querySelectorAll(".textCell")[rowIdx + i].style.flex = 1;
    }
    currentCell.focus();
  }
}
function teacherNaming(event) {
  if (event.key === "Enter" || event.key === "Tab") {
    let index = Number(this.getAttribute("colIndex"));
    for (let i = 0; i < 5; i++) {
      currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".textColumn")[index].querySelector(".nameCell").innerHTML = this.innerHTML;
    }
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
    viewFont.innerHTML = "100%";
  } else {
    viewFont.innerHTML = currentCell.style.fontSize;
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
function ctrlC(x) {
  dataCtrl = [];
  cancelCtrl();

  if (x === true) {
    ctrlX = true;
  }

  let draggedCells = currentTable.querySelectorAll(".dragged");
  if (draggedCells.length > 1) {
    draggedCells.forEach((cell) => {
      cell.classList.add("ctrlCells");
      let tempData = {};
      tempData.flexGrow = Number(cell.style.flexGrow); // 1
      tempData.text = cell.innerHTML; // 2
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
    tempData.text = currentCell.innerHTML; // 2
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
function ctrlV() {
  let startingCell = currentColumn.querySelectorAll(".textCell");

  //기존셀에 자리있나 확인
  let totalFlexGrow = dataCtrl.reduce((sum, obj) => sum + obj.flexGrow, 0) - 1;
  if (rowIdx + totalFlexGrow > lastRow || dataCtrl[0].flexGrow < startingCell[rowIdx].style.flexGrow || (startingCell[rowIdx + totalFlexGrow].classList.contains("hide") && startingCell[rowIdx + totalFlexGrow + 1].classList.contains("hide")) || startingCell[rowIdx + totalFlexGrow].style.flexGrow > 1) {
    alert("범위가 맞지 않습니다");
    return;
  }

  // CTRLZ
  for (let i = 0; i < totalFlexGrow + 1; i++) {
    rememberMovement(startingCell[rowIdx + i], "ctrlV", startingCell[rowIdx + i].innerHTML, Number(startingCell[rowIdx + i].style.flexGrow), totalFlexGrow);
  }
  // console.log(previousMovement);
  //
  if (ctrlX) {
    //셀 원상복귀
    let ctrlCells = currentPage.querySelectorAll(".ctrlCells");
    for (let i = 0; i < ctrlCells.length; i++) {
      ctrlCells.forEach((cell) => {
        if (cell.style.flexGrow > 1) {
          let cellRow = Number(cell.getAttribute("rowIndex"));
          for (let j = 1; j < cell.style.flexGrow; j++) {
            cell.parentNode.querySelectorAll(".textCell")[cellRow + j].classList.remove("hide");
            cell.parentNode.querySelectorAll(".textCell")[cellRow + j].style.flexGrow = 1;
          }
        }
        cell.style.flexGrow = 1;
        cell.innerHTML = "";
        cell.style.fontSize = "";
        cell.classList.remove("fontBold");
        cell.classList.remove("fontCancel");
      });
    }
    ctrlX = false;
    cancelCtrl();
  }
  //////////////////////////////////////////////////////////////////////////////////////
  // 병합셀을 CTRL + V 하면 FLEXGROW가 0이 안돼!
  //////////////////////////////////////////////////////////////////////////////////////
  for (let i = 0; i < dataCtrl.length; i++) {
    if (dataCtrl[i].flexGrow > 1) {
      for (let j = 1; j < dataCtrl[i].flexGrow; j++) {
        startingCell[rowIdx + i + j].classList.add("hide");
        startingCell[rowIdx + i + j].style.flexGrow = 0;
      }
    }
    startingCell[rowIdx + i].style.flexGrow = dataCtrl[i].flexGrow; // 1
    startingCell[rowIdx + i].innerHTML = dataCtrl[i].text; // 2
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
  //이전 셀에 복사
  cancelCtrl();
  console.log(previousMovement);

  let previousCell = previousMovement[previousMovement.length - 1].cellInfo;
  if (previousMovement[previousMovement.length - 1].cellType === "text") {
    previousCell.innerHTML = previousMovement[previousMovement.length - 1].cellContent;
    if (previousMovement.length > 1) {
      previousMovement.pop();
    }

    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.add("mark");
  } else if (previousMovement[previousMovement.length - 1].cellType === "merge") {
    let i = 0;
    let maxLoop = previousMovement[previousMovement.length - 1].cellLoop;

    while (maxLoop > i) {
      if (previousMovement[previousMovement.length - 1].cellFlexGrow > 0) {
        previousMovement[previousMovement.length - 1].cellInfo.classList.remove("hide");
      }
      previousMovement[previousMovement.length - 1].cellInfo.style.flexGrow = previousMovement[previousMovement.length - 1].cellFlexGrow;
      previousMovement[previousMovement.length - 1].cellInfo.innerHTML = previousMovement[previousMovement.length - 1].cellContent;
      previousMovement.pop();
      i++;
    }

    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.add("mark");
  } else if (previousMovement[previousMovement.length - 1].cellType === "demerge") {
    let i = 1;
    let maxLoop = previousMovement[previousMovement.length - 1].cellFlexGrow;
    while (maxLoop >= i) {
      previousMovement[previousMovement.length - 1].cellInfo.parentNode.querySelectorAll(".textCell")[Number(previousMovement[previousMovement.length - 1].cellInfo.getAttribute("rowIndex")) + i].classList.add("hide");
      i++;
    }
    previousMovement[previousMovement.length - 1].cellInfo.style.flexGrow = previousMovement[previousMovement.length - 1].cellFlexGrow + 1;
    previousMovement[previousMovement.length - 1].cellInfo.innerHTML = previousMovement[previousMovement.length - 1].cellContent;
    previousMovement.pop();

    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.add("mark");
  } else if (previousMovement[previousMovement.length - 1].cellType === "ctrlV") {
    let i = 0;
    let maxLoop = previousMovement[previousMovement.length - 1].cellLoop;

    while (maxLoop >= i) {
      if (previousMovement[previousMovement.length - 1].cellInfo.classList.contains("hide")) {
        previousMovement[previousMovement.length - 1].cellInfo.classList.remove("hide");
      }
      previousMovement[previousMovement.length - 1].cellInfo.style.flexGrow = previousMovement[previousMovement.length - 1].cellFlexGrow;
      previousMovement[previousMovement.length - 1].cellInfo.innerHTML = previousMovement[previousMovement.length - 1].cellContent;
      previousMovement.pop();
      i++;
    }
  } else if (previousMovement[previousMovement.length - 1].cellType === "delete") {
    previousMovement[previousMovement.length - 1].cellInfo.innerHTML = previousMovement[previousMovement.length - 1].cellContent;
    previousMovement.pop();

    if (document.querySelector(".mark")) {
      document.querySelector(".mark").classList.remove("mark");
    }
    previousCell.classList.add("mark");
  }
}
function rememberMovement(cell, type, content, flex, loop) {
  let movement = {};
  movement.cellInfo = cell;
  movement.cellType = type;
  movement.cellContent = content;
  movement.cellFlexGrow = flex;
  movement.cellLoop = loop;
  previousMovement.push(movement);
  if (previousMovement.length > 1 && previousMovement[previousMovement.length - 2].cellInfo === previousMovement[previousMovement.length - 1].cellInfo) {
    previousMovement.pop();
  }
}
function checkClass() {
  const allClasses = [];
  for (let i = 0; i < 7; i++) {
    let allTextingCell = currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".texting:not(.nameCell)");
    for (let j = 0; j < allTextingCell.length; j++) {
      let tempObj = {};
      tempObj.class = allTextingCell[j].innerText;
      tempObj.time = Number(allTextingCell[j].style.flexGrow) / 2;
      allClasses.push(tempObj);
    }
  }

  const mergedData = allClasses.reduce((acc, item) => {
    if (acc[item.class]) {
      acc[item.class].time += item.time;
    } else {
      acc[item.class] = { ...item };
    }
    return acc;
  }, {});
  const result = Object.values(mergedData);
  result.sort((a, b) => a.time - b.time);

  const newWindow = window.open("", "_blank", "width=400,height=600");
  const htmlContent = `<html>
    <head>
        <title>배열 데이터</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
        </style>
    </head>
    <body>
        <h2>배열 데이터</h2>
        <table>
            <thead>
                <tr>
                    <th>이름</th>
                    <th>값</th>
                </tr>
            </thead>
            <tbody>
                ${result.map((item) => `<tr><td>${item.class}</td><td>${item.time}</td></tr>`).join("")}
            </tbody>
        </table>
    </body>
    </html>
`;
  newWindow.document.write(htmlContent);
  newWindow.document.close();
}
function checkTime() {
  const numOfTeachers = currentPage.querySelectorAll(".dayTable")[0].querySelectorAll(".textColumn").length;
  const teacherTimeArray = [];
  for (let i = 0; i < numOfTeachers; i++) {
    let teacherAndTime = {};
    let teacher = currentPage.querySelectorAll(".dayTable")[0].querySelectorAll(".textColumn")[i].querySelector(".nameCell").innerText;
    let times = 0;
    for (let j = 0; j < 5; j++) {
      const elements = currentPage.querySelectorAll(".dayTable")[j].querySelectorAll(`.texting:not(.nameCell)[colIndex='${i}']`);
      elements.forEach((cell) => {
        times += Number(cell.style.flexGrow) / 2;
      });
    }
    teacherAndTime.teacher = teacher;
    teacherAndTime.time = times;
    teacherTimeArray.push(teacherAndTime);
  }
  const message = teacherTimeArray.map((item, index) => `${item.teacher}: ${item.time}`).join("\n");
  alert(message);
}
/////////////////////////////////////////////////////////FOOTER///////////////////////////////////////////////////////////
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
function openPage(event) {
  clickedTable = "";
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

      newTable.querySelector(".timeCell").innerHTML = week[i];
    }
  }

  headerInit();
}
function openModal(event) {
  tempPageOrder = event.target.getAttribute("order");
  modal.classList.remove("hide");
}
function modalNaming() {
  modalReproduceBtn.classList.add("hide");
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
    document.querySelector(`.btnPage[order="${tempPageOrder}"]`).innerHTML = modalNameInput.value.trim();
    modalNameInput.value = "";
    modalReproduceBtn.classList.remove("hide");
    modalDeleteBtn.classList.remove("hide");
    modalNameBtn.classList.remove("hide");
    modalNameInput.classList.add("hide");
    modal.classList.add("hide");
  }
}
function btnPageReproduce() {
  //페이지
  let nextOrder = Number(footer.querySelectorAll(".btnPage")[footer.querySelectorAll(".btnPage").length - 1].getAttribute("order")) + 1;
  const newPage = main.querySelector(`.page[order="${tempPageOrder}"]`).cloneNode(true);
  newPage.setAttribute("order", nextOrder);
  newPage.classList.add("hide");
  main.appendChild(newPage);

  //테이블 및 행열
  newPage.querySelectorAll(".textCell").forEach((textCell) => {
    textCell.addEventListener("keydown", cellMove);
    textCell.addEventListener("click", findCurrentCell);
  });
  newPage.querySelectorAll(".timeColumn").forEach((timeColumn) => {
    timeColumn.addEventListener("click", findClickedTable);
  });

  //버튼
  const newPageBtn = footer.querySelector(`.btnPage[order="${tempPageOrder}"]`).cloneNode(true);
  newPageBtn.setAttribute("order", nextOrder);
  newPageBtn.classList.remove("btnClicked");
  newPageBtn.addEventListener("click", openPage);
  newPageBtn.addEventListener("contextmenu", openModal);
  newPageBtn.innerHTML += "(2)";
  footer.appendChild(newPageBtn);

  closeModal();
}
function closeModal() {
  modalReproduceBtn.classList.remove("hide");
  modalDeleteBtn.classList.remove("hide");
  modalNameBtn.classList.remove("hide");
  modalNameInput.classList.add("hide");
  modal.classList.add("hide");
}
function closePreventModal(event) {
  event.stopPropagation();
}
btnAddPage.addEventListener("click", addPage);
modalReproduceBtn.addEventListener("click", btnPageReproduce);
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
btnAlign.addEventListener("click", allCellTexting);
btnFontUp.addEventListener("click", fontSizeUp);
btnFontDown.addEventListener("click", fontSizeDown);
btnFontBold.addEventListener("click", fontBold);
btnFontCancel.addEventListener("click", fontCancel);
btnViewTeachers.addEventListener("click", viewTeachers);
btnViewTeachers.addEventListener("click", saveData);
btnPrint.addEventListener("click", customizedPrint);
btnSave.addEventListener("click", saveData);
btnClass.addEventListener("click", checkClass);
btnTime.addEventListener("click", checkTime);
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && (event.key === "p" || event.key === "P")) {
    event.preventDefault();
    customizedPrint();
  }
});
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
document.addEventListener("keydown", (event) => {
  if (event.altKey) {
    let allPages = main.querySelectorAll(".page");
    let allPageButtons = footer.querySelectorAll(".btnPage");
    let currentPageOrder;
    for (let i = 0; i < allPages.length; i++) {
      if (!allPages[i].classList.contains("hide")) {
        currentPageOrder = i;
      }
    }

    if (event.key === "ArrowUp") {
      if (currentPageOrder > 0) {
        currentPage.classList.add("hide");
        allPages[currentPageOrder - 1].classList.remove("hide");
        currentPage = allPages[currentPageOrder - 1];

        allPageButtons[currentPageOrder].classList.remove("btnClicked");
        allPageButtons[currentPageOrder - 1].classList.add("btnClicked");
        currentPageOrder--;
      }
    } else if (event.key === "ArrowDown") {
      if (currentPageOrder < allPages.length - 1) {
        currentPage.classList.add("hide");
        allPages[currentPageOrder + 1].classList.remove("hide");
        currentPage = allPages[currentPageOrder + 1];

        allPageButtons[currentPageOrder].classList.remove("btnClicked");
        allPageButtons[currentPageOrder + 1].classList.add("btnClicked");
        currentPageOrder++;
      }
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
getData();
async function saveData() {
  document.querySelectorAll(".ctrlCells").forEach((cell) => {
    cell.classList.remove("ctrlCells");
  });
  let pages = document.querySelectorAll(".page");
  let pageButtons = document.querySelectorAll(".btnPage");
  let pageArray = [];
  for (let i = 0; i < pages.length; i++) {
    let singlePage = {};
    let tableArray = [];
    let tables = pages[i].querySelectorAll(".dayTable");
    for (let j = 0; j < tables.length; j++) {
      let singleTable = {};
      let columnArray = [];
      let columns = tables[j].querySelectorAll(".textColumn");
      for (let k = 0; k < columns.length + 1; k++) {
        let singleColumn = {};
        let cellArray = [];
        let cells;
        if (k === 0) {
          cells = tables[j].querySelector(".timeColumn").querySelectorAll(".timeCell");
        } else {
          cells = columns[k - 1].querySelectorAll(".textCell");
        }
        for (let m = 0; m < cells.length; m++) {
          let singleCell = {};
          singleCell.text = cells[m].innerHTML;
          singleCell.flex = cells[m].style.flexGrow;
          //
          singleCell.fontSize = cells[m].style.fontSize;
          cells[m].classList.contains("fontBold") ? (singleCell.fontBold = "true") : "";
          cells[m].classList.contains("fontCancel") ? (singleCell.fontCancel = "true") : "";
          cells[m].classList.contains("texting") ? (singleCell.texting = "true") : "";
          //
          cellArray.push(singleCell);
        }
        singleColumn.columnIndex = k;
        singleColumn.columnData = cellArray;
        columnArray.push(singleColumn);
      }
      singleTable.tableIndex = j;
      singleTable.tableData = columnArray;
      tableArray.push(singleTable);
    }
    singlePage.pageIndex = i;
    singlePage.pageBtnName = pageButtons[i].innerHTML;
    singlePage.pageData = tableArray;
    pageArray.push(singlePage);
  }
  allCellTexting();
  if (document.querySelector(".mark")) {
    document.querySelector(".mark").classList.remove("mark");
  }

  await setDoc(doc(db, "pageData", "data"), {
    data: pageArray,
  });
  // console.log(pageArray);
}
async function getData() {
  allColumn = [];
  const docSnap = await getDoc(doc(db, "pageData", "data"));
  if (!docSnap.data()) {
    return;
  }
  createNumOfPage = docSnap.data().data.length;
  docSnap.data().data.forEach((page, pageIndex) => {
    // console.log(pageIndex, page.pageBtnName);
    pageName.push(page.pageBtnName);

    createNumOfTable = page.pageData.length;
    page.pageData.forEach((table, tableIndex) => {
      // console.log(tableIndex, table.tableData);

      createNumOfColumn = table.tableData.length;
      table.tableData.forEach((column, columnIndex) => {
        // console.log(columnIndex, column);
        let tempObj = {};
        tempObj.pageIndex = pageIndex;
        tempObj.data = column;
        allColumn.push(tempObj);

        createNumOfRow = column.columnData.length;
        column.columnData.forEach((cell) => {
          // console.log(cell);
        });
      });
    });
  });
  createInit(allColumn);
}
function createInit(data) {
  // console.log(data);
  for (let i = 0; i < createNumOfPage; i++) {
    const dataByPageIndex = data.filter((obj) => obj.pageIndex === i);
    // console.log(dataByPageIndex);
    let numOfColInOneTable = dataByPageIndex.length / 7;
    const newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.setAttribute("order", i);

    const newPageButton = document.createElement("button");
    newPageButton.classList.add("btnPage");
    newPageButton.setAttribute("order", i);
    newPageButton.addEventListener("click", openPage);
    newPageButton.addEventListener("contextmenu", openModal);
    newPageButton.innerHTML = pageName[i];

    if (i === 0) {
      currentPage = newPage;
      newPageButton.classList.add("btnClicked");
    } else {
      newPage.classList.add("hide");
    }

    let p = 0;
    for (let j = 0; j < 7; j++) {
      const newTable = document.createElement("div");
      newTable.classList.add("dayTable");
      newTable.setAttribute("tableIndex", j);
      for (let k = 0; k < numOfColInOneTable; k++) {
        const newColumn = document.createElement("div");
        k === 0 ? newColumn.classList.add("timeColumn") : newColumn.classList.add("textColumn");
        if (newColumn.classList.contains("timeColumn")) {
          newColumn.addEventListener("click", findClickedTable);
        }
        for (let m = 0; m < createNumOfRow; m++) {
          const newCell = document.createElement("div");
          if (k === 0) {
            newCell.classList.add("timeCell");
          } else {
            newCell.classList.add("textCell");
            newCell.setAttribute("colIndex", k - 1);
            newCell.setAttribute("rowIndex", m);
            newCell.setAttribute("contenteditable", true);
            newCell.addEventListener("keydown", cellMove);
            newCell.addEventListener("click", findCurrentCell);
            if (m === 0) {
              newCell.classList.add("nameCell");
              newCell.addEventListener("keydown", teacherNaming);
            }
          }

          if (newCell.classList.contains("textCell")) {
            newCell.style.flex = dataByPageIndex[p].data.columnData[m].flex;
            if (Number(dataByPageIndex[p].data.columnData[m].flex) === 0) {
              newCell.classList.add("hide");
            }
          }
          newCell.innerHTML = dataByPageIndex[p].data.columnData[m].text;
          //
          newCell.style.fontSize = dataByPageIndex[p].data.columnData[m].fontSize;
          dataByPageIndex[p].data.columnData[m].fontBold ? newCell.classList.add("fontBold") : "";
          dataByPageIndex[p].data.columnData[m].fontCancel ? newCell.classList.add("fontCancel") : "";
          dataByPageIndex[p].data.columnData[m].texting ? newCell.classList.add("texting") : "";
          //
          newColumn.appendChild(newCell);
        }
        p++;

        newTable.appendChild(newColumn);
      }
      newPage.appendChild(newTable);
    }
    footer.appendChild(newPageButton);
    main.appendChild(newPage);
  }
}