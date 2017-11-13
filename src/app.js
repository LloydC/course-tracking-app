const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

//Dependencies configuration
const sequelize = new Sequelize('university_app', process.env.POSTGRES_USER,null,{
  host: 'localhost',
  dialect: 'postgres',
  define: {
  	timestamps: false
  }
});
app.use(express.static('public'));

app.set('views','./src/views');
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended: true}));

//MODELS DEFINITION
const Teacher = sequelize.define('teachers', {
	name: Sequelize.STRING
})

const Student = sequelize.define('students', {
	name: Sequelize.STRING
})

const Subject = sequelize.define('subjects', {
	subject_name: Sequelize.STRING, 
	semester: Sequelize.STRING, 
	classroom: Sequelize.STRING
})
// TABLES RELATIONSHIP/ASSOCIATION

Student.belongsToMany(Teacher, {through: Subject})
Teacher.belongsToMany(Student, {through: Subject})

// ROUTING CONFIGURATION
app.get('/', (req, res)=> {
	Promise.all([
		Student.findAll(),
		Teacher.findAll(),
		Subject.findAll()
	]) // each '.findAll()' will return an array of values
	.then((data)=> {
		console.log(`Here's the data ${data}`);
		data.forEach((e)=>{console.log(`Each instance ${e.length}`)})
		res.render('index',{studentList: data[0], teacherList: data[1], subjectList: data[2]});
	})
	.catch(err=> console.error(err))

	
});

app.get('/addStudent',(req, res)=> {
	res.render('student-form')
})

app.post('/addStudent',(req, res) => {
	Student.create({
		name: req.body.name
	})
	.then(()=> res.redirect('/'))
	.catch(err => {console.error(err)})
	
})

app.get('/addTeacher', (req, res)=> {
	res.render('teacher-form')
})

app.post('/addTeacher', (req, res)=> {
	Teacher.create({
		name: req.body.name
	})
	.then(()=> res.redirect('/'))
	.catch(err => {console.error(err)})
	
})

app.get('/addSubject', (req, res)=> {
	res.render('subject-form')
})

app.post('/addSubject', (req, res)=> {
	Subject.create({
		subject_name: req.body.subject_name,
		semester: req.body.semester,
		classroom: req.body.classroom,
		studentId: req.body.studentId,
		teacherId: req.body.teacherId
	})
	.then(()=> res.redirect('/'))
	.catch(err => {console.error(err)})
	
})

//DB SYNC

sequelize.sync()

app.listen(3000, ()=> {console.log('Course Tracking App listening on port 3000')})
