const timetableForm = document.getElementById("timetableForm");
const timetableBody = document.getElementById("timetableBody");

let currentUser = null;

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadTimetable();
    }
});

// Add/Edit Class
timetableForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const day = document.getElementById("day").value;
    const subject = document.getElementById("subject").value;
    const location = document.getElementById("location").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const classData = {
        day,
        subject,
        location,
        startTime,
        endTime,
        createdAt: new Date().toISOString()
    };

    try {
        const classRef = db.ref("teachers/" + currentUser.uid + "/timetable").push();
        await classRef.set(classData);
        alert("Class added successfully!");
        timetableForm.reset();
        loadTimetable();
    } catch (error) {
        alert("Error adding class: " + error.message);
    }
});

// Load Timetable
function loadTimetable() {
    db.ref("teachers/" + currentUser.uid + "/timetable").on("value", (snapshot) => {
        timetableBody.innerHTML = "";

        if (!snapshot.exists()) {
            timetableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No classes added yet</td></tr>';
            return;
        }

        const classes = [];
        snapshot.forEach((child) => {
            classes.push({
                id: child.key,
                ...child.val()
            });
        });

        // Sort by day
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        classes.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

        classes.forEach((classItem) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${classItem.day}</td>
                <td>${classItem.subject}</td>
                <td>${classItem.location}</td>
                <td>${classItem.startTime} - ${classItem.endTime}</td>
                <td><button onclick="deleteClass('${classItem.id}')" class="btn btn-small btn-danger">Delete</button></td>
            `;
            timetableBody.appendChild(row);
        });
    });
}

// Delete Class
function deleteClass(classId) {
    if (confirm("Are you sure?")) {
        db.ref("teachers/" + currentUser.uid + "/timetable/" + classId).remove();
        loadTimetable();
    }
}

// Load today's classes on home page
function loadTodayClasses(uid) {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    db.ref("teachers/" + uid + "/timetable").on("value", (snapshot) => {
        const todayClassesDiv = document.getElementById("todayClasses");
        if (!todayClassesDiv) return;

        todayClassesDiv.innerHTML = "";

        if (!snapshot.exists()) {
            todayClassesDiv.innerHTML = '<p class="empty-state">No classes today</p>';
            return;
        }

        let todayClasses = [];
        snapshot.forEach((child) => {
            if (child.val().day === today) {
                todayClasses.push(child.val());
            }
        });

        if (todayClasses.length === 0) {
            todayClassesDiv.innerHTML = '<p class="empty-state">No classes today</p>';
            return;
        }

        todayClasses.forEach((classItem) => {
            const classCard = document.createElement("div");
            classCard.className = "class-card";
            classCard.innerHTML = `
                <h3>${classItem.subject}</h3>
                <p><strong>Location:</strong> ${classItem.location}</p>
                <p><strong>Time:</strong> ${classItem.startTime} - ${classItem.endTime}</p>
            `;
            todayClassesDiv.appendChild(classCard);
        });
    });
}if (typeof auth === "undefined" || typeof db === "undefined") {
  console.error("Firebase not initialized; check firebase-config.js");
  return;
}

const timetableForm = document.getElementById("timetableForm");
const timetableBody = document.getElementById("timetableBody");
let currentUser = null;

auth.onAuthStateChanged((user) => {
  if (user && timetableBody) {
    currentUser = user;
    loadTimetable();
  }
});

if (timetableForm) {
  timetableForm.addEventListener("submit", async (e) => {
    // existing submit handler...
  });
}

// keep the rest of the file the same