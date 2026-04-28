const { Category } = require('../models');

// POST /api/categories
exports.create = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug sudah digunakan.' });
    }

    const category = await Category.create({ name, slug, icon });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat.',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat kategori.', error: error.message });
  }
};

// GET /api/categories
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kategori.', error: error.message });
  }
};

// GET /api/categories/:id
exports.getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    res.json({ success: true, data: { category } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kategori.', error: error.message });
  }
};

// PUT /api/categories/:id
exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    const { name, slug, icon } = req.body;
    await category.update({ name, slug, icon });

    res.json({
      success: true,
      message: 'Kategori berhasil diperbarui.',
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kategori.', error: error.message });
  }
};

// DELETE /api/categories/:id
exports.delete = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    await category.destroy();

    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori.', error: error.message });
  }
};
