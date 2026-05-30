require('dotenv').config({ path: '../.env' });
require('dotenv').config({ path: '../.env' });
const { Campaign, Category, User } = require('../src/models');

async function seedCampaigns() {
  const admin = await User.findOne({ where: { role: 'admin' } });
  const categories = await Category.findAll();

  for (let i = 1; i <= 10; i++) {
    const category = categories[(i - 1) % categories.length];
    await Campaign.create({
      user_id: admin.id,
      category_id: category.id,
      title: 'Kampanye Tes ' + i,
      short_description: 'Tes kampanye nomor ' + i,
      description: 'Ini adalah deskripsi panjang untuk kampanye tes nomor ' + i,
      target_amount: 1000000 * i,
      current_amount: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });
    console.log('✅ Kampanye Tes ' + i + ' dibuat');
  }
}

seedCampaigns().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
