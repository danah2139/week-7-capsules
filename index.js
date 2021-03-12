const studentsList = [];
const apiKey = '45e704ec8ee73efca64f48c01289ba83';
let sortBy;
let searchBy;
//const weatherUrl = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
let studentsTable = document.querySelector('.students-content');
let currentRow;
const fetchApi = async (url) => {
	try {
		let response = await fetch(url);
		if (response.status !== 200) {
			throw new URIError('url not valid');
		}
		let data = await response.json();
		return data;
	} catch (e) {
		console.log(e);
	}
};
const createStudentObj = (basicStudentData, extraStudentData) => {
	return {
		id: basicStudentData.id,
		firstName: basicStudentData.firstName,
		lastName: basicStudentData.lastName,
		capsule: basicStudentData.capsule,
		age: extraStudentData.age,
		city: extraStudentData.city,
		gender: extraStudentData.gender,
		hobby: extraStudentData.hobby,
	};
};

const getStudentsData = async () => {
	const studentsUrl = `https://apple-seeds.herokuapp.com/api/users/`;
	const studentsData = await fetchApi(studentsUrl);
	//console.log(studentsData);
	if (studentsData) {
		for (let student of studentsData) {
			let studentId = student.id;
			const studentData = await fetchApi(studentsUrl + studentId);
			let studentObj = createStudentObj(student, studentData);
			studentsList.push(studentObj);
			//console.log(studentData);
		}
	}
};

function renderListStudents() {
	studentsList.forEach((student) => {
		renderStudent(student);
	});
}
function renderStudent(student) {
	const studentElement = document.createElement('div');
	studentElement.classList.add('student-row');
	studentElement.setAttribute('data-id', student.id);
	for (key in student) {
		let studentInfo = document.createElement('div');
		studentInfo.setAttribute('data-type', key);
		studentInfo.textContent = student[key];
		studentElement.appendChild(studentInfo);
	}
	let firstBtn = document.createElement('button');
	firstBtn.insertAdjacentHTML(
		'afterbegin',
		`<i class='far fa-edit fa-3x'></i>`
	);
	firstBtn.classList.add('btn');
	studentElement.appendChild(firstBtn);
	firstBtn.addEventListener('click', handleEditOrCancel);

	let secondBtn = document.createElement('button');
	secondBtn.insertAdjacentHTML(
		'afterbegin',
		`<i class='far fa-trash-alt fa-3x'></i>`
	);
	secondBtn.classList.add('btn');
	studentElement.appendChild(secondBtn);
	secondBtn.addEventListener('click', () => {
		let row = e.target.parentElement.parentElement;
		let typeButton = e.target.getAttribute('class');
		let columns = row.querySelectorAll('div');
		if (typeButton.includes('trash')) {
			deleteStudent(student.id);
			studentsTable.removeChild(row);
		}
	});

	studentsTable.appendChild(studentElement);
	student.HTMLElement = studentElement;
}

function sortStudentsList() {
	let sortFunction;
	sortBy = document.querySelector('#sortBy').value;
	switch (sortBy) {
		case '0':
			sortFunction = function (studentA, studentB) {
				return studentA.firstName - studentB.firstName;
			};
			break;

		case '1':
			sortFunction = function (studentA, studentB) {
				return studentA.lastName - studentB.lastName;
			};
			break;

		case '2':
			sortFunction = function (studentA, studentB) {
				return studentA.capsule - studentB.capsule;
			};
			break;

		case '3':
			sortFunction = function (studentA, studentB) {
				return studentA.age - studentB.age;
			};
			break;

		case '4':
			sortFunction = function (studentA, studentB) {
				return studentA.city - studentB.city;
			};
			break;

		case '5':
			sortFunction = function (studentA, studentB) {
				return studentA.gender - studentB.gender;
			};
			break;

		case '6':
			sortFunction = function (studentA, studentB) {
				return studentA.hobby - studentB.hobby;
			};
			break;

		default:
			break;
	}
	if (sortFunction && studentsList.length) {
		studentsList.sort(sortFunction);
	}
	updateHTMLRows();
}

function updateHTMLRows() {
	studentsList.forEach((student, index) => {
		student.HTMLElement.style.gridRow = `${index + 2}`;
	});
}

document.querySelector('#sortBy').addEventListener('change', (e) => {
	sortBy = e.target.value;
	sortStudentsList();
});

document.querySelector('#searchBy').addEventListener('change', (e) => {
	searchBy = e.target.value;
});

const handleSearch = (input) => {
	let filter = input.toUpperCase();
	let rows = document.querySelectorAll('.student-row');
	for (let i = 1; i < rows.length; i++) {
		let rowId = rows[i].getAttribute('data-id');
		let col = document.querySelector(
			`[data-id='${rowId}'] [data-type=${searchBy}]`
		);
		if (col) {
			let studentInfo = col.textContent;
			if (studentInfo.toUpperCase().indexOf(filter) > -1) {
				rows[i].style.display = '';
			} else {
				rows[i].style.display = 'none';
			}
		}
	}
};
document.querySelector('#myInput').addEventListener('input', (e) => {
	handleSearch(e.target.value);
});

//function handleCancelEdit() {}

function handleEditOrCancel(e) {
	let row = e.target.parentElement.parentElement;
	let typeButton = e.target.getAttribute('class');
	let columns = row.querySelectorAll('div');
	console.log(e.target.getAttribute);
	if (typeButton.includes('edit')) {
		columns.forEach((col, index) => {
			if (index !== 0) {
				col.innerHTML = `<input value='${col.innerText}'>`;
				currentRow.push(col.innerText);
			} else {
				currentRow.push(col.innerText);
			}
		});
		let buttons = row.querySelectorAll('button');
		buttons[0].innerHTML = '';
		buttons[0].innerHTML = '<i class="far fa-times-circle fa-3x"></i>';
		buttons[1].innerHTML = '';
		buttons[1].innerHTML = '<i class="far fa-check-circle fa-3x"></i>';
	} else {
		columns.forEach((col, index) => {
			col.innerHTML = currentRow[index];
		});
	}

	// row.innerHTML = `
	// <div>${studentRowData[0]}</td>
	// <div><input data-type value="${studentRowData[1]}"></div>
	// <div><input class="a" value="${studentRowData[2]}"></div>
	// <div><input class="a" value="${studentRowData[3]}"></div>
	// <div><input class="a" value="${studentRowData[4]}"></div>
	// <div><input  class="a" value="${studentRowData[5]}"></div>
	// <div><input class="a" value="${studentRowData[6]}"></div>
	// <div><input  class="a" value="${studentRowData[7]}"></div>
	// <button class="btn-i"><i class="far fa-times-circle del"></i></button>
	// <button href="#" class="btn-i"><i class="far fa-check-circle acc"></i></button>`;
}

async function onLoad() {
	await getStudentsData();
	renderListStudents();
	sortStudentsList();
}

function deleteStudent(id) {
	let studentId = studentsList.findIndex((student) => student.id === id);
	if (studentId >= 0) {
		studentsList.splice(studentId, 1);
	}
	//updateLocalStorage();
}
function updateStudent() {}

window.addEventListener('load', onLoad);
