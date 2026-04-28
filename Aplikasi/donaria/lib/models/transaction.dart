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
      amount: json['amount'] ?? 0,
      fee: json['fee'] ?? 0,
      total: json['total'] ?? json['amount'] ?? 0,
      expiredAt: json['expired_at'] != null ? DateTime.tryParse(json['expired_at']) : null,
      checkoutUrl: json['checkout_url'],
      instructions: instructionsList,
    );
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
