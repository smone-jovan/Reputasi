class TransactionData {
  final String orderId;
  final String paymentMethod;
  final String? bankCode;
  final String? qrisUrl;
  final String? qrString;
  final String? vaNumber;
  final int amount;
  final int fee;
  final int total;
  final DateTime? expiredAt;
  final String? checkoutUrl;
  final List<PaymentInstruction> instructions;

  TransactionData({
    required this.orderId,
    required this.paymentMethod,
    this.bankCode,
    this.qrisUrl,
    this.qrString,
    this.vaNumber,
    required this.amount,
    this.fee = 0,
    required this.total,
    this.expiredAt,
    this.checkoutUrl,
    this.instructions = const [],
  });

  factory TransactionData.fromJson(Map<String, dynamic> json) {
    final instructionsList = (json['instructions'] as List?)
            ?.map((i) => PaymentInstruction.fromJson(i))
            .toList() ??
        [];

    return TransactionData(
      orderId: json['order_id'] ?? '',
      paymentMethod: json['payment_method'] ?? 'qris',
      bankCode: json['bank_code'],
      qrisUrl: json['qris_url'],
      qrString: json['qr_string'],
      vaNumber: json['va_number'],
      amount: _parseInt(json['amount']),
      fee: _parseInt(json['fee']),
      total: _parseInt(json['total'] ?? json['amount']),
      expiredAt: json['expired_at'] != null ? DateTime.tryParse(json['expired_at']) : null,
      checkoutUrl: json['checkout_url'],
      instructions: instructionsList,
    );
  }

  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value) ?? (double.tryParse(value)?.toInt() ?? 0);
    return 0;
  }

  bool get isQris => paymentMethod == 'qris';
}

class PaymentInstruction {
  final String title;
  final List<String> steps;

  PaymentInstruction({required this.title, required this.steps});

  factory PaymentInstruction.fromJson(Map<String, dynamic> json) {
    return PaymentInstruction(
      title: json['title'] ?? '',
      steps: (json['steps'] as List?)?.map((s) => s.toString()).toList() ?? [],
    );
  }
}
