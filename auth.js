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
        location.reload(); // Logout ke baad page refresh kar dega taake login screen wapas aa jaye
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Real-time Auth State Listener (Controls Background Letterhead View vs Dashboard)
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        const landingView = document.getElementById('landingBackgroundView');
        const sidebar = document.getElementById('portalSidebar');
        const mainContent = document.getElementById('portalMain');
        const emailTxt = document.getElementById('userEmailText');

        if (user) {
            // 1. Letterhead background ko mukammal hide/remove kar dein
            if (landingView) {
                landingView.style.display = 'none';
            }

            // 2. Sidebar aur Main Dashboard ko unlock karke visible karein
          if (sidebar) {
                sidebar.classList.remove('portal-locked');
            }
            if (mainContent) {
                mainContent.classList.remove('portal-locked');
            }

            // 3. User email show karein
            if (emailTxt) emailTxt.innerText = user.email;
        } else {
            // User logged out: Lock dashboard, show letterhead
            if (landingView) {
                landingView.style.display = 'block';
            }
            if (sidebar) sidebar.classList.add('portal-locked');
            if (mainContent) mainContent.classList.add('portal-locked');
            if (emailTxt) emailTxt.innerText = '';
        }
    });
});
