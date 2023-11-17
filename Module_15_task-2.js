// Задание 2
// Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана с помощью alert. 

const btnPosition  = document.querySelector(".btn");

btnPosition.addEventListener("click", () => {
    let screenWidth = window.screen.width;
    let screeHeigth = window.screen.height;
    alert(`Ширина ${screenWidth}px, Высота ${screeHeigth}px`)
})
