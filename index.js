const studentsList = [];
let sortBy;
let searchBy;
let currentRow = [];
let studentsTable = document.querySelector('.students-content');
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
const createStudentObj = (basicStudentData, extraStudentData, cityWeather) => {
	return { ...basicStudentData, ...extraStudentData, ...cityWeather };
};

const getWeatherData = async (cityName) => {
	const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=`;
	const apiKey = '&APPID=45e704ec8ee73efca64f48c01289ba83';
	const country = 'israel';
	const weatherData = await fetchApi(
		`${weatherUrl}${cityName},${country}${apiKey}`
	);
	return weatherData
		? (parseInt(weatherData.main.temp) - 273.15).toFixed(2)
		: 'city not found';
};

const getStudentsData = async () => {
	const studentsUrl = `https://apple-seeds.herokuapp.com/api/users/`;
	const studentsData = await fetchApi(studentsUrl);
	//console.log(studentsData);
	if (studentsData) {
		for (let student of studentsData) {
			let studentId = student.id;
			const studentData = await fetchApi(studentsUrl + studentId);
			let temp = await getWeatherData(studentData.city);
			let studentObj = createStudentObj(student, studentData, temp);
			studentsList.push(studentObj);
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
	for (const key in student) {
		if (key !== 'cityWeather' && key !== 'HTMLElement') {
			let studentInfo = document.createElement('div');
			if (key === 'city') {
				studentInfo.setAttribute('tooltip', student['cityWeather']);
			}
			studentInfo.setAttribute('data-type', key);
			studentInfo.textContent = student[key];
			studentElement.appendChild(studentInfo);
		}
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
	secondBtn.addEventListener('click', (e) => {
		handleDeleteOrUpdate(e);
	});

	studentsTable.appendChild(studentElement);
	student.HTMLElement = studentElement;
}

function sortStudentsList() {
	let sortFunction;
	sortBy = document.querySelector('#sortBy').value;
	if (sortBy === 'age' || sortBy === 'capsule') {
		sortFunction = function (studentA, studentB) {
			return studentA[sortBy] - studentB[sortBy];
		};
	} else {
		sortFunction = function (studentA, studentB) {
			return studentA[sortBy]
				.toLowerCase()
				.localeCompare(studentB[sortBy].toLowerCase());
		};
	}
	if (sortFunction && studentsList.length) {
		//console.log(sortFunction);
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
	let buttons = row.querySelectorAll('button');
	//console.log(e.target.getAttribute);
	if (typeButton.includes('edit')) {
		columns.forEach((col, index) => {
			if (index !== 0) {
				currentRow.push(col.innerText);
				col.innerHTML = `<input value='${col.innerText}'>`;
			} else {
				currentRow.push(col.innerText);
			}
		});
		buttons[0].innerHTML = '';
		buttons[0].innerHTML = '<i class="far fa-times-circle fa-3x"></i>';
		buttons[1].innerHTML = '';
		buttons[1].innerHTML = '<i class="far fa-check-circle fa-3x"></i>';
	} else {
		columns.forEach((col, index) => {
			//console.log(currentRow[index]);
			col.innerHTML = currentRow[index];
		});
		buttons[0].innerHTML = '';
		buttons[0].innerHTML = `<i class='far fa-edit fa-3x'></i>`;
		buttons[1].innerHTML = '';
		buttons[1].innerHTML = `<i class='far fa-trash-alt fa-3x'></i>`;
	}
}

function handleDeleteOrUpdate(e) {
	let row = e.target.parentElement.parentElement;
	let studentId = row.getAttribute('data-id');
	let currentRow = [];
	let typeButton = e.target.getAttribute('class');
	let columns = row.querySelectorAll('div');
	if (typeButton.includes('trash')) {
		studentsTable.removeChild(row);
		deleteStudent(studentId);
	} else {
		columns.forEach((col, index) => {
			if (index === 0) {
				currentRow.push(parseInt(col.innerText));
			} else {
				console.log(col.querySelector('input').value);
				currentRow.push(col.querySelector('input').value);
			}
		});
		let student = updateStudent(currentRow);
		studentsTable.removeChild(row);
		renderStudent(student);
	}
}

async function onLoad() {
	await getStudentsData();
	renderListStudents();
	sortStudentsList();
}

function deleteStudent(id) {
	let studentIndex = studentsList.findIndex((student) => student.id === id);
	if (studentIndex >= 0) {
		studentsList.splice(studentIndex, 1);
	}
	//updateLocalStorage();
}
function updateStudent(currentStudent) {
	let studentIndex = studentsList.findIndex(
		(student) => student.id === currentStudent[0]
	);
	if (studentIndex >= 0) {
		let i = 0;
		let temp = '';
		let studentData = studentsList[studentIndex];
		for (const key in studentData) {
			if (key !== 'HTMLElement') {
				if (key === 'city' && studentData[key] !== currentStudent[i]) {
					console.log(currentStudent[i]);
					studentData[key] = currentStudent[i];
					temp = getWeatherData(studentData[key]);
					i++;
				} else if (key === 'cityWeather' && temp) {
					studentData[key] = temp;
				} else if (key !== 'cityWeather') {
					studentData[key] = currentStudent[i];
					i++;
				}
			} else {
				studentData[key] = '';
			}
		}
		temp = '';
		return studentData;
	}
	return 'id not found';
}

window.addEventListener('load', onLoad);
