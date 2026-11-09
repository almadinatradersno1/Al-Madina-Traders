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
