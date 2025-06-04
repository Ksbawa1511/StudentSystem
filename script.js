// Select form and table body elements
const form = document.getElementById('student-form');
const tbody = document.getElementById('students-table-body');
const submitBtn = document.getElementById('submit-btn');

// Array to hold student records in memory
let students = [];
let editIndex = -1; // tracks index of student being edited; -1 means adding new

// Helper: Validate name (only letters and spaces)
function validateName(name) {
    return /^[A-Za-z\s]+$/.test(name.trim());
}

// Helper: Validate student ID (numbers only)
function validateStudentId(id) {
    return /^\d+$/.test(id.trim());
}

// Helper: Validate contact number (7 to 15 digits)
function validateContact(contact) {
    return /^\d{7,15}$/.test(contact.trim());
}

// Helper: Validate email using browser built-in validation
function validateEmail(email) {
    // Using simple regex for email validation here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Load students from localStorage on page load
window.onload = function() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
        renderTable();
    }
};

// Render student data inside the table
function renderTable() {
    tbody.innerHTML = ''; // Clear current content
    students.forEach((student, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.studentId)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.contact)}</td>
            <td class="actions">
                <button class="edit-btn" aria-label="Edit ${escapeHtml(student.name)}" data-index="${index}">Edit</button>
                <button class="delete-btn" aria-label="Delete ${escapeHtml(student.name)}" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Clear the form inputs
function clearForm() {
    form.reset();
    editIndex = -1;
    submitBtn.textContent = 'Add Student';
}

// Handle form submission for adding or editing
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values using standard JavaScript
        const name = form.elements['name'].value.trim();
        const studentId = form.elements['studentId'].value.trim();
        const email = form.elements['email'].value.trim();
        const contact = form.elements['contact'].value.trim();

        // Validate inputs
        if (!name || !studentId || !email || !contact) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateName(name)) {
            alert('Student name should contain only letters and spaces.');
            return;
        }
        if (!validateStudentId(studentId)) {
            alert('Student ID should contain only numbers.');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!validateContact(contact)) {
            alert('Contact number should contain 7 to 15 digits.');
            return;
        }

        if (editIndex === -1) {
            // Add new student
            students.push({ name, studentId, email, contact });
        } else {
            // Update existing student
            students[editIndex] = { name, studentId, email, contact };
        }

        localStorage.setItem('students', JSON.stringify(students));
        renderTable();
        clearForm();
    });
}

// Delegate edit and delete button clicks
tbody.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn')) {
        const index = Number(e.target.getAttribute('data-index'));
        editStudent(index);
    } else if (e.target.classList.contains('delete-btn')) {
        const index = Number(e.target.getAttribute('data-index'));
        deleteStudent(index);
    }
});

// Edit a student record: fill form with data
function editStudent(index) {
    const student = students[index];
    form.name.value = student.name;
    form.studentId.value = student.studentId;
    form.email.value = student.email;
    form.contact.value = student.contact;
    editIndex = index;
    submitBtn.textContent = 'Update Student';
    // Scroll to form for better UX
    form.scrollIntoView({ behavior: 'smooth' });
}

// Delete a student record
function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student record?')) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderTable();
        // If currently editing this record, reset form
        if (editIndex === index) {
            clearForm();
        }
    }
}