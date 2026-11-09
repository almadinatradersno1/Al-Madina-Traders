function openAdminModal() {
    document.getElementById('adminModal').classList.remove('hidden');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

async function loginAdmin() {
    let email = document.getElementById('adminEmail').value.trim();
    let pass = document.getElementById('adminPassword').value.trim();

    if (!email || !pass) {
        alert("Meharbani karke Email aur Password dono enter karein.");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, pass);
        alert("Admin Login Successful!");
        closeAdminModal();
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
}

async function logoutAdmin() {
    try {
        await auth.signOut();
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Automatically Monitor Login Status
auth.onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('adminLoginBtn');
    const badge = document.getElementById('userInfoBadge');
    const emailTxt = document.getElementById('userEmailText');

    if (user) {
        loginBtn.classList.add('hidden');
        badge.classList.remove('hidden');
        emailTxt.innerText = user.email;
    } else {
        loginBtn.classList.remove('hidden');
        badge.classList.add('hidden');
        emailTxt.innerText = '';
    }
});
async function performInitialLogin() {
    let email = document.getElementById('loginEmail').value.trim();
    let pass = document.getElementById('loginPassword').value.trim();

    if (!email || !pass) {
        alert("Meharbani karke Email aur Password enter karein.");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, pass);
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
}

async function logoutAdmin() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Real-time Auth State Listener (Controls Page Lock / Unlock)
auth.onAuthStateChanged((user) => {
    const loginScreen = document.getElementById('initialLoginScreen');
    const sidebar = document.getElementById('portalSidebar');
    const mainContent = document.getElementById('portalMain');
    const badge = document.getElementById('userInfoBadge');
    const emailTxt = document.getElementById('userEmailText');

    if (user) {
        // User logged in: Hide login screen, show portal
        if(loginScreen) loginScreen.classList.add('hidden');
        if(sidebar) sidebar.classList.remove('portal-locked');
        if(mainContent) mainContent.classList.remove('portal-locked');
        if(badge) badge.classList.remove('hidden');
        if(emailTxt) emailTxt.innerText = user.email;
    } else {
        // User logged out: Show full-screen login, lock portal
        if(loginScreen) loginScreen.classList.remove('hidden');
        if(sidebar) sidebar.classList.add('portal-locked');
        if(mainContent) mainContent.classList.add('portal-locked');
        if(badge) badge.classList.add('hidden');
    }
});
