// services/userDetails/userDetails.ts

export async function fetchAllUserDetails() {
    try {
      const response = await fetch('/api/fetch_users', {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const { data } = await response.json();
      return data;
  
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }
  
  // New function to update user status
  export async function updateUserStatus(detailsid: number, status: boolean) {
    try {
      const response = await fetch('/api/fetch_users', { // Adjust the path if necessary
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detailsid, status }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
  
      const data = await response.json();
      return data; // Return the updated user data if needed
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error; // Rethrow the error for handling in the calling component
    }
  }
  