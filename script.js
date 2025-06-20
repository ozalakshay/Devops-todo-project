const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = [];


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks(); // Render tasks immediately after loading
}

function renderTasks() {
    taskList.innerHTML = ''; // Clear existing tasks from the DOM

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id; // Store the task's ID on the li element

        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="delete-btn">✖</button>
            </div>
        `;

        const taskTextSpan = listItem.querySelector('.task-text');
        taskTextSpan.addEventListener('click', () => toggleComplete(task.id));

        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id, listItem));

        taskList.appendChild(listItem);
    });
}

function addTask() {
    const taskText = taskInput.value.trim(); // Get input value and remove whitespace
    if (taskText !== '') { // Only add if input is not empty
        const newTask = {
            id: Date.now(), // Unique ID based on current timestamp
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(); // Re-render the list to show the new task
        taskInput.value = ''; // Clear the input field
    }
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks(); 
}

function deleteTask(id, listItem) {
    listItem.classList.add('removing');
    listItem.addEventListener('transitionend', () => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(); 
    });
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});


document.addEventListener('DOMContentLoaded', loadTasks);