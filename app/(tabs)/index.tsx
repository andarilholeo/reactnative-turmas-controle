import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { SchoolFormModal } from '@/components/schools/school-form-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MedievalTheme } from '@/constants/theme';
import { useSchoolFilter } from '@/hooks/use-school-filter';
import { useSchools } from '@/src/contexts/SchoolsContext';
import { School } from '@/src/entities/school';

function MedievalHeader() {
  return (
    <ImageBackground
      source={require('@/assets/images/medieval_school.jpg')}
      style={styles.headerBg}
      resizeMode="cover"
    >
      <View style={styles.headerOverlay} />
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Escolas Públicas</Text>
        <Text style={styles.headerSubtitle}>Sistema de Controle de Turmas</Text>
      </View>
    </ImageBackground>
  );
}

function SchoolCard({ school }: { school: School }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push({ pathname: '/schools/[id]', params: { id: school.id } } as unknown as Href)
      }
    >
      <View style={styles.cardIconBox}>
        <Text style={styles.cardIcon}>🏫</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{school.name}</Text>
        <Text style={styles.cardAddress}>{school.address}</Text>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>Ver turmas →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { schools, isLoading, error, addSchool } = useSchools();
  const [query, setQuery]           = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const filtered = useSchoolFilter(schools, query);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: MedievalTheme.bg, dark: MedievalTheme.bg }}
        headerImage={<MedievalHeader />}>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar escola…"
            placeholderTextColor="#aaa"
            clearButtonMode="while-editing"
          />
        </View>

        <ThemedView style={styles.summaryRow}>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryNumber}>{schools.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Escolas</ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryNumber}>{filtered.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Exibindo</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Escolas Cadastradas</ThemedText>
        </ThemedView>

        {isLoading && (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color="#5B8A3C" />
            <ThemedText style={styles.feedbackText}>Carregando escolas...</ThemedText>
          </ThemedView>
        )}
        {!isLoading && error && (
          <ThemedView style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </ThemedView>
        )}
        {!isLoading && !error && filtered.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </ParallaxScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <SchoolFormModal
        visible={formVisible}
        title="Nova Escola"
        onClose={() => setFormVisible(false)}
        onSubmit={addSchool}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  headerContent: {
    padding: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    color: MedievalTheme.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: MedievalTheme.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedievalTheme.border,
    backgroundColor: MedievalTheme.card,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: MedievalTheme.gold,
  },
  summaryLabel: {
    fontSize: 13,
    color: MedievalTheme.textSecondary,
    marginTop: 2,
  },

  sectionHeader: {
    marginTop: 4,
    marginBottom: 4,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MedievalTheme.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MedievalTheme.border,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: MedievalTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: MedievalTheme.textPrimary,
    marginBottom: 2,
  },
  cardAddress: {
    fontSize: 12,
    color: MedievalTheme.textSecondary,
    marginBottom: 6,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: MedievalTheme.btnSecondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: MedievalTheme.gold,
  },

  centered: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  feedbackText: {
    fontSize: 14,
    color: MedievalTheme.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: '#CF6679',
    textAlign: 'center',
  },

  searchRow: { marginBottom: 4 },
  searchInput: {
    backgroundColor: MedievalTheme.surface,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: MedievalTheme.textPrimary,
    borderWidth: 1,
    borderColor: MedievalTheme.border,
  },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: MedievalTheme.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 28, color: MedievalTheme.bg, lineHeight: 32 },
});
