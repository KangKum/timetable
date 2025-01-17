// 변수
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const btnAddPage = document.querySelector(".btnAddPage");

// 함수
// 버튼 좌클릭시 버튼+페이지 추가
function addpage() {
  // 개수 카운팅
  let matchOrder = document.querySelectorAll(".btnPage").length;
  // 버튼 생성
  const newBtnAddPage = document.createElement("button");
  newBtnAddPage.classList.add("btnPage");
  newBtnAddPage.setAttribute("order", matchOrder);
  footer.appendChild(newBtnAddPage);
  // 페이지 생성
  const newPage = document.createElement("div");
  newPage.classList.add("page");
  newPage.setAttribute("order", matchOrder);
  main.appendChild(newPage);
  // 클릭전까지 페이지 숨기기
  newPage.classList.add("hide");
}

// 버튼 우클릭시 이름설정 / 버튼+페이지 삭제

// 이벤트
btnAddPage.addEventListener("click", addpage);
