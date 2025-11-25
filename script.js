let currentUser = null;

// DOM References
const authSection = document.getElementById("auth-section");
const userDashboard = document.getElementById("user-dashboard");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const profileSection = document.getElementById("profile-section");
const logSection = document.getElementById("log-section");
const accountSection = document.getElementById("account-section");
const houseSection = document.getElementById("house-section");
const updatesSection = document.getElementById("updates-section");
const feedbackSection = document.getElementById("feedback-section");
const devModeSection = document.getElementById("dev-mode-section");
const appTitle = document.getElementById("app-title");

// Splash elements
const introOverlay = document.getElementById("intro-overlay");
const introVideo = document.getElementById("intro-video");

// Developer mode password
const DEV_PASSWORD = "AUTOGEN5400";

function hideIntroSplash() {
    if (introOverlay) {
        introOverlay.classList.add("hidden");
    }
    if (introVideo) {
        introVideo.pause();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Splash: video end + safety timeout
    if (introVideo) {
        introVideo.play().catch(() => {});
        introVideo.addEventListener("ended", hideIntroSplash);

        setTimeout(() => {
            if (!introOverlay.classList.contains("hidden")) {
                hideIntroSplash();
            }
        }, 7000);
    }

    // Secret dev access: tap AUTOGEN 7 times
    let titleTapCount = 0;
    let lastTapTime = 0;
    const TAP_RESET_MS = 4000;

    if (appTitle) {
        appTitle.addEventListener("click", () => {
            const now = Date.now();
            if (now - lastTapTime > TAP_RESET_MS) {
                titleTapCount = 0;
            }
            titleTapCount++;
            lastTapTime = now;

            if (titleTapCount >= 7) {
                titleTapCount = 0;
                const pwd = prompt("Developer access: enter password");
                if (pwd === DEV_PASSWORD) {
                    devModeSection.classList.remove("hidden");
                    profileSection.classList.add("hidden");
                    logSection.classList.add("hidden");
                    accountSection.classList.add("hidden");
                    houseSection.classList.add("hidden");
                    updatesSection.classList.add("hidden");
                    feedbackSection.classList.add("hidden");
                    loadDeveloperMode();
                } else {
                    alert("Wrong developer password");
                }
            }
        });
    }

    // Auth section
    const showRegisterBtn = document.getElementById("show-register");
    const showLoginBtn = document.getElementById("show-login");

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener("click", () => {
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
        });
    }

    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    if (registerBtn) {
        registerBtn.addEventListener("click", registerUser);
    }
    if (loginBtn) {
        loginBtn.addEventListener("click", loginUser);
    }

    // Dashboard nav
    const showProfileBtn = document.getElementById("show-profile");
    const showLogBtn = document.getElementById("show-log");
    const showAccountBtn = document.getElementById("show-account");
    const showHouseBtn = document.getElementById("show-house");
    const showUpdatesBtn = document.getElementById("show-updates");
    const showFeedbackBtn = document.getElementById("show-feedback");
    const logoutBtn = document.getElementById("logout-btn");

    if (showProfileBtn) {
        showProfileBtn.addEventListener("click", () => {
            showSection(profileSection);
            loadProfile();
        });
    }

    if (showLogBtn) {
        showLogBtn.addEventListener("click", () => {
            showSection(logSection);
            loadLog();
        });
    }

    if (showAccountBtn) {
        showAccountBtn.addEventListener("click", () => {
            showSection(accountSection);
        });
    }

    if (showHouseBtn) {
        showHouseBtn.addEventListener("click", () => {
            showSection(houseSection);
            loadHouseSummary();
        });
    }

    if (showUpdatesBtn) {
        showUpdatesBtn.addEventListener("click", () => {
            showSection(updatesSection);
        });
    }

    if (showFeedbackBtn) {
        showFeedbackBtn.addEventListener("click", () => {
            showSection(feedbackSection);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    // Energy session
    const earnSubmitBtn = document.getElementById("earn-submit");
    if (earnSubmitBtn) {
        earnSubmitBtn.addEventListener("click", logEnergySession);
    }

    // Home target save
    const saveTargetBtn = document.getElementById("save-target-btn");
    if (saveTargetBtn) {
        saveTargetBtn.addEventListener("click", saveHouseTarget);
    }

    // Feedback submit
    const feedbackSubmitBtn = document.getElementById("feedback-submit");
    if (feedbackSubmitBtn) {
        feedbackSubmitBtn.addEventListener("click", submitFeedback);
    }

    // Dev CSV export
    const exportUserCsvBtn = document.getElementById("export-user-csv");
    const exportAllUsersCsvBtn = document.getElementById("export-all-users-csv");

    if (exportUserCsvBtn) {
        exportUserCsvBtn.addEventListener("click", exportUserLogCsv);
    }
    if (exportAllUsersCsvBtn) {
        exportAllUsersCsvBtn.addEventListener("click", exportAllUsersCsv);
    }

    // Dev internal tabs (Users / Usage / Feedback)
    const devShowUsers = document.getElementById("dev-show-users");
    const devShowUsage = document.getElementById("dev-show-usage");
    const devShowFeedback = document.getElementById("dev-show-feedback");

    if (devShowUsers) {
        devShowUsers.addEventListener("click", () => showDevSubSection("users"));
    }
    if (devShowUsage) {
        devShowUsage.addEventListener("click", () => showDevSubSection("usage"));
    }
    if (devShowFeedback) {
        devShowFeedback.addEventListener("click", () =>
            showDevSubSection("feedback")
        );
    }
});

function showSection(sectionToShow) {
    if (!sectionToShow) return;

    if (profileSection) profileSection.classList.add("hidden");
    if (logSection) logSection.classList.add("hidden");
    if (accountSection) accountSection.classList.add("hidden");
    if (houseSection) houseSection.classList.add("hidden");
    if (updatesSection) updatesSection.classList.add("hidden");
    if (feedbackSection) feedbackSection.classList.add("hidden");
    if (devModeSection) devModeSection.classList.add("hidden");

    sectionToShow.classList.remove("hidden");
}

// Developer-mode internal tabs
function showDevSubSection(which) {
    const usersSec = document.getElementById("dev-users-section");
    const usageSec = document.getElementById("dev-usage-section");
    const feedbackSec = document.getElementById("dev-feedback-section-dev");

    if (!usersSec || !usageSec || !feedbackSec) return;

    usersSec.classList.add("hidden");
    usageSec.classList.add("hidden");
    feedbackSec.classList.add("hidden");

    if (which === "users") usersSec.classList.remove("hidden");
    if (which === "usage") usageSec.classList.remove("hidden");
    if (which === "feedback") feedbackSec.classList.remove("hidden");
}

// Helpers
function isValidPassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpper && hasLower && hasNumber && hasSpecial;
}

// Generate user-id from names
function generateUserIdFromName(firstName, lastName) {
    let base = "";

    const first = (firstName || "").trim().toLowerCase();
    const last = (lastName || "").trim().toLowerCase();

    if (first && last) {
        base = first.length <= last.length ? first : last;
    } else if (first) {
        base = first;
    } else if (last) {
        base = last;
    } else {
        base = "user";
    }

    base = base.replace(/[^a-z]/g, "").slice(0, 12) || "user";

    let userId;
    let attempts = 0;
    do {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        userId = `${base}_${randomNum}`;
        attempts++;
        if (attempts > 20) break;
    } while (localStorage.getItem(`user_${userId}`));

    return userId;
}

// BMI
function calculateBmi(heightValue, heightUnit, weightValue, weightUnit) {
    if (!heightValue || !weightValue) return null;

    let heightMeters;
    if (heightUnit === "cm") {
        heightMeters = heightValue / 100;
    } else {
        heightMeters = heightValue * 0.0254;
    }

    let weightKg;
    if (weightUnit === "kg") {
        weightKg = weightValue;
    } else {
        weightKg = weightValue * 0.45359237;
    }

    if (heightMeters <= 0) return null;

    const bmi = weightKg / (heightMeters * heightMeters);
    return bmi;
}

function getBmiCategory(bmi) {
    if (bmi == null) return "Unknown";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

// Home kWh estimate from appliances
function estimateKwhFromAppliances(fans, acs, fridges) {
    const fanKwh = fans * 18;
    const acKwh = acs * 360;
    const fridgeKwh = fridges * 108;
    return fanKwh + acKwh + fridgeKwh;
}

// User functions
function registerUser() {
    const firstName = document.getElementById("reg-firstname").value.trim();
    const lastName = document.getElementById("reg-lastname").value.trim();
    const age = document.getElementById("reg-age").value.trim();
    const weightVal = parseFloat(document.getElementById("reg-weight").value);
    const weightUnit = document.getElementById("reg-weight-unit").value;
    const heightVal = parseFloat(document.getElementById("reg-height").value);
    const heightUnit = document.getElementById("reg-height-unit").value;
    const dob = document.getElementById("reg-dob").value.trim();
    const pincode = document.getElementById("reg-pincode").value.trim();
    const password = document.getElementById("reg-password").value;
    const passwordConfirm = document.getElementById("reg-password-confirm").value;

    if (!isValidPassword(password)) {
        showMessage(
            "register-message",
            "Invalid password. Must contain uppercase, lowercase, number, and special character.",
            "error"
        );
        return;
    }

    if (password !== passwordConfirm) {
        showMessage(
            "register-message",
            "Passwords do not match. Please confirm again.",
            "error"
        );
        return;
    }

    if (!firstName || !dob || !pincode || !age || !weightVal || !heightVal) {
        showMessage("register-message", "Please fill all required fields.", "error");
        return;
    }

    const bmi = calculateBmi(heightVal, heightUnit, weightVal, weightUnit);
    const bmiCategory = getBmiCategory(bmi);

    const userId = generateUserIdFromName(firstName, lastName);
    const fullName = `${firstName} ${lastName}`.trim();

    const userData = {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        name: fullName,
        age,
        weight: weightVal,
        weight_unit: weightUnit,
        height: heightVal,
        height_unit: heightUnit,
        dob,
        pincode,
        password,
        bmi: bmi,
        bmi_category: bmiCategory,
        energy_kwh_total: 0,
        calories_total: 0,
        monthly_target_kwh: null,
        monthly_bill_inr: null,
        appliances: {
            fans: 0,
            acs: 0,
            fridges: 0,
        },
        log: [],
        day_streak: 0,
        last_login: null,
    };

    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));

    const msg = `User registered successfully! Your ID is: ${userId}`;
    showMessage("register-message", msg, "success");
    alert(msg + "\n\nPlease remember this User ID for future logins.");
}

function loginUser() {
    const userId = document.getElementById("login-id").value.trim();
    const password = document.getElementById("login-password").value;

    const userDataStr = localStorage.getItem(`user_${userId}`);
    if (!userDataStr) {
        showMessage("login-message", "Invalid user ID or password.", "error");
        return;
    }

    const userData = JSON.parse(userDataStr);
    if (userData.password !== password) {
        showMessage("login-message", "Invalid user ID or password.", "error");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (userData.last_login) {
        const lastLoginDate = new Date(userData.last_login);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLoginDate.toISOString().split("T")[0] === today) {
            // already logged
        } else if (
            lastLoginDate.toISOString().split("T")[0] ===
            yesterday.toISOString().split("T")[0]
        ) {
            userData.day_streak += 1;
        } else {
            userData.day_streak = 1;
        }
    } else {
        userData.day_streak = 1;
    }

    userData.last_login = new Date().toISOString();
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));

    currentUser = userId;
    authSection.classList.add("hidden");
    userDashboard.classList.remove("hidden");
    showSection(profileSection);
    loadProfile();
}

function logout() {
    currentUser = null;
    userDashboard.classList.add("hidden");
    authSection.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    document.getElementById("login-id").value = "";
    document.getElementById("login-password").value = "";
}

function loadProfile() {
    if (!currentUser) return;

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }

    const userData = JSON.parse(userDataStr);
    const profileInfo = document.getElementById("profile-info");
    const analyticsSummary = document.getElementById("analytics-summary");
    const bmiExtra = document.getElementById("bmi-extra");

    if (!profileInfo || !analyticsSummary || !bmiExtra) return;

    profileInfo.innerHTML = "";
    analyticsSummary.innerHTML = "";
    bmiExtra.innerHTML = "";

    const weightUnit = userData.weight_unit || "kg";
    const heightUnit = userData.height_unit || "cm";

    const profileFields = [
        { label: "User ID", value: userData.user_id },
        {
            label: "Name",
            value:
                userData.name ||
                ((userData.first_name || "") + " " + (userData.last_name || "")),
        },
        { label: "Age", value: userData.age },
        {
            label: "Weight",
            value: `${userData.weight} ${weightUnit}`,
        },
        {
            label: "Height",
            value: `${userData.height} ${heightUnit}`,
        },
        {
            label: "BMI",
            value: userData.bmi ? userData.bmi.toFixed(1) : "N/A",
        },
        {
            label: "BMI Category",
            value: userData.bmi_category || "Unknown",
        },
        {
            label: "Date of Birth",
            value: userData.dob,
        },
        {
            label: "Pincode",
            value: userData.pincode,
        },
        {
            label: "Day Streak",
            value: userData.day_streak,
        },
    ];

    profileFields.forEach((field) => {
        const item = document.createElement("div");
        item.className = "profile-item";
        item.innerHTML = `<strong>${field.label}</strong><span>${field.value}</span>`;
        profileInfo.appendChild(item);
    });

    // Analytics summary
    const energy = userData.energy_kwh_total || 0;
    const calories = userData.calories_total || 0;
    const sessions = userData.log ? userData.log.length : 0;

    const costPerKwh = 8;
    const co2PerKwh = 0.8;
    const phoneKwh = 0.015;

    const totalSavings = energy * costPerKwh;
    const totalCo2 = energy * co2PerKwh;
    const phoneCharges = energy / phoneKwh;

    const tiles = [
        {
            label: "Total Energy Generated",
            value: `${energy.toFixed(3)} kWh`,
            note: `${(energy * 1000).toFixed(0)} Wh`,
        },
        {
            label: "Total Calories Burned",
            value: `${calories.toFixed(0)} kcal`,
            note: sessions > 0 ? `~ ${(calories / sessions).toFixed(0)} kcal/session` : "",
        },
        {
            label: "Total Sessions",
            value: `${sessions}`,
            note: `Day streak: ${userData.day_streak}`,
        },
        {
            label: "Bill Savings (simulated)",
            value: `₹ ${totalSavings.toFixed(0)}`,
            note: `CO₂ avoided: ${totalCo2.toFixed(2)} kg`,
        },
        {
            label: "Phone Charging Equivalent",
            value: `${phoneCharges.toFixed(1)} full charges`,
            note: "Assuming ~15 Wh per charge",
        },
    ];

    tiles.forEach((t) => {
        const tile = document.createElement("div");
        tile.className = "analytics-tile";
        tile.innerHTML = `
            <div class="analytics-label">${t.label}</div>
            <div class="analytics-value">${t.value}</div>
            ${t.note ? `<div class="analytics-note">${t.note}</div>` : ""}
        `;
        analyticsSummary.appendChild(tile);
    });

    // BMI extra info
    let bmiText = "";
    const bmi = userData.bmi;
    const category = userData.bmi_category;

    if (bmi && userData.height) {
        let heightMeters;
        if (userData.height_unit === "cm") {
            heightMeters = userData.height / 100;
        } else {
            heightMeters = userData.height * 0.0254;
        }

        const minNormal = 18.5 * heightMeters * heightMeters;
        const maxNormal = 24.9 * heightMeters * heightMeters;

        let diffText = "";
        let currentWeightKg =
            userData.weight_unit === "kg"
                ? userData.weight
                : userData.weight * 0.45359237;

        if (category === "Underweight") {
            const gain = Math.max(0, minNormal - currentWeightKg);
            diffText = `You may need to gain about ${gain.toFixed(
                1
            )} kg to reach the normal range.`;
        } else if (category === "Overweight" || category === "Obese") {
            const lose = Math.max(0, currentWeightKg - maxNormal);
            diffText = `You may need to lose about ${lose.toFixed(
                1
            )} kg to reach the normal range.`;
        } else if (category === "Normal weight") {
            diffText = `You are already in the healthy range. Keep maintaining your routine!`;
        }

        bmiText = `
            <p>Your BMI is <strong>${bmi.toFixed(
                1
            )}</strong>, which falls in the <strong>${category}</strong> range.</p>
            <p>Healthy BMI range (for adults): 18.5 – 24.9</p>
            <p>${diffText}</p>
            <hr style="margin:8px 0; border-color:rgba(55,65,81,0.6);" />
            <p><strong>BMI Categories:</strong></p>
            <ul style="margin-left:16px; font-size:13px;">
                <li>Underweight: &lt; 18.5</li>
                <li>Normal: 18.5 – 24.9</li>
                <li>Overweight: 25 – 29.9</li>
                <li>Obese: ≥ 30</li>
            </ul>
        `;
    } else {
        bmiText = "<p>Enter valid height and weight in your profile to see BMI details.</p>";
    }

    bmiExtra.innerHTML = bmiText;
}

function loadLog() {
    if (!currentUser) return;

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }

    const userData = JSON.parse(userDataStr);
    const logEntries = document.getElementById("log-entries");
    if (!logEntries) return;

    logEntries.innerHTML = "";

    if (!userData.log || userData.log.length === 0) {
        logEntries.innerHTML = "<p>No log entries yet.</p>";
        return;
    }

    userData.log.forEach((entry) => {
        const entryElement = document.createElement("div");
        entryElement.className = "log-entry";

        let details = "";
        if (entry.energy_kwh != null) {
            details += `<div>Energy: ${entry.energy_kwh.toFixed(
                3
            )} kWh</div>`;
        }
        if (entry.calories != null) {
            details += `<div>Calories: ${entry.calories.toFixed(
                0
            )} kcal</div>`;
        }
        if (entry.rpm != null || entry.minutes != null) {
            details += `<div>Session: ${
                entry.minutes != null ? entry.minutes + " min" : ""
            } ${
                entry.rpm != null ? "@ " + entry.rpm + " RPM" : ""
            } ${entry.effort ? "(" + entry.effort + ")" : ""}</div>`;
        }

        entryElement.innerHTML = `
            <div class="timestamp">${entry.timestamp}</div>
            <div>${entry.text}</div>
            ${details}
        `;
        logEntries.appendChild(entryElement);
    });
}

function loadHouseSummary() {
    if (!currentUser) return;

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }

    const userData = JSON.parse(userDataStr);
    const summary = document.getElementById("house-summary");
    if (!summary) return;

    summary.innerHTML = "";

    if (userData.monthly_target_kwh) {
        let html = `Current monthly target: <strong>${userData.monthly_target_kwh.toFixed(
            1
        )} kWh</strong>`;
        if (userData.monthly_bill_inr) {
            html += `<br>Approx bill: <strong>₹${userData.monthly_bill_inr}</strong>`;
        }
        summary.innerHTML = html;
    } else {
        summary.innerHTML =
            "<p>No target set yet. Use the form above to create one.</p>";
    }

    const fansInput = document.getElementById("fans-count");
    const acsInput = document.getElementById("acs-count");
    const fridgesInput = document.getElementById("fridges-count");
    const billKwhInput = document.getElementById("bill-kwh");
    const billAmountInput = document.getElementById("bill-amount");

    if (fansInput)
        fansInput.value = (userData.appliances && userData.appliances.fans) || 0;
    if (acsInput)
        acsInput.value = (userData.appliances && userData.appliances.acs) || 0;
    if (fridgesInput)
        fridgesInput.value =
            (userData.appliances && userData.appliances.fridges) || 0;
    if (billKwhInput) billKwhInput.value = userData.monthly_target_kwh || "";
    if (billAmountInput) billAmountInput.value = userData.monthly_bill_inr || "";
}

// Developer Mode
function loadDeveloperMode() {
    const devTableBody = document.getElementById("dev-table-body");
    const devFeedbackList = document.getElementById("dev-feedback-list");
    const devUserSelect = document.getElementById("dev-user-select");
    const devUserAnalytics = document.getElementById("dev-user-analytics");

    if (devTableBody) devTableBody.innerHTML = "";
    if (devFeedbackList) devFeedbackList.innerHTML = "";
    if (devUserSelect) devUserSelect.innerHTML = "";
    if (devUserAnalytics)
        devUserAnalytics.innerHTML = "<p>Select a user to see detailed stats.</p>";

    const users = Object.keys(localStorage).filter((key) =>
        key.startsWith("user_")
    );

    users.forEach((userKey, index) => {
        const userData = JSON.parse(localStorage.getItem(userKey));
        const energy = userData.energy_kwh_total || 0;
        const calories = userData.calories_total || 0;

        if (devTableBody) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${userData.user_id}</td>
                <td>${userData.name || userData.first_name || ""}</td>
                <td>${energy.toFixed(3)}</td>
                <td>${calories.toFixed(0)}</td>
            `;
            devTableBody.appendChild(row);
        }

        if (devUserSelect) {
            const opt = document.createElement("option");
            opt.value = userData.user_id;
            opt.textContent = `${userData.user_id} - ${
                userData.name || userData.first_name || "Unnamed"
            }`;
            devUserSelect.appendChild(opt);
        }
    });

    if (devUserSelect) {
        devUserSelect.onchange = () => {
            const selectedId = devUserSelect.value;
            showDevUserAnalytics(selectedId);
        };
    }

    if (users.length > 0 && devUserSelect) {
        const firstUserData = JSON.parse(localStorage.getItem(users[0]));
        devUserSelect.value = firstUserData.user_id;
        showDevUserAnalytics(firstUserData.user_id);
    }

    if (!devFeedbackList) return;

    const feedbackStr = localStorage.getItem("feedback_list");
    if (!feedbackStr) {
        devFeedbackList.innerHTML = "<p>No feedback yet.</p>";
        return;
    }

    const feedbackList = JSON.parse(feedbackStr);
    if (!feedbackList.length) {
        devFeedbackList.innerHTML = "<p>No feedback yet.</p>";
        return;
    }

    feedbackList.forEach((fb) => {
        const item = document.createElement("div");
        item.className = "dev-feedback-item";
        item.innerHTML = `
            <div class="timestamp">${fb.timestamp}</div>
            <div><strong>${fb.user_id}</strong> (${fb.name || "Unknown"})</div>
            <div>${fb.text}</div>
        `;
        devFeedbackList.appendChild(item);
    });
}

function showDevUserAnalytics(userId) {
    const devUserAnalytics = document.getElementById("dev-user-analytics");
    if (!devUserAnalytics) return;

    const userDataStr = localStorage.getItem(`user_${userId}`);
    if (!userDataStr) {
        devUserAnalytics.innerHTML = "<p>User not found.</p>";
        return;
    }

    const userData = JSON.parse(userDataStr);
    const log = userData.log || [];
    const totalSessions = log.length;
    const totalEnergy = userData.energy_kwh_total || 0;
    const totalCalories = userData.calories_total || 0;

    let totalMinutes = 0;
    let firstDate = null;
    let lastDate = null;

    log.forEach((entry) => {
        if (entry.minutes != null) totalMinutes += entry.minutes;
        if (entry.timestamp) {
            const d = new Date(entry.timestamp);
            if (!firstDate || d < firstDate) firstDate = d;
            if (!lastDate || d > lastDate) lastDate = d;
        }
    });

    const avgEnergy = totalSessions > 0 ? totalEnergy / totalSessions : 0;
    const avgCalories = totalSessions > 0 ? totalCalories / totalSessions : 0;
    const avgMinutes = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    devUserAnalytics.innerHTML = `
        <p><strong>User:</strong> ${userData.user_id} - ${
        userData.name || userData.first_name || "Unnamed"
    }</p>
        <p><strong>Total sessions:</strong> ${totalSessions}</p>
        <p><strong>Total energy:</strong> ${totalEnergy.toFixed(
            3
        )} kWh (avg ${avgEnergy.toFixed(3)} kWh/session)</p>
        <p><strong>Total calories:</strong> ${totalCalories.toFixed(
            0
        )} kcal (avg ${avgCalories.toFixed(0)} kcal/session)</p>
        <p><strong>Total time (approx):</strong> ${totalMinutes.toFixed(
            0
        )} min (avg ${avgMinutes.toFixed(1)} min/session)</p>
        <p><strong>First session:</strong> ${
            firstDate ? firstDate.toLocaleString() : "N/A"
        }</p>
        <p><strong>Latest session:</strong> ${
            lastDate ? lastDate.toLocaleString() : "N/A"
        }</p>
    `;
}

// Energy session simulation
function logEnergySession() {
    if (!currentUser) return;

    const rpm = parseFloat(document.getElementById("session-rpm").value);
    const minutes = parseFloat(
        document.getElementById("session-minutes").value
    );
    const effort = document.getElementById("session-effort").value;

    const resultContainer = document.getElementById("session-result");
    if (!resultContainer) return;

    if (!rpm || !minutes || minutes <= 0) {
        resultContainer.classList.remove("hidden");
        resultContainer.innerHTML = `
            <div class="analytics-tile">
                <div class="analytics-label">Error</div>
                <div class="analytics-value">Please enter a valid RPM and duration.</div>
            </div>
        `;
        return;
    }

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }
    const userData = JSON.parse(userDataStr);

    let basePowerW;
    if (effort === "low") {
        basePowerW = 75;
    } else if (effort === "high") {
        basePowerW = 200;
    } else {
        basePowerW = 125;
    }

    let weightKg;
    if (userData.weight_unit === "kg") {
        weightKg = userData.weight;
    } else {
        weightKg = userData.weight * 0.45359237;
    }
    const weightFactor = weightKg ? weightKg / 70 : 1;
    const rpmFactor = rpm / 70;

    const avgPowerW = basePowerW * 0.5 + basePowerW * 0.5 * rpmFactor * weightFactor;

    const timeHours = minutes / 60;
    const energyWh = avgPowerW * timeHours;
    const energyKwh = energyWh / 1000;

    const calories = energyKwh * 3440;

    const costPerKwh = 8;
    const co2PerKwh = 0.8;
    const phoneKwh = 0.015;

    const sessionSavings = energyKwh * costPerKwh;
    const sessionCo2 = energyKwh * co2PerKwh;
    const phoneCharges = energyKwh / phoneKwh;

    userData.energy_kwh_total = (userData.energy_kwh_total || 0) + energyKwh;
    userData.calories_total = (userData.calories_total || 0) + calories;

    if (!userData.log) userData.log = [];
    userData.log.push({
        timestamp: new Date().toISOString(),
        text: "Cycling session logged",
        energy_kwh: energyKwh,
        calories: calories,
        rpm,
        minutes,
        effort,
    });

    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));

    resultContainer.classList.remove("hidden");
    resultContainer.innerHTML = "";

    const tiles = [
        {
            label: "Average Power",
            value: `${avgPowerW.toFixed(0)} W`,
            note: `${energyWh.toFixed(1)} Wh generated`,
        },
        {
            label: "Energy This Session",
            value: `${energyKwh.toFixed(3)} kWh`,
            note: `Duration: ${minutes} min @ ${rpm} RPM`,
        },
        {
            label: "Calories Burned (est.)",
            value: `${calories.toFixed(0)} kcal`,
            note: "Based on cycling efficiency",
        },
        {
            label: "Bill Savings (est.)",
            value: `₹ ${sessionSavings.toFixed(1)}`,
            note: `CO₂ avoided: ${sessionCo2.toFixed(3)} kg`,
        },
        {
            label: "Phone Charging Equivalent",
            value: `${phoneCharges.toFixed(2)} full charges`,
            note: "Assuming ~15 Wh per charge",
        },
    ];

    tiles.forEach((t) => {
        const tile = document.createElement("div");
        tile.className = "analytics-tile";
        tile.innerHTML = `
            <div class="analytics-label">${t.label}</div>
            <div class="analytics-value">${t.value}</div>
            ${t.note ? `<div class="analytics-note">${t.note}</div>` : ""}
        `;
        resultContainer.appendChild(tile);
    });

    document.getElementById("session-rpm").value = "";
    document.getElementById("session-minutes").value = "";

    loadProfile();
}

// Save home target
function saveHouseTarget() {
    if (!currentUser) return;

    const billKwh =
        parseFloat(document.getElementById("bill-kwh").value) || 0;
    const billAmount =
        parseFloat(document.getElementById("bill-amount").value) || null;
    const fans =
        parseInt(document.getElementById("fans-count").value) || 0;
    const acs = parseInt(document.getElementById("acs-count").value) || 0;
    const fridges =
        parseInt(document.getElementById("fridges-count").value) || 0;

    let targetKwh = 0;

    if (billKwh > 0) {
        targetKwh = billKwh;
    } else {
        targetKwh = estimateKwhFromAppliances(fans, acs, fridges);
    }

    if (targetKwh <= 0) {
        showMessage(
            "house-message",
            "Please enter bill units or at least one appliance.",
            "error"
        );
        return;
    }

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }

    const userData = JSON.parse(userDataStr);
    userData.monthly_target_kwh = targetKwh;
    userData.monthly_bill_inr = billAmount;
    userData.appliances = { fans, acs, fridges };

    localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));

    const msg =
        `Target set to ${targetKwh.toFixed(1)} kWh/month` +
        (billAmount ? ` (approx bill: ₹${billAmount})` : "");
    showMessage("house-message", msg, "success");

    loadHouseSummary();
    loadProfile();
}

// Feedback
function submitFeedback() {
    if (!currentUser) {
        showMessage("feedback-message", "Please login first.", "error");
        return;
    }

    const feedbackInput = document.getElementById("feedback-text");
    if (!feedbackInput) return;
    const text = feedbackInput.value.trim();
    if (!text) {
        showMessage("feedback-message", "Feedback cannot be empty.", "error");
        return;
    }

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }
    const userData = JSON.parse(userDataStr);

    let feedbackList = [];
    const feedbackStr = localStorage.getItem("feedback_list");
    if (feedbackStr) {
        feedbackList = JSON.parse(feedbackStr);
    }

    feedbackList.push({
        user_id: userData.user_id,
        name: userData.name || userData.first_name || "",
        text,
        timestamp: new Date().toISOString(),
    });

    localStorage.setItem("feedback_list", JSON.stringify(feedbackList));

    feedbackInput.value = "";
    showMessage("feedback-message", "Thank you for your feedback!", "success");
}

// Dev CSV export (current user)
function exportUserLogCsv() {
    if (!currentUser) return;

    const userDataStr = localStorage.getItem(`user_${currentUser}`);
    if (!userDataStr) {
        logout();
        return;
    }

    const userData = JSON.parse(userDataStr);

    const rows = [];
    rows.push([
        "Timestamp",
        "Description",
        "Energy_kWh",
        "Calories",
        "RPM",
        "Minutes",
        "Effort",
    ]);

    if (userData.log && userData.log.length > 0) {
        userData.log.forEach((entry) => {
            rows.push([
                entry.timestamp || "",
                entry.text || "",
                entry.energy_kwh != null ? entry.energy_kwh : "",
                entry.calories != null ? entry.calories : "",
                entry.rpm != null ? entry.rpm : "",
                entry.minutes != null ? entry.minutes : "",
                entry.effort || "",
            ]);
        });
    }

    const csvContent = rows
        .map((row) =>
            row
                .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\r\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autogen_log_${currentUser}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Dev CSV export (all users)
function exportAllUsersCsv() {
    const users = Object.keys(localStorage).filter((key) =>
        key.startsWith("user_")
    );

    const rows = [];
    rows.push([
        "User_ID",
        "Name",
        "Age",
        "Pincode",
        "Height",
        "Height_Unit",
        "Weight",
        "Weight_Unit",
        "BMI",
        "BMI_Category",
        "Energy_kWh_Total",
        "Calories_Total",
        "Day_Streak",
    ]);

    users.forEach((key) => {
        const userData = JSON.parse(localStorage.getItem(key));
        rows.push([
            userData.user_id || "",
            userData.name || userData.first_name || "",
            userData.age || "",
            userData.pincode || "",
            userData.height || "",
            userData.height_unit || "",
            userData.weight || "",
            userData.weight_unit || "",
            userData.bmi != null ? userData.bmi.toFixed(1) : "",
            userData.bmi_category || "",
            userData.energy_kwh_total != null
                ? userData.energy_kwh_total.toFixed(3)
                : "",
            userData.calories_total != null
                ? userData.calories_total.toFixed(0)
                : "",
            userData.day_streak || 0,
        ]);
    });

    const csvContent = rows
        .map((row) =>
            row
                .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\r\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autogen_all_users.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Messages
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = message;
    element.classList.remove("hidden");
    element.style.color =
        type === "error" ? "var(--danger-color)" : "var(--success-color)";

    setTimeout(() => {
        element.classList.add("hidden");
    }, 3000);
}
