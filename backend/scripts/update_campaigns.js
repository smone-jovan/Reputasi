const { Campaign } = require('../src/models');
const { Op } = require('sequelize');

async function updateCampaigns() {
  const campaigns = await Campaign.findAll({ where: { title: { [Op.like]: 'Kampanye Tes %' } } });
  
  const humanized = [
    { title: 'Bantu Renovasi Atap Rumah Ibu Sukaesih', desc: 'Rumah Ibu Sukaesih rusak parah akibat angin puting beliung.' },
    { title: 'Operasi Jantung Adik Arkan', desc: 'Arkan butuh bantuan biaya operasi jantung bawaan yang mendesak.' },
    { title: 'Beasiswa Pendidikan untuk Anak Pelosok', desc: 'Membantu anak-anak desa di pedalaman mendapatkan akses buku layak.' },
    { title: 'Pembangunan Sumur Bor Masjid Al-Hidayah', desc: 'Kekeringan melanda warga sekitar masjid, butuh sumur bor segera.' },
    { title: 'Pemberdayaan UMKM Korban Banjir', desc: 'Modal usaha untuk warga yang kehilangan alat produksi saat banjir.' },
    { title: 'Penyediaan Air Bersih Desa Mekarwangi', desc: 'Desa Mekarwangi krisis air bersih sejak kemarau panjang.' },
    { title: 'Bantuan Nutrisi Anak Stunting', desc: 'Program pemenuhan gizi untuk 50 balita di wilayah rawan stunting.' },
    { title: 'Renovasi Ruang Kelas SDN 03', desc: 'Atap bocor dan lantai rusak menghambat belajar mengajar di SDN 03.' },
    { title: 'Santunan Yatim Dhuafa', desc: 'Berbagi kebahagiaan untuk 100 anak yatim dhuafa jelang hari raya.' },
    { title: 'Pembersihan Sampah Sungai Ciliwung', desc: 'Aksi komunitas untuk memulihkan ekosistem sungai dan mencegah banjir.' }
  ];

  for (let i = 0; i < campaigns.length; i++) {
    const data = humanized[i % humanized.length];
    await campaigns[i].update({
      title: data.title,
      short_description: data.desc,
      description: data.desc + ' ' + data.desc
    });
    console.log('✅ Kampanye diperbarui: ' + data.title);
  }
}

updateCampaigns().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
