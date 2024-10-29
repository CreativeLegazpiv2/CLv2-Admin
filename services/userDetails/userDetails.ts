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
  

  export async function updateOrAddRank(detailsid: number, rank: number) {
    try {
      const response = await fetch('/api/handleRank', { // Adjust the path if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ detailsid, rank }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update or add rank');
      }
  
      const data = await response.json();
      return data; // Return the updated rank data if needed
    } catch (error) {
      console.error('Error updating or adding rank:', error);
      throw error; // Rethrow the error for handling in the calling component
    }
  }