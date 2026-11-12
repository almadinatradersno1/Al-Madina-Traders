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
auth.onAuthStateChanged((user) => {
    if (user) {
        // User logged in: Sabhi login backgrounds ko DOM se permanently delete kar dein
        const landingView = document.getElementById('landingBackgroundView');
        if (landingView) landingView.remove();

        // Agar koi aur background element ya letterhead div hai, uski ID yahan daal kar remove kardein:
        const letterheadDiv = document.querySelector('.letterhead-bg'); // ya jo bhi class/ID ho
        if (letterheadDiv) letterheadDiv.remove();

        const sidebar = document.getElementById('portalSidebar');
        const mainContent = document.getElementById('portalMain');
        const emailTxt = document.getElementById('userEmailText');

        if (sidebar) sidebar.classList.remove('portal-locked');
        if (mainContent) mainContent.classList.remove('portal-locked');
        if (emailTxt) emailTxt.innerText = user.email;
    }
});
