document.addEventListener('DOMContentLoaded', () => {
  const deleteLinks = document.querySelectorAll('.delete-link');

  deleteLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const confirmed = confirm('Are you sure you want to delete this record?');
      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});
