export const getRoleRedirect = (role) => {
    switch (role) {
        case "admin": return "/admin";
        case "doctor": return "/doctor";
        case "receptionist": return "/receptionist";
        case "patient": return "/patient";
        default: return "/login";
    }
};