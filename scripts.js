document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    fetchNews();
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    li.innerHTML = `<span onclick="toggleComplete(this)">${taskText}</span> <button onclick="removeTask(this)">❌</button>`;
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
}

function toggleComplete(task) {
    task.classList.toggle("completed");
    saveTasks();
}

function removeTask(button) {
    button.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.innerText.replace("❌", "").trim(),
            completed: li.querySelector("span").classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `<span onclick="toggleComplete(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span> <button onclick="removeTask(this)">❌</button>`;
        taskList.appendChild(li);
    });
}

function fetchNews() {
    fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=a00d2070e3e44b38ba9b2cecf0b9f6cb")
        .then(response => response.json())
        .then(data => {
            let newsList = document.getElementById("newsList");
            newsList.innerHTML = "";
            data.articles.slice(0, 5).forEach(article => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <div class="news-item">
                        <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
                        <div class="news-content">
                            <a href="${article.url}" target="_blank">${article.title}</a>
                            <p>${article.description || 'No description available.'}</p>
                        </div>
                    </div>
                `;
                newsList.appendChild(li);
            });
        })
        .catch(error => console.log("Error fetching news:", error));
}
