/* Todo app javascript */
interface todoObject {
	id: number;
	title: string;
	description: string;
	done: boolean;
}

const todoList: todoObject[] = localStorage.getItem('todos')
	? JSON.parse(<string>localStorage.getItem('todos'))
	: [];

const saveState = (state: object[]) => {
	localStorage.clear();
	localStorage.setItem('todos', JSON.stringify(state));
};

const nextId = (array: todoObject[]): number => {
	const highestId: number = array.reduce((a, c) => (c.id > a ? c.id : a), 0);
	return highestId + 1;
};

const template = (object: any): string => {
	return `<article class="${object.done ? 'todo-done' : 'todo-pending'}" id="${
		object.id
	}">
	  <div class="todo-item-header">
	  <input onclick="changeItemState(${object.id})" type="checkbox" ${
		object.done ? 'checked' : ''
	}/>
	  <h2>${object.title}</h2>
	  <button onclick="removeItem(${object.id})">Remove</button>
	  </div>
	  <p>${object.description}</p>
	  </article>`;
};

window.addEventListener('stateChange', () => {
	saveState(todoList);
	(<HTMLElement>(
		document.querySelector('#todo-board')
	)).innerHTML = todoList.map(obj => template(obj)).join('');
});

class todo {
	id: number;
	title: string;
	description: string;
	done: boolean;
	constructor(id: number, title: string, description: string) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.done = false;
	}
}

// add a new object to the todo list.
(<HTMLElement>document.getElementById('add-button')).addEventListener(
	'click',
	() => {
		const title: string = (<HTMLInputElement>document.getElementById('title'))
			.value;
		const description: string = (<HTMLInputElement>(
			document.getElementById('description')
		)).value;
		if (title.length > 0 && description.length > 0) {
			const id = nextId(todoList);
			const newObj: todoObject = new todo(id, title, description);
			todoList.unshift(newObj);
			window.dispatchEvent(new Event('stateChange'));
		}
	}
);

const changeItemState = (nr: number) => {
	const todo = <todoObject>todoList.find(obj => obj.id === nr);
	todo.done = !todo.done;
	window.dispatchEvent(new Event('stateChange'));
};

const removeItem = (nr: number) => {
	const removeItemIndex: number = todoList.findIndex(obj => obj.id === nr);
	todoList.splice(removeItemIndex, 1);
	window.dispatchEvent(new Event('stateChange'));
};

window.dispatchEvent(new Event('stateChange'));
