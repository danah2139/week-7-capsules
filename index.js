const students = [];
const apiKey = '45e704ec8ee73efca64f48c01289ba83';
//const weatherUrl = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

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
	students.push({
		id: basicStudentData.id,
		firstName: basicStudentData.firstName,
		lastName: basicStudentData.lastName,
		capsule: basicStudentData.capsule,
		age: extraStudentData.age,
		city: extraStudentData.city,
		gender: extraStudentData.gender,
		hobby: extraStudentData.hobby,
	});
};

const getStudentsData = async () => {
	const studentsUrl = `https://apple-seeds.herokuapp.com/api/users/`;
	const studentsData = await fetchApi(studentsUrl);
	//console.log(studentsData);
	if (studentsData) {
		for (let student of studentsData) {
			let studentId = student.id;
			const studentData = await fetchApi(studentsUrl + studentId);
			createStudentObj(student, studentData);
			//console.log(studentData);
		}
	}
};

function onLoad() {
	getStudentsData();
}

window.addEventListener('load', onLoad);
