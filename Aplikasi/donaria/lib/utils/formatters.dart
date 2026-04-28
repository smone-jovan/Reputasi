import 'package:intl/intl.dart';

String formatCurrency(int amount) {
  final formatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );
  return formatter.format(amount);
}

String formatCompactCurrency(int amount) {
  if (amount >= 1000000000) return 'Rp ${(amount / 1000000000).toStringAsFixed(1)} M';
  if (amount >= 1000000) return 'Rp ${(amount / 1000000).toStringAsFixed(1)} Jt';
  if (amount >= 1000) return 'Rp ${(amount / 1000).toStringAsFixed(0)} Rb';
  return 'Rp $amount';
}

String formatDate(DateTime? date) {
  if (date == null) return '-';
  return DateFormat('d MMMM yyyy', 'id_ID').format(date);
}

String formatTimeAgo(DateTime? date) {
  if (date == null) return '-';
  final diff = DateTime.now().difference(date);
  if (diff.inSeconds < 60) return 'Baru saja';
  if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
  if (diff.inHours < 24) return '${diff.inHours} jam lalu';
  if (diff.inDays < 7) return '${diff.inDays} hari lalu';
  return formatDate(date);
}
