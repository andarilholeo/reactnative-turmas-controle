import { MedievalTheme } from '@/constants/theme';
import { Turno, TURNO_LABEL } from '@/src/domain/entities/turma';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, Modal, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';

export type TurmaFormData = { name: string; shift: Turno; academicYear: number };

interface Props {
  visible: boolean;
  title: string;
  initialValues?: Partial<TurmaFormData>;
  onClose: () => void;
  onSubmit: (data: TurmaFormData) => Promise<void>;
}

const TURNOS: Turno[] = ['morning', 'afternoon', 'evening'];
const CURRENT_YEAR = new Date().getFullYear();

export function TurmaFormModal({ visible, title, initialValues, onClose, onSubmit }: Props) {
  const [name,         setName]         = useState(initialValues?.name          ?? '');
  const [shift,        setShift]        = useState<Turno>(initialValues?.shift   ?? 'morning');
  const [academicYear, setAcademicYear] = useState(String(initialValues?.academicYear ?? CURRENT_YEAR));
  const [saving,       setSaving]       = useState(false);

  const handleOpen = () => {
    setName(initialValues?.name ?? '');
    setShift(initialValues?.shift ?? 'morning');
    setAcademicYear(String(initialValues?.academicYear ?? CURRENT_YEAR));
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'O nome da turma é obrigatório.';
    const year = Number(academicYear);
    if (!year || year < 2000 || year > 2100) return 'Informe um ano letivo válido (ex: 2025).';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { Alert.alert('Campo inválido', err); return; }
    try {
      setSaving(true);
      await onSubmit({ name: name.trim(), shift, academicYear: Number(academicYear) });
      onClose();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a turma.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={handleOpen}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.label}>Nome da turma *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: 1º Ano A"
            placeholderTextColor={MedievalTheme.accent}
          />

          <Text style={styles.label}>Turno *</Text>
          <View style={styles.shiftRow}>
            {TURNOS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.shiftBtn, shift === t && styles.shiftBtnActive]}
                onPress={() => setShift(t)}
              >
                <Text style={[styles.shiftBtnText, shift === t && styles.shiftBtnTextActive]}>
                  {TURNO_LABEL[t]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Ano letivo *</Text>
          <TextInput
            style={styles.input}
            value={academicYear}
            onChangeText={setAcademicYear}
            keyboardType="number-pad"
            placeholder="2025"
            placeholderTextColor={MedievalTheme.accent}
            maxLength={4}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose} disabled={saving}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={handleSubmit} disabled={saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnSaveText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:           { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: MedievalTheme.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 8,
    borderTopWidth: 1, borderColor: MedievalTheme.border,
  },
  title:             { fontSize: 18, fontWeight: '700', color: MedievalTheme.textPrimary, marginBottom: 8 },
  label:             { fontSize: 13, fontWeight: '600', color: MedievalTheme.textSecondary },
  input: {
    borderWidth: 1, borderColor: MedievalTheme.border, borderRadius: 10,
    padding: 12, fontSize: 15,
    color: MedievalTheme.textPrimary,
    backgroundColor: MedievalTheme.card,
    marginBottom: 4,
  },
  shiftRow:          { flexDirection: 'row', gap: 8, marginBottom: 4 },
  shiftBtn: {
    flex: 1, padding: 10, borderRadius: 8,
    borderWidth: 1, borderColor: MedievalTheme.border,
    backgroundColor: MedievalTheme.card,
    alignItems: 'center',
  },
  shiftBtnActive:    { backgroundColor: MedievalTheme.gold, borderColor: MedievalTheme.gold },
  shiftBtnText:      { fontSize: 12, color: MedievalTheme.textSecondary, fontWeight: '600' },
  shiftBtnTextActive:{ color: MedievalTheme.bg },
  actions:           { flexDirection: 'row', gap: 12, marginTop: 12 },
  btnCancel: {
    flex: 1, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: MedievalTheme.border,
    backgroundColor: MedievalTheme.btnSecondary,
    alignItems: 'center',
  },
  btnCancelText:     { color: MedievalTheme.textSecondary, fontWeight: '600' },
  btnSave:           { flex: 1, padding: 14, borderRadius: 10, backgroundColor: MedievalTheme.gold, alignItems: 'center' },
  btnSaveText:       { color: MedievalTheme.bg, fontWeight: '700' },
});
