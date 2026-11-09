// Authentication & User Control Module (Ready for Login Integration)
function checkAuthState(callback) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Logged in user:", user.email);
            if(callback) callback(user);
        } else {
            console.log("No active session");
            if(callback) callback(null);
        }
    });
}
