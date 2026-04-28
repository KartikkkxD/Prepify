export const theme = {
  colors: {
    background: '#FFF6E9',
    primary: '#FF7A00',
    accent: '#FFD93D',
    secondary: '#4ECDC4',
    text: '#1A1A1A',
    white: '#FFFFFF',
    danger: '#FF4757',
    disabled: '#E0E0E0',
    success: '#2ED573',
  },
  borders: {
    width: 3,
    radius: 16,
    color: '#1A1A1A',
  },
  shadows: {
    brutal: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    brutalSmall: {
      shadowColor: '#1A1A1A',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    brutalNone: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    }
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 36,
      fontWeight: '900',
      letterSpacing: -1,
      color: '#1A1A1A',
    },
    h2: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: '#1A1A1A',
    },
    h3: {
      fontSize: 20,
      fontWeight: '800',
      color: '#1A1A1A',
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1A1A1A',
    },
    body: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    caption: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1A1A1A',
    }
  }
};
