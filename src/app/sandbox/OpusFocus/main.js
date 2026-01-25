document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('opusFocusTasks')) || [];

    function saveTasks() {
        localStorage.setItem('opusFocusTasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `flex items-center justify-between p-4 ${task.isCompleted ? 'bg-gray-700 text-gray-400 line-through' : ''}`;
            li.dataset.id = task.id;

            const titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;
            titleSpan.className = 'text-lg';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex items-center space-x-2';

            const completeButton = document.createElement('button');
            completeButton.className = `p-2 rounded-full ${task.isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'} transition-colors duration-200`;
            completeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check ${task.isCompleted ? 'text-white' : 'text-gray-300'}"><polyline points="20 6 9 17 4 12"/></svg>`;
            completeButton.onclick = () => toggleTaskComplete(task.id);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-200';
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 text-white"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
            deleteButton.onclick = () => deleteTask(task.id);

            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(deleteButton);

            li.appendChild(titleSpan);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const title = newTaskInput.value.trim();
        if (title) {
            const newTask = {
                id: Date.now().toString(), // ID simples
                title,
                isCompleted: false,
                createdAt: new Date().toISOString()
            };
            tasks.push(newTask);
            newTaskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    function toggleTaskComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});