import { MedievalTheme } from '@/constants/theme';
import { CreateSchoolDTO } from '@/src/entities/school';
import { useState } from 'react';
import {
  ActivityIndicator, Alert, Modal, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  initialValues?: Partial<CreateSchoolDTO>;
  onClose: () => void;
  onSubmit: (data: CreateSchoolDTO) => Promise<void>;
}

export function SchoolFormModal({ visible, title, initialValues, onClose, onSubmit }: Props) {
  const [name, setName]       = useState(initialValues?.name    ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [saving, setSaving]   = useState(false);

  const handleOpen = () => {
    setName(initialValues?.name    ?? '');
    setAddress(initialValues?.address ?? '');
  };

  const validate = (): string | null => {
    if (!name.trim())    return 'O nome da escola é obrigatório.';
    if (name.trim().length < 3) return 'Nome deve ter ao menos 3 caracteres.';
    if (!address.trim()) return 'O endereço é obrigatório.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { Alert.alert('Campo inválido', err); return; }
    try {
      setSaving(true);
      await onSubmit({ name: name.trim(), address: address.trim() });
      onClose();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a escola.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={handleOpen}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.label}>Nome da escola *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Escola Municipal Dom Pedro I"
            placeholderTextColor={MedievalTheme.accent}
          />

          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Ex: Rua das Flores, 123 – Centro"
            placeholderTextColor={MedievalTheme.accent}
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
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: MedievalTheme.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 8,
    borderTopWidth: 1, borderColor: MedievalTheme.border,
  },
  title:         { fontSize: 18, fontWeight: '700', color: MedievalTheme.textPrimary, marginBottom: 8 },
  label:         { fontSize: 13, fontWeight: '600', color: MedievalTheme.textSecondary },
  input: {
    borderWidth: 1, borderColor: MedievalTheme.border, borderRadius: 10,
    padding: 12, fontSize: 15,
    color: MedievalTheme.textPrimary,
    backgroundColor: MedievalTheme.card,
    marginBottom: 4,
  },
  actions:       { flexDirection: 'row', gap: 12, marginTop: 12 },
  btnCancel: {
    flex: 1, padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: MedievalTheme.border,
    backgroundColor: MedievalTheme.btnSecondary,
    alignItems: 'center',
  },
  btnCancelText: { color: MedievalTheme.textSecondary, fontWeight: '600' },
  btnSave:       { flex: 1, padding: 14, borderRadius: 10, backgroundColor: MedievalTheme.gold, alignItems: 'center' },
  btnSaveText:   { color: MedievalTheme.bg, fontWeight: '700' },
});
