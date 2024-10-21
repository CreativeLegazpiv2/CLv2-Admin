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
  