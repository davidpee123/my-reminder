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
    fetch("https://gnews.io/api/v4/top-headlines?lang=en&token=64238933ec119bb632237370a19816e2")
        .then(response => response.json())
        .then(data => {
            let newsList = document.getElementById("newsList");
            newsList.innerHTML = "";
            data.articles.slice(0, 5).forEach(article => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <div class="news-item">
                        <img src="${article.image}" alt="News Image">
                        <div class="news-content">
                            <a href="${article.url}" target="_blank">${article.title}</a>
                            <p>${article.description}</p>
                        </div>
                    </div>
                `;
                newsList.appendChild(li);
            });
        })
        .catch(error => console.log("Error fetching news:", error));
}
