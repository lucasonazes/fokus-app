const addTaskButton = document.querySelector('.app__button--add-task');
const addTaskForm = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const taskList = document.querySelector('.app__section-task-list');
const taskDescriptionParagraph = document.querySelector('.app__section-active-task-description');

const removeCompletedTasksButton = document.querySelector('#btn-remover-concluidas');
const removeAllTasksButtton = document.querySelector('#btn-remover-todas');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let selectedTask = null;
let selectedTaskList = null;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `

    const p = document.createElement('p');
    p.textContent = task.description;
    p.classList.add('app__section-task-list-item-description');

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    button.onclick = () => {
        const newDescription = prompt('Qual é o novo nome da tarefa?');
        if (newDescription) {
            p.textContent = newDescription;
            task.description = newDescription;
            saveTasks();
        }
    }

    const buttonImage = document.createElement('img');
    buttonImage.setAttribute('src', '/images/edit.png');
    button.append(buttonImage);

    li.append(svg);
    li.append(p);
    li.append(button);

    if (task.complete) {
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', true);
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(element => {
                element.classList.remove('app__section-task-list-item-active');
            });
    
            if (selectedTask == task) {
                taskDescriptionParagraph.textContent = '';
                selectedTask = null;
                selectedTaskList = null;
                return;
            }
            
            selectedTask = task;
            selectedTaskList = li;
            taskDescriptionParagraph.textContent = task.description;
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.append(taskElement);
});

addTaskButton.addEventListener('click', () => {
    addTaskForm.classList.toggle('hidden');
});

addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const task = {
        description: textarea.value,
        complete: false
    }

    tasks.push(task);
    const taskElement = createTaskElement(task);
    taskList.append(taskElement);
    saveTasks();
    textarea.value = '';
    addTaskForm.classList.add('hidden');
});

document.addEventListener('FocoFinalizado', () => {
    if (selectedTask && selectedTaskList) {
        selectedTaskList.classList.remove('app__section-task-list-item-active');
        selectedTaskList.classList.add('app__section-task-list-item-complete');
        selectedTaskList.querySelector('button').setAttribute('disabled', true);
        selectedTask.complete = true;
        saveTasks();
    }
});

const removeTasks = (onlyCompletes) => {
    const selector = onlyCompletes ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';

    document.querySelectorAll(selector).forEach(element => {
        element.remove();
    });

    tasks = onlyCompletes ? tasks.filter(task => !task.complete) : [];
    saveTasks();
}

removeCompletedTasksButton.onclick = () => removeTasks(true);
removeAllTasksButtton.onclick = () => removeTasks(false);
