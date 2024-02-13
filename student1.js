// randomAttendance.js
function getRandomAttendance() {
    return Math.random() < 0.5; // สุ่ม true หรือ false
}

// ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON และแสดงบนหน้าเว็บ
function loadAttendanceData() {
    fetch('student_attendance.json') // ตรงนี้ให้เปลี่ยนเส้นทางไฟล์ให้ถูกต้อง
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('attendance-list');
            data.forEach(student => {
                const studentItem = document.createElement('tr');
                studentItem.innerHTML = `
                    <td >${student['รหัสประจำตัว']}</td>
                    <td>${student['ชื่อ']}</td>
                    <td><input type="checkbox" ${getRandomAttendance() ? 'checked' : ''}></td>
                    <td><input type="checkbox" ${getRandomAttendance() ? 'checked' : ''}></td>
                    <td><input type="checkbox" ${getRandomAttendance() ? 'checked' : ''}></td>
                    <td><input type="checkbox" ${getRandomAttendance() ? 'checked' : ''}></td>
                `;
                listContainer.appendChild(studentItem);
            });
        })
        .catch(error => console.error('Error loading the data:', error));
}

//ฟังก์ชันค้นหาชื่อ
function filterNames() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('attendance-list');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName('td')[1]; // ชื่ออยู่ในคอลัมน์ที่ 2
        if (nameColumn) {
            const txtValue = nameColumn.textContent || nameColumn.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

//ฟังก์ชัน export เป็นไฟล์ json
function exportData() {
    const table = document.getElementById('attendance-list');
    const rows = table.getElementsByTagName('tr');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].getElementsByTagName('td');
        const studentData = {
            'รหัสประจำตัว': columns[0].innerText,
            'ชื่อ': columns[1].innerText,
            'สัปดาห์ 1': columns[2].querySelector('input').checked,
            'สัปดาห์ 2': columns[3].querySelector('input').checked,
            'สัปดาห์ 3': columns[4].querySelector('input').checked,
            'สัปดาห์ 4': columns[5].querySelector('input').checked
        };
        data.push(studentData);
    }

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.onload = function () {
    loadAttendanceData();
    document.getElementById('searchInput').addEventListener('keyup', filterNames);
};
