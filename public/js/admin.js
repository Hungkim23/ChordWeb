async function approveSong(songId) {
  try {
    const response = await fetch(`/api/songs/${songId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      // Cập nhật UI sau khi duyệt thành công
      const songElement = document.querySelector(`[data-song-id="${songId}"]`);
      songElement.remove();
    } else {
      alert('Có lỗi xảy ra khi duyệt bài hát');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra khi duyệt bài hát');
  }
} 