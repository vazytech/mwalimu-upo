function updateClock() {
    const clockDisplay = document.getElementById("clockDisplay");
    const timeZone = document.getElementById("timeZone");

    if (clockDisplay) {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        clockDisplay.textContent = time;
        if (timeZone) timeZone.textContent = tz;
    }
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock();
function checkForUpcomingClasses() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.ref("teachers/" + user.uid + "/timetable").on("value", (snapshot) => {
                const now = new Date();
                const today = now.toLocaleDateString("en-US", { weekday: "long" });
                const currentTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

                snapshot.forEach((child) => {
                    const classItem = child.val();
                    if (classItem.day === today) {
                        // Notify 5 minutes before class
                        const classTime = classItem.startTime;
                        if (isClassSoon(currentTime, classTime)) {
                            notifyTeacher(classItem);
                        }
                    }
                });
            });
        }
    });
}

function isClassSoon(currentTime, classTime) {
    const [currHour, currMin] = currentTime.split(":").map(Number);
    const [classHour, classMin] = classTime.split(":").map(Number);

    const currTotalMin = currHour * 60 + currMin;
    const classTotalMin = classHour * 60 + classMin;

    return classTotalMin - currTotalMin <= 5 && classTotalMin - currTotalMin > 0;
}

function notifyTeacher(classItem) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Class Alert!", {
            body: `${classItem.subject} in ${classItem.location} starts in 5 minutes!`,
            icon: "https://via.placeholder.com/100"
        });
    }
}

// Request notification permission
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// Check every minute
setInterval(checkForUpcomingClasses, 60000);
checkForUpcomingClasses();function checkForUpcomingClasses() {
  if (typeof auth === "undefined" || typeof db === "undefined") {
    console.error("Firebase not initialized; check firebase-config.js");
    return;
  }
  auth.onAuthStateChanged((user) => {
    // existing code...
  });
}