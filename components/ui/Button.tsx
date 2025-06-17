import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { Colors } from '../../constants/colors'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }

    const sizeStyles = {
      sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 },
      lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 },
    }

    const variantStyles = {
      primary: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      secondary: {
        backgroundColor: Colors.secondary,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
      ...style,
    }
  }

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    }

    const sizeTextStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    }

    const variantTextStyles = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: Colors.primary },
      ghost: { color: Colors.primary },
    }

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    }
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#FFFFFF'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  )
} 