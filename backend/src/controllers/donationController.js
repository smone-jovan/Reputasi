const { Donation, Transaction, Campaign, User, Notification, Squad, Setting } = require('../models');
const tripayService = require('../services/tripayService');
const TripayService = require('../services/tripayService').constructor;

// POST /api/donations
exports.create = async (req, res) => {
  try {
    const { campaign_id, amount, message, is_anonymous, payment_method, bank_code, squad_id } = req.body;

    // Check campaign exists and active
    const campaign = await Campaign.findByPk(campaign_id);
    if (!campaign || campaign.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Kampanye tidak tersedia.' });
    }

    if (amount < 10000) {
      return res.status(400).json({ success: false, message: 'Minimal donasi Rp 10.000.' });
    }

    // Check test mode
    const isTestMode = await Setting.getValue('test_mode', false);

    if (isTestMode) {
      // Test mode: bypass payment, instant settlement
      const donation = await Donation.create({
        user_id: req.user.id,
        campaign_id,
        amount,
        message,
        is_anonymous: is_anonymous || false,
        squad_id: squad_id || null,
        status: 'success',
      });

      const orderId = `TEST-${Date.now()}-${donation.id}`;

      const transaction = await Transaction.create({
        donation_id: donation.id,
        order_id: orderId,
        payment_gateway: 'test_mode',
        payment_method: payment_method || 'qris',
        gross_amount: amount,
        fee_amount: 0,
        net_amount: amount,
        status: 'settlement',
        paid_at: new Date(),
        gateway_response_raw: JSON.stringify({ mode: 'test_mode' }),
      });

      // Update campaign amount
      await campaign.increment('current_amount', { by: amount });
      await campaign.reload();
      if (campaign.current_amount >= campaign.target_amount) {
        await campaign.update({ status: 'completed' });
      }

      // Update squad amount if applicable
      if (squad_id) {
        const squad = await Squad.findByPk(squad_id);
        if (squad) {
          await squad.increment('current_amount', { by: amount });
          await squad.reload();
          if (squad.current_amount >= squad.target_amount) {
            await squad.update({ status: 'completed' });
          }
        }
      }

      // Create notification
      await Notification.create({
        user_id: req.user.id,
        title: 'Donasi Test Berhasil!',
        message: `Donasi test sebesar Rp ${amount.toLocaleString('id-ID')} telah disimulasikan.`,
        type: 'donation',
      });

      return res.status(201).json({
        success: true,
        message: 'Donasi test berhasil! Pembayaran otomatis disimulasikan.',
        data: {
          donation,
          transaction: {
            order_id: orderId,
            payment_method: 'qris',
            bank_code: null,
            qris_url: null,
            qr_string: null,
            va_number: null,
            amount,
            fee: 0,
            total: amount,
            expired_at: null,
            checkout_url: '#',
            instructions: [{ title: 'Test Mode Aktif', steps: ['Pembayaran otomatis berhasil disimulasikan.'] }],
          },
          gatewayData: {
            bypass: true,
            test_mode: true,
            amount,
            checkout_url: '#',
            instructions: [{ title: 'Test Mode Aktif', steps: ['Pembayaran otomatis berhasil disimulasikan.'] }],
          },
        },
      });
    }

    // Normal payment flow (test mode OFF)
    const donation = await Donation.create({
      user_id: req.user.id,
      campaign_id,
      amount,
      message,
      is_anonymous: is_anonymous || false,
      squad_id: squad_id || null,
      status: 'pending',
    });

    // Generate unique order ID
    const orderId = `DNR-${Date.now()}-${donation.id}`;

    // Determine Tripay payment method code
    let tripayMethod = 'QRIS';
    if (payment_method === 'bank_transfer' && bank_code) {
      const bankMap = {
        bca: 'BCAVA',
        bni: 'BNIVA',
        bri: 'BRIVA',
        mandiri: 'MANDIRIVA',
        bsi: 'BSIVA',
        permata: 'PERMATAVA',
        cimb: 'CIMBVA',
      };
      tripayMethod = bankMap[bank_code.toLowerCase()] || 'BCAVA';
    }

    // Create Tripay transaction
    const callbackUrl = `${req.protocol}://${req.get('host')}/api/transactions/callback`;
    const returnUrl = process.env.FRONTEND_URL || 'http://localhost:5500';

    const tripayResponse = await tripayService.createTransaction({
      method: tripayMethod,
      merchantRef: orderId,
      amount,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      orderItems: [{
        name: `Donasi: ${campaign.title}`,
        price: amount,
        quantity: 1,
      }],
      callbackUrl,
      returnUrl: `${returnUrl}/payment-status.html?order_id=${orderId}`,
    });

    if (!tripayResponse.success) {
      await donation.update({ status: 'failed' });
      return res.status(400).json({ success: false, message: 'Gagal membuat pembayaran.', error: tripayResponse.message });
    }

    const tripayData = tripayResponse.data;

    // Create transaction record
    const transaction = await Transaction.create({
      donation_id: donation.id,
      order_id: orderId,
      payment_gateway: 'tripay',
      payment_method: payment_method || 'qris',
      bank_code: bank_code || null,
      qris_url: tripayData.qr_url || null,
      va_number: tripayData.pay_code || null,
      gross_amount: amount,
      fee_amount: tripayData.total_fee || 0,
      net_amount: amount - (tripayData.total_fee || 0),
      status: 'pending',
      gateway_reference_id: tripayData.reference,
      gateway_response_raw: JSON.stringify(tripayData),
      expired_at: new Date(tripayData.expired_time * 1000),
    });

    res.status(201).json({
      success: true,
      message: 'Donasi berhasil dibuat. Silakan lakukan pembayaran.',
      data: {
        donation,
        transaction: {
          order_id: orderId,
          payment_method: payment_method || 'qris',
          bank_code,
          qris_url: tripayData.qr_url || null,
          qr_string: tripayData.qr_string || null,
          va_number: tripayData.pay_code || null,
          amount,
          fee: tripayData.total_fee || 0,
          total: tripayData.amount || amount,
          expired_at: new Date(tripayData.expired_time * 1000),
          checkout_url: tripayData.checkout_url,
          instructions: tripayData.instructions || [],
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat donasi.', error: error.message });
  }
};

// GET /api/donations (user's donation history)
exports.getMyDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: donations } = await Donation.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        { model: Campaign, as: 'campaign', attributes: ['id', 'title', 'banner_image'] },
        { model: Transaction, as: 'transaction', attributes: ['order_id', 'payment_method', 'status', 'paid_at'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat donasi.', error: error.message });
  }
};

// GET /api/donations/:id
exports.getById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { model: Campaign, as: 'campaign' },
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'donatur', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donasi tidak ditemukan.' });
    }

    // Only allow the donor or admin to view
    if (donation.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    res.json({ success: true, data: { donation } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data donasi.', error: error.message });
  }
};

// GET /api/donations/recent (public - for homepage)
exports.getRecent = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { status: 'success' },
      include: [
        { model: User, as: 'donatur', attributes: ['id', 'name'] },
        { model: Campaign, as: 'campaign', attributes: ['id', 'title'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // Map: hide name if anonymous
    const mapped = donations.map((d) => {
      const obj = d.toJSON();
      if (obj.is_anonymous) {
        obj.donatur = { id: null, name: 'Anonim' };
      }
      return obj;
    });

    res.json({ success: true, data: { donations: mapped } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data donasi terbaru.', error: error.message });
  }
};
