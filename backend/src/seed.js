const { Category, User } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Seed categories
    const categories = [
      { name: 'Bencana Alam', slug: 'bencana-alam', icon: '<i data-lucide=\"waves\" class=\"icon-sm\"></i>' },
      { name: 'Pendidikan', slug: 'pendidikan', icon: '<i data-lucide=\"graduation-cap\" class=\"icon-sm\"></i>' },
      { name: 'Kesehatan', slug: 'kesehatan', icon: '<i data-lucide=\"pill\" class=\"icon-sm\"></i>' },
      { name: 'Kemanusiaan', slug: 'kemanusiaan', icon: '<i data-lucide=\"handshake\" class=\"icon-sm\"></i>' },
      { name: 'Rumah Ibadah', slug: 'rumah-ibadah', icon: '<i data-lucide=\"building-2\" class=\"icon-sm\"></i>' },
      { name: 'Anak Yatim', slug: 'anak-yatim', icon: '<i data-lucide=\"baby\" class=\"icon-sm\"></i>' },
      { name: 'Lingkungan', slug: 'lingkungan', icon: '<i data-lucide=\"leaf\" class=\"icon-sm\"></i>' },
      { name: 'Pangan', slug: 'pangan', icon: '<i data-lucide=\"utensils\" class=\"icon-sm\"></i>' },
    ];

    for (const cat of categories) {
      await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: cat,
      });
    }
    console.log('✅ Categories seeded');

    // Seed admin user
    await User.findOrCreate({
      where: { email: 'admin@donaria.com' },
      defaults: {
        name: 'Admin Donaria',
        email: 'admin@donaria.com',
        password_hash: 'admin123',
        phone: '081234567890',
        role: 'admin',
        is_verified: true,
      },
    });
    console.log('✅ Admin user seeded (admin@donaria.com / admin123)');

    console.log('✅ Seed data completed!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

module.exports = seedData;
