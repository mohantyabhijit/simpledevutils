// Waitlist form
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
  const formMsg = document.getElementById('form-message');
  waitlistForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!email) return;

    const btn = waitlistForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Joining...';

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      formMsg.textContent = "You're on the list! We'll be in touch soon.";
      btn.textContent = 'Joined!';
      waitlistForm.querySelector('input[type="email"]').value = '';
    } catch {
      formMsg.textContent = 'Something went wrong. Please try again.';
      btn.disabled = false;
      btn.textContent = 'Get Early Access';
    }
  });
}

// Tool category filter
const filterBtns = document.querySelectorAll('.filter-btn');
const toolCards = document.querySelectorAll('.tool-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    toolCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
