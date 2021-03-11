const studentsList = [];
const apiKey = '45e704ec8ee73efca64f48c01289ba83';
//const weatherUrl = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
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
	console.log(studentsList);
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
		studentInfo.textContent = student[key];
		studentElement.appendChild(studentInfo);
	}
	let buttonsContainer = document.createElement('div');
	buttonsContainer.classList.add('buttons-container');
	studentElement.appendChild(buttonsContainer);
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
async function onLoad() {
	await getStudentsData();
	renderListStudents();
	sortStudentsList();
}

function deleteStudent(id) {
	let studentId = studentsList.findIndex(id);
	if (studentId >= 0) {
		studentsList.splice(studentId, 1);
	}
	//updateLocalStorage();
}
function updateStudent() {}

window.addEventListener('load', onLoad);
