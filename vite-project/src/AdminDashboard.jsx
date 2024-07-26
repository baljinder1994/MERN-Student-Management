import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, 
  Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Link } from 'react-router-dom';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, 
  Tooltip, Legend, ArcElement, LineElement, PointElement);

const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsByGender, setStudentsByGender] = useState([]);
  const [studentsByBatchYear, setStudentsByBatchYear] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchRollNumber, setSearchRollNumber] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/students/statistics')
      .then(response => {
        setTotalStudents(response.data.totalStudents || 0);
        setStudentsByGender(response.data.studentsByGender || []);
        setStudentsByBatchYear(response.data.studentsByBatchYear || []);
      })
      .catch(error => console.error('Error fetching student statistics:', error));

    axios.get('http://localhost:5000/students')
      .then(response => setStudents(response.data || []))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/students/${id}`)
      .then(() => {
        setStudents(students.filter(student => student._id !== id));
        setSearchedStudent(null);
      })
      .catch(error => console.error('Error deleting student:', error));
  };

  const handleSearch = () => {
    axios.get(`http://localhost:5000/students?rollNumber=${searchRollNumber}`)
      .then(response => setSearchedStudent(response.data))
      .catch(error => console.error('Error searching student:', error));
  };

  const genderLabels = studentsByGender.map(gender => gender._id);
  const genderCounts = studentsByGender.map(gender => gender.count);

  const batchYearLabels = studentsByBatchYear.map(year => year._id);
  const batchYearCounts = studentsByBatchYear.map(year => year.count);

  const pieData = {
    labels: genderLabels,
    datasets: [
      {
        label: 'Student Distribution by Gender',
        data: genderCounts,
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1
      }
    ]
  };

  const lineData = {
    labels: batchYearLabels,
    datasets: [
      {
        label: 'Number of Students by Batch Year',
        data: batchYearCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <ul>
          <li>Dashboard</li>
          <li> <Link to="/add-student"  style={{ color: 'white', textDecoration: 'none' }}>
            Add New Student
          </Link>
          </li>
        
          
          
        </ul>
      </div>
      <div className="main-content">
        <header className="header">
          <h1>Admin Dashboard</h1>
          
        </header>

        <section className="cards-section">
          <div className="card">
            <h2>Total Students</h2>
            <p className="total-students-count">{totalStudents}</p>
          </div>
          <div className="card">
            <h2>Total Teachers</h2>
           
          </div>
          <div className="card">
            <h2>Total Courses</h2>
            
          </div>
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <Pie data={pieData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Student Distribution by Gender'
                }
              }
            }} />
          </div>
          <div className="chart-container">
            <Line data={lineData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Number of Students by Batch Year'
                }
              }
            }} />
          </div>
        </section>

        <section className="search-section">
          <input
            type="text"
            value={searchRollNumber}
            onChange={(e) => setSearchRollNumber(e.target.value)}
            placeholder="Search by Roll Number"
          />
          <button onClick={handleSearch}>Search</button>
        </section>

        {searchedStudent && (
          <section className="students-table-section">
            <h2>Search Result</h2>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Class</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Batch Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchedStudent.name}</td>
                  <td>{searchedStudent.rollNumber}</td>
                  <td>{searchedStudent.class}</td>
                  <td>{searchedStudent.address}</td>
                  <td>{searchedStudent.contactNumber}</td>
                  <td>{searchedStudent.gender}</td>
                  <td>{searchedStudent.batchYear}</td>
                  <td>
                      <Link to={`/edit-student/${searchedStudent._id}`}>Update</Link> 
                
                  <Link to={`/edit-student/${searchedStudent._id}`}>Update</Link> 
                    <button className="delete-button" onClick={() => handleDelete(searchedStudent._id)}>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        <section className="students-table-section">
          <h2>All Students</h2>
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Class</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Gender</th>
                <th>Batch Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.class}</td>
                  <td>{student.address}</td>
                  <td>{student.contactNumber}</td>
                  <td>{student.gender}</td>
                  <td>{student.batchYear}</td>
                  <td>
                  <Link to={`/edit-student/${student._id}`}>
                      <button className='edit-button'>Edit</button>
                    </Link>
                    <button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
