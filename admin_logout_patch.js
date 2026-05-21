// ── ADMIN LOGOUT ──
// Add this function to admin.html or include after aptiora.js
function adminLogout(){
  localStorage.removeItem('adminLoggedIn');
  location.href='login.html';
}

// Guard: redirect to login if not authenticated
(function(){
  if(localStorage.getItem('adminLoggedIn')!=='yes'){
    location.href='login.html';
  }
})();
