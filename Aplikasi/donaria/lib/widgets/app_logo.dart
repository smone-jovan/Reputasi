import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Reusable Donaria logo widget using SVG mosque icon.
/// Replaces the old Text('🕌') emoji approach for consistent cross-device rendering.
class AppLogo extends StatelessWidget {
  final double size;

  const AppLogo({super.key, this.size = 40});

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      'assets/emojis/mosque.svg',
      width: size,
      height: size,
      semanticsLabel: 'Donaria Logo',
    );
  }
}
