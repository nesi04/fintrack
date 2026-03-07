import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

export default function SummaryWidget({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.panelBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10
  },
  label: { color: colors.dim, marginBottom: 4 },
  value: { color: colors.text, fontSize: 22, fontWeight: '700' }
});
