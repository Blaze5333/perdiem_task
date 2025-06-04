/*eslint-disable*/
import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

// Color palette for home styles


export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: StatusBar.currentHeight || 0, // Adjust for status bar height
  },
  
  // Store status styles
  openIcon: {
    backgroundColor: '#4CAF50', // Green
  },
  closedIcon: {
    backgroundColor: '#F44336', // Red
  },
  loadingDot: {
    backgroundColor: '#FFC107', // Yellow/amber for loading state
  },
  storeStatusText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  openText: {
    color: '#4CAF50', // Green
  },
  closedText: {
    color: '#F44336', // Red
  },

  // Next opening info styles
  nextOpeningContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 67, 54, 0.2)', // Light red border
  },
  nextOpeningText: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: '500',
  },
  nextOpeningTzText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },

  // Home Screen Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop:StatusBar.currentHeight
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray900,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 14,
    color: colors.gray500,
  },
  homeContent: {
    flex: 1,
    // paddingHorizontal: 24,
    paddingTop: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 12,
  },
  toggleContainer: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: 16,
    padding: 4,
  },
  toggleBackground: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: "50%",
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  toggleOptionActive: {
    // Active styles handled by background animation
  },
  toggleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: colors.gray500,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
  },
  appointmentCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 12,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentIconText: {
    fontSize: 16,
    color: colors.white,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: colors.primary,
    opacity: 0.8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: 16,
    padding: 16,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.gray700,
  },
  dateButtonArrow: {
    fontSize: 16,
    color: colors.gray400,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.gray500,
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  dateItemContent: {
    flex: 1,
  },
  dateItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: 2,
  },
  dateItemLabel: {
    fontSize: 12,
    color: colors.gray500,
  },
  dateItemArrow: {
    fontSize: 16,
    color: colors.gray400,
  },
  selectedDateText: {
    fontSize: 14,
    color: colors.gray500,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    width: (width - 64) / 3 - 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedTimeSlotText: {
    color: colors.white,
    fontWeight: '600',
  },
  closedTimeSlot: {
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
  },
  closedTimeSlotText: {
    color: colors.gray400,
  },
  profileImage:{height:40,width:40,borderRadius:20}
})
