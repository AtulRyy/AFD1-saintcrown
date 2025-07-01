document.addEventListener('DOMContentLoaded', () => {
    console.log(`${window.BASE_URL}/api/afd1/check-auth`);
    
    fetch(`${window.BASE_URL}/api/afd1/check-auth`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        console.log('Auth check response:', data);
      if (data.authenticated && data.user && data.user.username) {
        const avatarEl = document.querySelector('.user-avatar');
        if (avatarEl) {
          avatarEl.textContent = data.user.username;
        }
      } else {
        // Optionally redirect to login if not authenticated
        window.location.href = '/user-portal-login.html';
      }
    })
    .catch(err => {
      console.error('Auth check failed:', err);
    });
  });