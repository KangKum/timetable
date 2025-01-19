document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 변수
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const btnAddPage = document.querySelector(".btnAddPage");
const modal = document.querySelector(".modalBackground");
const modalNameOrDelete = document.querySelector(".modalNameOrDelete");
const modalDeleteBtn = document.querySelector(".btnDeletePage");
const modalNameBtn = document.querySelector(".btnRenamePage");
const modalNameInput = document.querySelector(".rename");
const selectTime = document.querySelector(".selectTime");
const selectDate = document.querySelector(".selectDate");
const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const time = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00"];
let currentPageOrder;
let tempPageOrder;
let currentPage;
let currentTable;
// 1.행추가, 열추가 2.테이블숨기기
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 함수
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 현재 테이블 확인
function findCurrentTable(event) {
  if (document.querySelector(".tableClicked")) {
    currentTable = document.querySelector(".tableClicked");
    if (currentTable === event.target.parentNode.parentNode) {
      currentTable.classList.remove("tableClicked");
      currentTable = "";
    } else {
      currentTable.classList.remove("tableClicked");
      currentTable = event.target.parentNode.parentNode;
      currentTable.classList.add("tableClicked");
    }
  } else {
    currentTable = event.target.parentNode.parentNode;
    currentTable.classList.add("tableClicked");
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
      currentPage.querySelectorAll(".dayTable")[i].querySelector(".timeCell").innerText = newDate.toISOString().split("T")[0].slice(5) + `(${week[i]})`;
    }
  }
  if (currentTable) {
    currentTable.classList.remove("tableClicked");
    currentTable = "";
  }
}
//테이블 시간 세팅
function settingTime() {
  //인덱스 찾기
  let timeIndex = time.indexOf(selectTime.value);

  if (currentPage) {
    if (!currentTable) {
      for (let i = 0; i < 7; i++) {
        for (let j = 1; j <= currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell").length - 1; j++) {
          if (time[timeIndex + j - 1] === undefined) {
            currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerText = "";
          } else {
            currentPage.querySelectorAll(".dayTable")[i].querySelectorAll(".timeCell")[j].innerText = time[timeIndex + j - 1];
          }
        }
      }
    } else {
      for (let j = 1; j <= currentTable.querySelectorAll(".timeCell").length - 1; j++) {
        if (time[timeIndex + j - 1] === undefined) {
          currentTable.querySelectorAll(".timeCell")[j].innerText = "";
        } else {
          currentTable.querySelectorAll(".timeCell")[j].innerText = time[timeIndex + j - 1];
        }
      }
    }
  }
}

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
      newTimeColumn.addEventListener("click", findCurrentTable);
      newTable.appendChild(newTimeColumn);

      for (let j = 0; j < 26; j++) {
        const newTimeCell = document.createElement("div");
        newTimeCell.classList.add("timeCell");
        newTimeColumn.appendChild(newTimeCell);
      }

      newTable.querySelector(".timeCell").innerText = week[i];
    }
  }

  //달력날짜 초기화
  selectDate.value = "";
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
btnAddPage.addEventListener("click", addPage);
modalDeleteBtn.addEventListener("click", modalDelete);
modalNameBtn.addEventListener("click", modalNaming);
modalNameInput.addEventListener("keydown", btnPageNaming);
modal.addEventListener("click", closeModal);
modalNameOrDelete.addEventListener("click", closePreventModal);
selectTime.addEventListener("change", settingTime);
selectDate.addEventListener("change", settingDate);
