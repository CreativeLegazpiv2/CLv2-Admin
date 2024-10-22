export const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("messageId");
      localStorage.removeItem("user");
      localStorage.removeItem("messageTo");
      localStorage.removeItem("Fname");
    }
  };