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
let currentPageOrder;
let tempPageOrder;
let currentPage;

// ////////////////////////////////////////////////////////////////////////////////////////////////////////
// 함수
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
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

// 버튼 좌클릭시 페이지 전환
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

  //첫 클릭시 테이블 7개 생성(월-일) or 페이지 전환
  if (currentPage.childElementCount === 0) {
    for (let i = 0; i < 7; i++) {
      const newTable = document.createElement("div");
      newTable.classList.add("dayTable");
      currentPage.appendChild(newTable);
    }
  }
}
///////////////////////////////////////////////// 테이블 안에 날짜열, 선생님열 그리면서 header버튼기능 활성화하기
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
