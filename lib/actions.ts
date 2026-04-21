export const insertNews = async (news: any) => {
  const newItem = { ...news };
  if (newItem.image_url) newItem.image_url = sanitizeUrl(newItem.image_url);
  
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    newItem.date = newItem.date || formatDate(newItem.created_at);
    const items = getFromStorage(STORAGE_KEYS.NEWS);
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.NEWS, items);
    return { data: [newItem], error: null };
  }

  try {
    // PEMETAAN EKSPLISIT: Hanya kolom ini yang dikirim ke Supabase
    const payload: any = {
      title: newItem.title,
      category: newItem.category,
      excerpt: newItem.excerpt,
      content: newItem.content,
      image_url: newItem.image_url,
      author_name: newItem.author_name || 'Admin',
    };

    // Jika ada tanggal kustom, masukkan ke created_at
    if (newItem.date) {
      const d = new Date(newItem.date);
      if (!isNaN(d.getTime())) {
        payload.created_at = d.toISOString();
      }
    }

    const { data, error } = await supabase!.from('berita').insert([payload]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('❌ Error inserting news:', err);
    return { data: null, error: err };
  }
};

export const updateNews = async (id: string | number, news: any) => {
  const updatedItem = { ...news };
  if (updatedItem.image_url) updatedItem.image_url = sanitizeUrl(updatedItem.image_url);
  
  if (isSupabaseConfigured()) {
    // PEMETAAN EKSPLISIT: Memastikan 'date' tidak ikut terkirim
    const payload: any = {
      title: updatedItem.title,
      category: updatedItem.category,
      excerpt: updatedItem.excerpt,
      content: updatedItem.content,
      image_url: updatedItem.image_url,
      author_name: updatedItem.author_name,
    };

    if (updatedItem.date) {
      const d = new Date(updatedItem.date);
      if (!isNaN(d.getTime())) {
        payload.created_at = d.toISOString();
      }
    }

    const { data, error } = await supabase!.from('berita').update(payload).eq('id', id).select();
    return { data, error };
  }

  const items = getFromStorage(STORAGE_KEYS.NEWS);
  const index = items.findIndex((item: any) => item.id === id.toString());
  if (index >= 0) {
    items[index] = { ...items[index], ...updatedItem, updated_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.NEWS, items);
    return { data: [items[index]], error: null };
  }
  return { data: [], error: { message: 'Item tidak ditemukan' } };
};

