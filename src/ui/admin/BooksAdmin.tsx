/**
 * Gestión de Libros - CONECTADO A BACKEND
 * Carga datos en tiempo real desde microservicios
 */
import { useEffect, useState, useCallback } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { resolveCover, FALLBACK_COVER, withCacheBuster } from '../shared/getCover';

const categories = ['Programación', 'Base de Datos', 'Novela', 'Ciencia', 'Historia', 'Biografía', 'Poesía', 'Sistemas', 'Redes', 'Arquitectura'];

const empty: Omit<Book, 'id'> = {
  title: '',
  author: '',
  category: '',
  description: '',
  coverUrl: '',
  bannerUrl: '',
  status: 'disponible'
};

export function BooksAdmin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Omit<Book, 'id'>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    console.log('📚 Cargando libros...');
    try {
      const data = await bookService.getAllAsync();
      setBooks(data);
      console.log('✅ Libros cargados:', data.length);
    } catch (error) {
      console.warn('⚠️ Error cargando libros:', error);
      setBooks(bookService.getAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const validateForm = (): boolean => {
    return (
      form.title.trim().length >= 2 &&
      form.author.trim().length >= 2 &&
      form.category.trim().length > 0 &&
      form.description.trim().length >= 30 &&
      form.description.trim().length <= 280 &&
      form.coverUrl.trim().length > 0
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    setLoading(true);
    const bookData = {
      ...form,
      coverUrl: form.coverUrl.trim(),
      bannerUrl: form.bannerUrl?.trim() || undefined,
      status: editingId ? form.status : 'disponible' as const
    };

    try {
      if (editingId) {
        await bookService.update(editingId, bookData);
        setSuccessMessage('✅ Libro actualizado correctamente (guardado en backend).');
        console.log('✅ Libro actualizado');
      } else {
        await bookService.add(bookData);
        setSuccessMessage('✅ Libro creado correctamente (guardado en backend).');
        console.log('✅ Libro creado');
      }
      
      setForm({ ...empty });
      setEditingId(null);
      await reload();
    } catch (error) {
      console.error('Error guardando libro:', error);
      setSuccessMessage('⚠️ Error al guardar. Datos guardados localmente.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const edit = (b: Book) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      author: b.author,
      category: b.category,
      description: b.description,
      coverUrl: b.coverUrl,
      bannerUrl: b.bannerUrl || '',
      status: b.status
    });
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await bookService.delete(id);
      console.log('✅ Libro eliminado');
      await reload();
    } catch (error) {
      console.error('Error eliminando libro:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Book['status']) => {
    setLoading(true);
    try {
      await bookService.update(id, { status });
      console.log('✅ Estado actualizado');
      await reload();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>
            <i className="bi bi-book me-2"></i>Gestión de Libros
          </h3>
          <div className="d-flex gap-2 align-items-center">
            <span className="badge bg-secondary">{books.length} libro{books.length !== 1 ? 's' : ''}</span>
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={reload}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <i className="bi bi-arrow-clockwise"></i>
              )}
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
          <thead>
            <tr>
              <th>Título</th><th>Autor</th><th>Categoría</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td><strong>{b.title}</strong></td>
                <td>
                  <i className="bi bi-person me-1 text-muted"></i>
                  {b.author}
                </td>
                <td>
                  <span className="badge bg-info">{b.category}</span>
                </td>
                <td>
                  <select 
                    className={`form-select form-select-sm ${b.status === 'disponible' ? 'border-success' : 'border-secondary'}`}
                    value={b.status} 
                    onChange={(e) => updateStatus(b.id, e.target.value as Book['status'])}
                    disabled={loading}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="prestado">Prestado</option>
                  </select>
                </td>
                <td className="text-end">
                  <button 
                    className="btn btn-sm btn-outline-primary me-2" 
                    onClick={() => edit(b)}
                    title="Editar libro"
                    disabled={loading}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar "${b.title}"?`)) {
                        remove(b.id);
                      }
                    }}
                    title="Eliminar libro"
                    disabled={loading}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {editingId ? 'Editar libro' : 'Nuevo libro'}
            </h4>
          </div>
          <div className="card-body">
            {successMessage && (
              <div className={`alert ${successMessage.includes('Error') ? 'alert-warning' : 'alert-success'} alert-dismissible fade show`} role="alert">
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
              </div>
            )}
            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Título <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  value={form.title} 
                  onChange={e => setForm(f => ({...f, title: e.target.value}))} 
                  required 
                  minLength={2}
                  disabled={loading}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Autor <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  value={form.author} 
                  onChange={e => setForm(f => ({...f, author: e.target.value}))} 
                  required 
                  minLength={2}
                  disabled={loading}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Categoría <span className="text-danger">*</span></label>
                <select 
                  className="form-select" 
                  value={form.category} 
                  onChange={e => setForm(f => ({...f, category: e.target.value}))} 
                  required
                  disabled={loading}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">
                  Descripción <span className="text-danger">*</span>
                  <small className="text-muted ms-2">({form.description.trim().length}/280)</small>
                </label>
                <textarea 
                  className={`form-control ${form.description.trim().length > 0 && (form.description.trim().length < 30 || form.description.trim().length > 280) ? 'is-invalid' : ''}`}
                  value={form.description} 
                  onChange={e => setForm(f => ({...f, description: e.target.value}))} 
                  required 
                  minLength={30}
                  maxLength={280}
                  rows={4}
                  placeholder="Describe el libro (30-280 caracteres)"
                  disabled={loading}
                />
                {form.description.trim().length > 0 && form.description.trim().length < 30 && (
                  <div className="invalid-feedback">Mínimo 30 caracteres</div>
                )}
                {form.description.trim().length > 280 && (
                  <div className="invalid-feedback">Máximo 280 caracteres</div>
                )}
              </div>
              <div className="mb-2">
                <label className="form-label">URL de Portada <span className="text-danger">*</span></label>
                <input 
                  type="text"
                  className="form-control"
                  value={form.coverUrl} 
                  onChange={e => setForm(f => ({...f, coverUrl: e.target.value}))} 
                  required 
                  placeholder="/img/books/nombre-archivo.jpg o https://..."
                  disabled={loading}
                />
                <small className="text-muted">Usa ruta local (/img/books/...) o URL completa</small>
              </div>
              {form.coverUrl && (() => {
                const cover = resolveCover({ coverUrl: form.coverUrl, title: form.title });
                const src = cover.startsWith("/img/") ? cover : withCacheBuster(cover);
                return (
                  <div className="mb-2">
                    <label className="form-label">Vista previa</label>
                    <img
                      src={src}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== FALLBACK_COVER) {
                          img.src = FALLBACK_COVER;
                        }
                      }}
                      className="img-fluid rounded border"
                      style={{maxHeight: 180, objectFit: 'cover', width: '100%'}}
                      alt="Preview"
                    />
                  </div>
                );
              })()}
              <div className="mb-2">
                <label className="form-label">URL de Banner (opcional)</label>
                <input 
                  type="url"
                  className="form-control"
                  value={form.bannerUrl || ''} 
                  onChange={e => setForm(f => ({...f, bannerUrl: e.target.value}))} 
                  placeholder="https://ejemplo.com/banner.jpg"
                  disabled={loading}
                />
              </div>
              {editingId && (
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-select" 
                    value={form.status} 
                    onChange={e => setForm(f => ({...f, status: e.target.value as Book['status']}))}
                    disabled={loading}
                  >
                    <option value="disponible">disponible</option>
                    <option value="prestado">prestado</option>
                  </select>
                </div>
              )}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={!validateForm() || loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</>
                  ) : (
                    <><i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                    {editingId ? 'Guardar cambios' : 'Crear libro'}</>
                  )}
                </button>
                {editingId && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => {
                      setEditingId(null); 
                      setForm({...empty});
                      setSuccessMessage(null);
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-x-lg me-2"></i>Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
