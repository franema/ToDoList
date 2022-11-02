const todoFactory = (title, date) => {
    return { title: title, date: date }
}

const createTodoArray = (() => {
    const todoList = []

    //functions
    function addTodoList(title, date) {
        todoList.push(todoFactory(title, date))
    }

    return { todoList, addTodoList }
})()


const manageTodoList = (() => {

    //DOM
    const $addToDoButton = document.querySelector("#add_todo_button")
    const $todoList = document.querySelector(".to_do_list")
    const $todoName = document.querySelector("#todo_name")
    const $todoDate = document.querySelector("#todo_date")

    //Bind events
    $todoList.addEventListener("click", deleteTodo)

    //Functions
    function addTodo(title, date) {

        const todoContent = document.createElement("div")
        todoContent.classList.add("to_do_content")
        todoContent.dataset.index = `${document.querySelectorAll(".to_do_content").length}`
        $todoList.appendChild(todoContent)
        const $todo = document.createElement("p")
        const $date = document.createElement("p")
        const todoButton = document.createElement("button")
        $todo.textContent = $todoName.value || title
        if($todoDate.valueAsDate) {
            $date.textContent = `${$todoDate.valueAsDate.getDate()}-${$todoDate.valueAsDate.toLocaleString('default', { month: 'short' })}-${$todoDate.valueAsDate.getFullYear()}`
        } else {
            $date.textContent = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
        }
        todoButton.textContent = "Delete"
        todoContent.appendChild($todo)
        todoContent.appendChild($date)
        todoContent.appendChild(todoButton)
        if($todoName.value) {
            createTodoArray.addTodoList($todoName.value, $todoDate.valueAsDate)
        }

    }

    function deleteTodo(e) {
        if (e.target.textContent === "Delete") {
            e.target.parentElement.remove()
        }
    }

    function _render(todoArray) {
        $todoList.innerHTML = ""
        todoArray.forEach((todo) => {
            addTodo(todo.title, todo.date)
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
                return (todo.date.getDate() - today.getDate()) <= 6 && todo.date.getMonth() === today.getMonth() && todo.date.getFullYear() === today.getFullYear()
            })
            _render(thisWeekArray)
        }
    }


    return { addTodo, checkList }
})()


const manageSideBar = (() => {

    //DOM
    const $sideBarElements = document.querySelectorAll(".side_bar_element")
    const $listTitle = document.querySelector(".list_title")

    //Bind events
    $sideBarElements.forEach((element) => element.addEventListener("click", showTitle))


    //Functions
    function showTitle(e) {
        $listTitle.textContent = e.target.textContent
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
        if($todoName.value && $todoDate.value) {
            manageTodoList.addTodo()
            showPopup()
        }
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