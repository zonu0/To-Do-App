const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const downloadPdfBtn = document.getElementById('download-pdf-btn');

// Load tasks from localStorage
function loadTasks() {
    const tasks = getStoredTasks();
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Deadline: ${task.deadlineDate}</p>
                <p>Status: <span class="task-status">${task.status}</span></p>
            </div>
            <button onclick="removeTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Get tasks from localStorage
function getStoredTasks() {
    const storedData = localStorage.getItem('tasks');
    return storedData ? JSON.parse(storedData) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add task function
function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const deadlineDate = document.getElementById('deadline-date').value;
    const status = document.getElementById('status').value;

    if (title && description && deadlineDate && status) {
        const newTask = { title, description, deadlineDate, status };
        const tasks = getStoredTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        loadTasks();
        resetForm();
    } else {
        alert("Please fill in all fields.");
    }
}

// Reset the form after adding a task
function resetForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('deadline-date').value = '';
    document.getElementById('status').value = 'Not Started';
}

// Remove task function
function removeTask(index) {
    const tasks = getStoredTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
}

// Generate and download PDF
function generatePDF() {
    const tasks = getStoredTasks();
    
    if (tasks.length === 0) {
        alert('No tasks available to download.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Monthly To-Do Summary", 14, 20);
    doc.setFontSize(12);

    let yPosition = 30;

    tasks.forEach((task, index) => {
        doc.text(`Task ${index + 1}:`, 14, yPosition);
        doc.text(`Title: ${task.title}`, 14, yPosition + 10);
        doc.text(`Description: ${task.description}`, 14, yPosition + 20);
        doc.text(`Deadline: ${task.deadlineDate}`, 14, yPosition + 30);
        doc.text(`Status: ${task.status}`, 14, yPosition + 40);
        yPosition += 50;  // Increase position for next task
    });

    doc.save("tasks_summary.pdf");
}

// Add event listener for Add Task button
addTaskBtn.addEventListener('click', addTask);

// Add event listener for Download PDF button
downloadPdfBtn.addEventListener('click', generatePDF);

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);
