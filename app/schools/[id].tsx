import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SchoolFormModal } from '@/components/schools/school-form-modal';
import { TurmaFormData, TurmaFormModal } from '@/components/turmas/turma-form-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MedievalTheme } from '@/constants/theme';
import { useSchools } from '@/src/application/contexts/SchoolsContext';
import { TurmasProvider, useTurmas } from '@/src/application/contexts/TurmasContext';
import { Turma, TURNO_LABEL } from '@/src/domain/entities/turma';

function TurmaCard({ turma, onDelete }: { turma: Turma; onDelete: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardName}>{turma.name}</Text>
        <Text style={styles.cardMeta}>{turma.academicYear}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={styles.shiftBadge}>
          <Text style={styles.shiftText}>{TURNO_LABEL[turma.shift]}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
          <IconSymbol name="trash" size={18} color={MedievalTheme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SchoolDetailContent({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const { turmas, isLoading, error, addTurma, deleteTurma } = useTurmas();
  const { updateSchool, deleteSchool } = useSchools();
  const school = useSchools().schools.find((s) => s.id === schoolId);

  const [editSchoolVisible, setEditSchoolVisible] = useState(false);
  const [addTurmaVisible, setAddTurmaVisible] = useState(false);

  const handleDeleteSchool = () =>
    Alert.alert('Excluir escola', `Deseja excluir "${schoolName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteSchool(schoolId);
          router.back();
        },
      },
    ]);

  const handleDeleteTurma = (t: Turma) =>
    Alert.alert('Excluir turma', `Deseja excluir "${t.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteTurma(t.id) },
    ]);

  const handleAddTurma = async (data: TurmaFormData) => {
    await addTurma({ ...data, schoolId });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: schoolName,
          headerBackTitle: 'Voltar',
          headerStyle: { backgroundColor: MedievalTheme.surface },
          headerTintColor: MedievalTheme.gold,
          headerTitleStyle: {
            color: MedievalTheme.textPrimary,
            fontSize: 18,
            fontWeight: '600',
          },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setEditSchoolVisible(true)} hitSlop={8}>
                <IconSymbol name="pencil" size={20} color={MedievalTheme.gold} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSchool} hitSlop={8}>
                <IconSymbol name="trash" size={20} color={MedievalTheme.textSecondary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🏫</Text>
          <Text style={styles.headerName}>{schoolName}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {turmas.length} {turmas.length === 1 ? 'turma' : 'turmas'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Turmas</Text>

        {isLoading && <View style={styles.centered}><ActivityIndicator size="large" color="#5B8A3C" /><Text style={styles.feedbackText}>Carregando...</Text></View>}
        {!isLoading && error && <Text style={styles.errorText}>{error}</Text>}
        {!isLoading && !error && turmas.length === 0 && <Text style={styles.feedbackText}>Nenhuma turma cadastrada.</Text>}
        {!isLoading && !error && turmas.map((t) => (
          <TurmaCard key={t.id} turma={t} onDelete={() => handleDeleteTurma(t)} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setAddTurmaVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <SchoolFormModal
        visible={editSchoolVisible}
        title="Editar Escola"
        initialValues={school}
        onClose={() => setEditSchoolVisible(false)}
        onSubmit={(data) => updateSchool(schoolId, data)}
      />
      <TurmaFormModal
        visible={addTurmaVisible}
        title="Nova Turma"
        onClose={() => setAddTurmaVisible(false)}
        onSubmit={handleAddTurma}
      />
    </>
  );
}

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { schools } = useSchools();
  const schoolName = schools.find((s) => s.id === id)?.name ?? 'Escola';

  return (
    <TurmasProvider schoolId={id}>
      <SchoolDetailContent schoolId={id} schoolName={schoolName} />
    </TurmasProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MedievalTheme.bg },
  content: { padding: 20, gap: 12 },
  header: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  headerEmoji: { fontSize: 56 },
  headerName: { fontSize: 20, fontWeight: '700', color: MedievalTheme.textPrimary, textAlign: 'center' },
  countBadge: {
    backgroundColor: MedievalTheme.btnSecondary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  countText: { fontSize: 13, fontWeight: '600', color: MedievalTheme.gold },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: MedievalTheme.textSecondary, marginTop: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: MedievalTheme.card, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: MedievalTheme.border,
    shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    elevation: 3,
  },
  cardLeft: { gap: 2 },
  cardName: { fontSize: 15, fontWeight: '700', color: MedievalTheme.textPrimary },
  cardMeta: { fontSize: 12, color: MedievalTheme.textSecondary },
  shiftBadge: {
    backgroundColor: MedievalTheme.btnSecondary, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  shiftText: { fontSize: 12, fontWeight: '600', color: MedievalTheme.gold },
  centered: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  feedbackText: { fontSize: 14, color: MedievalTheme.textSecondary, textAlign: 'center' },
  errorText: { fontSize: 14, color: '#CF6679', textAlign: 'center' },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deleteBtn: { padding: 4 },
  headerActions: { flexDirection: 'row', gap: 12, marginRight: 4 },
  fab: {
    position: 'absolute', bottom: 28, right: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: MedievalTheme.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, elevation: 6,
  },
  fabText: { fontSize: 28, color: MedievalTheme.bg, lineHeight: 32 },
});
