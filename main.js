const todoFactory = (title, date, project = "", checked = false) => {
    return { title: title, date: date, project: project, checked: checked }
}

const createTodoArray = (() => {

    let todoList = []
    if (JSON.parse(localStorage.getItem("todoList"))) {
        todoList = JSON.parse(localStorage.getItem("todoList"))
        reviveDates()
    }

    //functions
    function reviveDates() {
        todoList.forEach((todo) => {
            todo.date = new Date(todo.date)
        })
    }

    function addTodoList(title, date) {
        todoList.push(todoFactory(title, date))
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }

    function removeTodoList(index) {
        todoList.splice(index, 1)
        localStorage.setItem("todoList", JSON.stringify(todoList))
    }

    return { todoList, addTodoList, removeTodoList }
})()


const manageTodoList = (() => {

    //DOM
    const $addToDoButton = document.querySelector("#add_todo_button")
    const $todoList = document.querySelector(".to_do_list")
    const $todoName = document.querySelector("#todo_name")
    const $todoDate = document.querySelector("#todo_date")
    const $checkBoxes = document.querySelectorAll("#done")

    //Previous data 
    _render(createTodoArray.todoList)

    //Bind events
    $todoList.addEventListener("click", deleteTodo)
    $todoList.addEventListener("click", crossOutDone)

    //Functions
    function addTodo(title, date, project, checked) {

        const todoContent = document.createElement("div")
        todoContent.classList.add("to_do_content")
        todoContent.dataset.index = `${document.querySelectorAll(".to_do_content").length}`
        $todoList.appendChild(todoContent)
        const $todo = document.createElement("p")
        const $date = document.createElement("p")
        const todoButton = document.createElement("button")
        const $checkBox = document.createElement("input")
        $todo.textContent = $todoName.value || title
        if ($todoDate.valueAsDate) {
            const fixedDate = new Date(`${$todoDate.value}T00:00`)
            $date.textContent = `${fixedDate.getDate()}-${fixedDate.toLocaleString('default', { month: 'short' })}-${fixedDate.getFullYear()}`
            createTodoArray.addTodoList($todoName.value, fixedDate)
        } else {
            $date.textContent = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
        }
        todoButton.id = "delete"
        todoButton.textContent = "X"
        $checkBox.type = "checkbox"
        $checkBox.id = "done"
        if (checked) {
            $checkBox.checked = true
            todoContent.classList.add("cross_out")
        }
        todoContent.appendChild($todo)
        todoContent.appendChild($date)
        todoContent.appendChild(todoButton)
        todoContent.appendChild($checkBox)

    }

    function deleteTodo(e) {
        if (e.target.id === "delete") {
            createTodoArray.removeTodoList(e.target.parentElement.dataset.index)
            e.target.parentElement.remove()
            checkList()
        }
    }

    function _render(todoArray) {
        $todoList.innerHTML = ""
        todoArray.forEach((todo) => {
            addTodo(todo.title, todo.date, todo.project, todo.checked)
        })
    }

    function checkList() {
        const $listTitle = document.querySelector(".list_title")
        if ($listTitle.textContent === "Home") {
            _render(createTodoArray.todoList)
        } else if ($listTitle.textContent === "Today") {
            const todayArray = createTodoArray.todoList.filter((todo) => {
                today = new Date
                return todo.date.getDate() === today.getDate() && todo.date.getMonth() === today.getMonth() && todo.date.getFullYear() === today.getFullYear()
            })
            _render(todayArray)
        } else if ($listTitle.textContent === "This Week") {
            const thisWeekArray = createTodoArray.todoList.filter((todo) => {
                today = new Date
                return todo.date.getDay() >= today.getDay() && (todo.date.getDate() - today.getDate()) <= 6 && todo.date.getMonth() === today.getMonth() && todo.date.getFullYear() === today.getFullYear()
            })
            _render(thisWeekArray)
        } else if ($listTitle.textContent = "Projects") {

        }
    }

    function crossOutDone(e) {
        if (e.target.id === "done") {
            e.target.parentElement.classList.toggle("cross_out")
            createTodoArray.todoList[e.target.parentElement.dataset.index].checked = !createTodoArray.todoList[e.target.parentElement.dataset.index].checked
            localStorage.setItem("todoList", JSON.stringify(createTodoArray.todoList))
        }
    }

    return { addTodo, checkList, _render }
})()


const manageSideBar = (() => {

    //DOM
    const $sideBarElements = document.querySelectorAll(".side_bar_element")
    const $listTitle = document.querySelector(".list_title")
    const $projects = document.querySelectorAll(".project_name")

    //Bind events
    $sideBarElements.forEach((element) => element.addEventListener("click", showTitle))
    //Functions
    function showTitle(e) {
        $listTitle.textContent = e.target.textContent
        if (e.target.textContent === "Projects") {
            $projects.forEach((project) => project.classList.toggle("show"))
        } else {
            $projects.forEach((project) => project.classList.remove("show"))
        }
        manageTodoList.checkList()
    }
})()

const managePopup = (() => {

    //DOM
    const $addButton = document.querySelector("#add_todo_button")
    const $pageContent = document.querySelector(".content")
    const $popup = document.querySelector(".popup")
    const $acceptButton = document.querySelector(".popup_accept_button")
    const $cancelButton = document.querySelector(".popup_cancel_button")
    const $todoName = document.querySelector("#todo_name")
    const $todoDate = document.querySelector("#todo_date")

    //Bind events
    $addButton.addEventListener("click", showPopup)
    $acceptButton.addEventListener("click", acceptTodo)
    $cancelButton.addEventListener("click", showPopup)

    //Functions
    function restartInputs() {
        $todoDate.value = ""
        $todoName.value = ""

    }

    function showPopup() {
        restartInputs()
        $pageContent.classList.toggle("blur")
        $popup.classList.toggle("active")
    }

    function acceptTodo() {
        if ($todoName.value && $todoDate.value) {
            manageTodoList.addTodo()
            showPopup()
        }
    }
})()

const manageProjects = (() => {
    //DOM

    const $projects = document.querySelectorAll(".project_name")
    //Bind events
    $projects.forEach((project) => project.addEventListener("click", checkProjects))

    //Functions
    function checkProjects(e) {
        $projects.forEach((project) => {
            if (project.textContent === e.target.textContent) {
                const projectArray = createTodoArray.todoList.filter((todo) => {
                    return todo.project === e.target.textContent
                })
                manageTodoList._render(projectArray)
            }
        })
    }


})()

const events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || []
        this.events[eventName].push(fn)
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0; i < this.events[eventName].lenght; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1)
                    break
                }
            }
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((fn) => fn(data))
        }
    }
}