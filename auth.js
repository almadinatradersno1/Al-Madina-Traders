// Open Admin Login Modal
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Close Admin Login Modal
function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Login Admin Function
async function loginAdmin() {
    let email = document.getElementById('adminEmail').value.trim();
    let pass = document.getElementById('adminPassword').value.trim();

    if (!email || !pass) {
        alert("Meharbani karke Email aur Password dono enter karein.");
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, pass);
        closeAdminModal();
        alert("Admin Login Successful!");
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
}

// Logout Admin Function
async function logoutAdmin() {
    try {
        await auth.signOut();
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Logout Error:", error);
    }
}
// Real-time Auth State Listener (Controls Background Letterhead View vs Dashboard)
auth.onAuthStateChanged((user) => {
    const landingView = document.getElementById('landingBackgroundView');
    const sidebar = document.getElementById('portalSidebar');
    const mainContent = document.getElementById('portalMain');
    const emailTxt = document.getElementById('userEmailText');

    if (user) {
        // User logged in: Remove landing background completely from DOM
        if (landingView) {
            landingView.remove(); // <-- Yeh element ko poori tarah delete kar dega
        }
        if (sidebar) sidebar.classList.remove('portal-locked');
        if (mainContent) mainContent.classList.remove('portal-locked');
        if (emailTxt) emailTxt.innerText = user.email;
    } else {
        // User logged out: If user logs out, page will reload or background should be handled
        if (sidebar) sidebar.classList.add('portal-locked');
        if (mainContent) mainContent.classList.add('portal-locked');
        if (emailTxt) emailTxt.innerText = '';
    }
});
